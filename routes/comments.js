var express = require("express");
var router  = express.Router({ mergeParams:true}); 
var Campground = require("../models/campground");
var Comment = require("../models/comment");


 //Comment new     
    router.get("/new", isLoggedIn, function(req, res){
        Campground.findById(req.params.id, function(err , campground){
            if(err){
                console.log(err);
            } else {
                res.render("comments/new", { campground:campground});
            }
        });
    });
//Comment create
    router.post("/", isLoggedIn, function(req, res){
        Campground.findById(req.params.id , function(err, campground){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                //create a new comment 
                Comment.create(req.body.comment , function(err , comment){
                if(err){
                    console.log(err);
                } else {
                    //Add username and id to commet 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id )
                    console.log(comment.author.username);
                }
            })
            }
        });
    });
// Comment Edit
// checkcommentOwnership,
router.get("/:comment_id/eidt", function(req, res){
// res.send("comment edit page ");
    Comment.findById(req.params.comment_id , function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit" , {campground_id:req.params.id , comment:foundComment})
        }
    });
});    
//Comment Update  
// checkcommentOwnership,
router.put("/:comment_id", function(req , res){
    Comment.findByIdAndUpdate( req.params.comment_id , req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            console.log(req.params.id);
           res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Comment Destroy Route
// checkcommentOwnership,
router.delete("/:comment_id", function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            console.log(req.params.id);
            res.redirect("/campgrounds/" + req.params.id);
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
//CheckCommentOwnership
function checkcommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id , function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                console.log(foundComment.author.id);
                console.log(req.user.id);
                //does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }  
        });
    }  else {
        res.redirect("back");
    }
}

module.exports = router;