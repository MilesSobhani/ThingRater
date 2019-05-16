var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var Campground = require("../models/campgrounds");
var middleware = require("../middleware/index.js");

//Comments Routes
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground:foundCampground});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Comment successfully added!")
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
    });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkOwnerComment, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    if(err || !foundCampground){
        req.flash("error", "Item not found, sorry about that.");
        return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
        res.render("comments/edit", {campground_id: req.params.id, comment:foundComment}); 
        });
    });
});

router.put("/:comment_id", middleware.checkOwnerComment, function(req, res){
    Comment.findOneAndUpdate({_id:req.params.comment_id}, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went wrong... sorry about that.")
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkOwnerComment, function(req, res){
    Comment.findOneAndDelete({_id:req.params.comment_id}, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Comment deleted.")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;