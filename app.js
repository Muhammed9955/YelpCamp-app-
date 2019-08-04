    var express  = require("express");
    var app      = express();
    var request  = require("request");  
    var bodyParser = require("body-parser");
    var mongoose = require("mongoose");
    var passport  = require("passport");
    var LocalStrategy = require("passport-local");
    var methodOverride = require("method-override");
    var flash         = require("connect-flash");
    var Campground = require("./models/campground");
    var Comment    = require("./models/comment");
    var User = require("./models/user");
    var seedDB     = require("./seeds");
    
    // Requring routes
    var commnetRoutes = require("./routes/comments");
    var camgroundRoutes = require("./routes/campgrounds");
    var indexRoutes = require("./routes/index");


    // seedDB();
    app.use(bodyParser.urlencoded({extented:true}));
    app.set("view engine","ejs");
    
    // var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_11";
    // mongoose.connect(url);
    mongoose.connect("mongodb+srv://medo:medo1995@cluster0-l9wzj.mongodb.net/yelp_camp_12");
    // mongoose.connect("mongodb://localhost/yelp_camp_11");


    app.use(express.static("public"));
    app.use(methodOverride("_method"));
    app.use(flash());
    // Passport Configuration
    app.use(require("express-session")({
        secret:"my secret message is ...",
        resave:false,
        saveUninitialized:false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));   
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use(function(req,res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });
    //routes shortcut 
    app.use( "/" ,indexRoutes);
    app.use( "/campgrounds",  camgroundRoutes);
    app.use( "/campgrounds/:id/comments", commnetRoutes);

        let port = process.env.PORT;
        if (port == null || port == "") {
        port = 8000;
        }
        app.listen(port);

    app.listen(port, function(){
    console.log("The YelpCamp Server has started")
    });

    // app.listen(process.env.PORT , process.env.IP , function(){
    //     console.log("The YelpCamp Server has started")
    //     });