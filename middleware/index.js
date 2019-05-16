var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be logged in to complete that action.");
        res.redirect("/login");
    }
    
middlewareObj.checkOwnerCampground = function(req, res, next){
            if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
              if(err || !foundCampground){
                  req.flash("error", "Item not found, sorry about that.")
                  res.redirect("back");
                } else if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to perform that action.")
                    res.redirect("back");
                }
            });        
        } else {
            req.flash("error", "You must be logged in to complete that action.")
            res.redirect("back");
        }
    }
    
middlewareObj.checkOwnerComment = function(req, res, next){
        if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err || !foundComment){
                req.flash("error", "Item not found, sorry about that.")
                res.redirect("back");
            } else if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You do not have permission to complete that action.")
                res.redirect("back");
            }
        });        
        } else {
            req.flash("error", "You must be logged in to complete that action.")
            res.redirect("back");
        }
    }

module.exports = middlewareObj;