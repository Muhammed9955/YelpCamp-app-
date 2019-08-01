var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
    {
        name:"Amzing sunset",
        image:"https://cdn.pixabay.com/photo/2016/09/05/12/48/camping-1646504__340.jpg",
        description:"blah blah blah"
    },
    {
        name:"Amzing night",
        image:"https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg",
        description:"blah blah blah"
    },
    {
        name:"camping outdoor travel ",
        image:"https://cdn.pixabay.com/photo/2017/08/06/02/32/camp-2587926__340.jpg",
        description:"blah blah blah"
    }
];

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }  
        console.log("removed campgrouds");
        //add some campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err,campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //Create a comment
                        Comment.create({
                            text:"This palce is amazing but I wish if there was internet",
                            auther:"Homer"
                        }, function(err ,comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }
                        });
                        
                    }
                });
            });
    });
    
}

module.exports = seedDB ;