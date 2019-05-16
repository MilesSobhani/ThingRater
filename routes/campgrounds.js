var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res){

    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {id: req.user._id,
                  username: req.user.username};
    var newCampground = {name: name, price:price, image: image, description: desc, author:author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Item successfully created!")
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
            req.flash("error", "Item not found... sorry about that.")
            res.redirect("back")
       } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

//Edit Route
router.get("/:id/edit", middleware.checkOwnerCampground, function(req, res){

        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});  

    });

});

router.put("/:id", middleware.checkOwnerCampground, function(req, res){

    // if(req.user.username === )
    Campground.findOneAndUpdate({_id:req.params.id}, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//Destroy Route
router.delete("/:id", middleware.checkOwnerCampground, function(req, res){
    Campground.findOneAndDelete({_id:req.params.id}, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/");
        }
    });
});



module.exports = router;