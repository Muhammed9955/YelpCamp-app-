var express = require("express");
var router      = express.Router();
var Campground = require("../models/campground");

// Index route - show all campgrounds
router.get("/" , function(req,res ){
    // console.log(req.user);
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else 
        res.render("campgrounds/index",{campgrounds:allCampgrounds , currentUser:req.user});
    })
});

//NEW - Show a form to creat new campground
router.get("/new",isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

// Create a new campground and save it to db
router.post("/",isLoggedIn, function(req,res){
    var name = req.body.name ;
    var price = req.body.price ;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id ,
        username: req.user.username
    };
    var newCampground = { name:name ,price:price, image:image, description:description , author:author}; 

    Campground.create(newCampground, function(err, newlyCreated){
        if(err){ 
            console.log(err);
        }else{
            // redirect back to campground page 
            console.log(newCampground);
            req.flash("success", "created a new campground ");
            res.redirect("/campgrounds");
        }
    })
});

// SHow more info about one campground 
router.get("/:id",  function(req,res){
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else {
            //show the template with that campground
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//Edit route
router.get("/:id/edit",checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id , function(err , foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground} );  
    });
});
//Update Route 
router.put("/:id",checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground , function(err,updatedCampground){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            redirect("/campgrounds");
        } else {
            req.flash("success", "campground updated successfully");
            res.redirect("/campgrounds/" + req.params.id )
        }
    });
})
//destroy campground route 
router.delete("/:id",checkCampgroundOwnership, function(req ,res){
    Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", " campground has been deleted successfully");
            res.redirect("/campgrounds");
        }
    });
});

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}
//CheckCamgroundOwnership
function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id , function(err, foundCampground){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                console.log(foundCampground.author.id);
                console.log(req.user.id);
                //does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            }  
        });
    }  else {
        req.flash("error", "Please login First!");
        res.redirect("back");
    }
}

module.exports = router;