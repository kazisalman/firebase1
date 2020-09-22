const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const PORT = process.env.PORT || 3000
const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "Salmankazi",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


mongoose.connect("mongodb://localhost/newinsightsDB", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true)

const courseSchema = new mongoose.Schema({
    image_add: String,
    course_name: String,
    course_desc: String,
    desc_1: String,
    desc_2: String,
    desc_3: String,
    desc_4: String,
    syll_1: String,
    syll_2: String,
    syll_3: String,
    syll_4: String,
    syll_5: String,
    syll_6: String,
    syll_7: String,
    syll_8: String,
    syll_9: String,

    price: Number,
    tutor: String,

});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

const Course = mongoose.model("Course", courseSchema);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", function (req, res) {

    Course.find({}, (err, courses) => {
        res.render("home", {
            courses
        })
        if (err) {
            console.log(err)
        }
    }).limit(4)
});

app.get("/allcourses", (req, res) => {

    Course.find({}, (err, courses) => {
        res.render("allcourses", {
            courses
        })
        if (err) {
            console.log(err)
        }
    })

})


app.post("/newCourse", function (req, res) {
    const course = new Course({
        image_add: req.body.image_add,
        course_name: req.body.course_name,
        course_desc: req.body.course_desc,
        price: req.body.price,
        tutor: req.body.tutor,
        desc_1: req.body.desc_1,
        desc_2: req.body.desc_2,
        desc_3: req.body.desc_3,
        desc_4: req.body.desc_4,
        syll_1: req.body.syll_1,
        syll_2: req.body.syll_2,
        syll_3: req.body.syll_3,
        syll_4: req.body.syll_4,
        syll_5: req.body.syll_5,
        syll_6: req.body.syll_6,
        syll_7: req.body.syll_7,
        syll_8: req.body.syll_8,
        syll_9: req.body.syll_9,
    });


    course.save(function (err) {
        if (!err) {
            res.redirect("adminhome");
        }
    });

});


app.get("/abc/:courseID", function (req, res) {

    const requestCourseId = req.params.courseID

    Course.findOne({ _id: requestCourseId }, function (err, course) {
        if (err) {
            console.log(err)
        } else {
            res.render("abc", {
                image_add: course.image_add,
                course_name: course.course_name,
                course_desc: course.course_desc,
                tutor: course.tutor,
                price: course.price,
                desc_1: course.desc_1,
                desc_2: course.desc_2,
                desc_3: course.desc_3,
                desc_4: course.desc_4,
                syll_1: course.syll_1,
                syll_2: course.syll_2,
                syll_3: course.syll_3,
                syll_4: course.syll_4,
                syll_5: course.syll_5,
                syll_6: course.syll_6,
                syll_7: course.syll_7,
                syll_8: course.syll_8,
                syll_9: course.syll_9,

            })
        }

    })
})

app.get("/newcourse", (req, res) => {
    res.render("newCourse")
}
)

app.get("/editcourse/:courseID", (req, res) => {

    const requestCourseId = req.params.courseID
    console.log(requestCourseId)

    Course.findOne({ _id: requestCourseId }, function (err, course) {
        if (err) {
            console.log(err)
        } else {
            res.render("editcourse", {
                _id: course._id,
                image_add: course.image_add,
                course_name: course.course_name,
                course_desc: req.body.course_desc,
                tutor: course.tutor,
                price: course.price,
                desc_1: course.desc_1,
                desc_2: course.desc_2,
                desc_3: course.desc_3,
                desc_4: course.desc_4,
                syll_1: course.syll_1,
                syll_2: course.syll_2,
                syll_3: course.syll_3,
                syll_4: course.syll_4,
                syll_5: course.syll_5,
                syll_6: course.syll_6,
                syll_7: course.syll_7,
                syll_8: course.syll_8,
                syll_9: course.syll_9,

            })
        }

    })
}
)

app.post("/editcourse", (req, res) => {
    const requestCourseId = req.body.course_id
    Course.findByIdAndUpdate({ _id: requestCourseId }, {
        image_add: req.body.image_add,
        course_name: req.body.course_name,
        course_desc: req.body.course_desc,
        price: req.body.price,
        tutor: req.body.tutor,
        desc_1: req.body.desc_1,
        desc_2: req.body.desc_2,
        desc_3: req.body.desc_3,
        desc_4: req.body.desc_4,
        syll_1: req.body.syll_1,
        syll_2: req.body.syll_2,
        syll_3: req.body.syll_3,
        syll_4: req.body.syll_4,
        syll_5: req.body.syll_5,
        syll_6: req.body.syll_6,
        syll_7: req.body.syll_7,
        syll_8: req.body.syll_8,
        syll_9: req.body.syll_9,
    }, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("adminhome")
        }
    })
}
)

app.get("/deletecourse/:courseID", (req, res) => {

    const requestCourseId = req.params.courseID
    console.log(requestCourseId)

    // var uid = req.params.id.toString();



    Course.findByIdAndRemove({ _id: requestCourseId }, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }

    })
}
)


app.get("/Adminlogin", (req, res) => {

    Course.find({}, function (err, course) {
        if (err) {
            console.log(err)
        } else {
            res.render("Adminlogin", {
                image_add: course.image_add,
                course_name: course.course_name,
                course_desc: req.body.course_desc,
                tutor: course.tutor,
                price: course.price,
                desc_1: course.desc_1,
                desc_2: course.desc_2,
                desc_3: course.desc_3,
                desc_4: course.desc_4,
                syll_1: course.syll_1,
                syll_2: course.syll_2,
                syll_3: course.syll_3,
                syll_4: course.syll_4,
                syll_5: course.syll_5,
                syll_6: course.syll_6,
                syll_7: course.syll_7,
                syll_8: course.syll_8,
                syll_9: course.syll_9,

            })
        }

    })



    // res.render("admin/Adminlogin")
})



app.post("/Adminlogin", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    console.log(user)

    req.login(user, function (err) {
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/adminhome")
            })
        }
    })



})

app.get("/adminlogout", (req, res) => {
    req.logout()
    res.redirect("/adminlogin")
}
)

app.get("/Adminregister", (req, res) => {
    res.render("Adminregister")
})

app.post("/Adminregister", (req, res) => {

    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            res.redirect("/Adminregister")
        } else {
            passport.authenticate("local")(
                req, res, function () {
                    res.redirect("Adminhome")
                }
            )
        }
    })

})


app.get("/Adminhome", (req, res) => {

    Course.find({}, function (err, course) {
        if (err) {
            console.log(err)
        } else {
            res.render("Adminhome", {
                course,
                image_add: course.image_add,
                course_name: course.course_name,
                course_desc: req.body.course_desc,
                tutor: course.tutor,
                price: course.price,
                desc_1: course.desc_1,
                desc_2: course.desc_2,
                desc_3: course.desc_3,
                desc_4: course.desc_4,
                syll_1: course.syll_1,
                syll_2: course.syll_2,
                syll_3: course.syll_3,
                syll_4: course.syll_4,
                syll_5: course.syll_5,
                syll_6: course.syll_6,
                syll_7: course.syll_7,
                syll_8: course.syll_8,
                syll_9: course.syll_9,

            })
        }
    })
    // if (req.isAuthenticated()) {

    //     // res.render("admin/Adminhome")
    // } else {
    //     res.redirect("adminlogin")
    // }
})




app.listen(PORT, function () {
    console.log("Server started on port 3000");
});
