var express = require("express");
var bp = require("body-parser");
const e = require("express");
const { Db, ObjectId } = require("mongodb");
var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost/";
var app = express();

app.listen(8888, function () { console.log("Server is listening"); });
app.use(express.static(__dirname));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render('home');
});

app.get("/home", function (req, res) {
    res.render('home');
});

app.get("/register", function (req, res) {
    res.render('register');
});

var users = ['JonSnow8', 'Javascript29', 'User88'];

app.post("/register", function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var email = req.body.email;
    var password = req.body.password;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log("Conenction failed");
        } else {
            console.log("Conenction succed");
            var DB = db.db('my_db');
            var user = pop(users);
            //TODO: If user.isEmpty() then db.close();
            var obj = { Firstname: firstname, Lastname: lastname, Age : age, Username: user, Email: email, Password: password };
            console.log(users)
            DB.collection("users").insertOne(obj, function (err2, res) {
                if (err2) {
                    console.log("error with DB");
                } else {
                    console.log("inserted obj");
                }
                db.close();
            });
        }
    });
    res.redirect('/register');
});

var my_email, my_password;

app.post("/login", function (req, res) {
    var email = req.body.email_login;
    var password = req.body.password_login;
    my_email = email;
    my_password = password;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db login');
        } else {
            var DB = db.db('my_db');
            DB.collection('users').findOne({ Email: email, Password: password }, function (err2, res) {
                if (err2 || res == null) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(res);
                }
                db.close();
            });
        }
    });
    if (email == "admin@info.com") {
        res.redirect('/home-admin');
    } else {
        res.redirect("/home-login");
    }
});

app.get("/home-login", function (req, res) {
    res.render('home-login');
});

app.get("/logout", function (req, res) {
    res.render('home');
});

app.get("/profile", function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            console.log("the email" + my_email);
            var DB = db.db('my_db');
            DB.collection('users').find({ Email: my_email }).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(rows);
                    res.render("profile", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.get("/update", function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('users').find({ Email: my_email }).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    res.render("update", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post("/update", function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db update');
        } else {
            var DB = db.db('my_db');
            DB.collection('users').updateOne({ Email: my_email, Password: my_password }, { $set: { Firstname: firstname, Lastname: lastname, Username: username, Email: email, Password: password } },
                function (err2, res) {
                    if (err2) {
                        console.log("No user was updated");
                        throw err2;
                    } else {
                        console.log('user was updated');
                        my_email = email;
                    } db.close();
                });
        }
    });
    res.redirect('/profile');
});

app.get("/destination", function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('sights').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(rows);
                    res.render("destination", { data: rows });
                }
                db.close();
            });
        }
    });
});


app.get("/destination-login", function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('sights').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(rows);
                    res.render("destination-login", { data: rows });
                }
                db.close();
            });
        }
    });
});

//TODO: Αξιοθέατα προορισμού --> εισαγωγή σε DB από τον διαχειριστή
app.get('/bookNow', function (req, res) {
    res.render('bookNow')
});


app.get('/example', function (req, res) {
    res.render('example');
});

app.get('/BednBreakfast', function (req, res) {
    res.render('BednBreakfast');
});


app.post('/bookNow', function (req, res) {
    var firstnames = req.body.fnames;
    var lastnames = req.body.lnames;
    var dateOfbirths = req.body.dobs;
    var idNums = req.body.ccnum;
    var totalAmount = req.body.total;
    var checkinday = req.body.checkInDay;
    var checkinmonth = req.body.checkInmonth;
    var checkoutday = req.body.checkOutDay;
    var checkoutmonth = req.body.checkOutmonth
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db booknow');
        } else {
            var DB = db.db('my_db');
            var obj = {
                Firstnames: firstnames, Lastnames: lastnames, DateOfbirths: dateOfbirths, ID_numbers: idNums, Total_Amount: totalAmount,
                Check_in_day: checkinday, Check_in_month: checkinmonth, Check_out_day: checkoutday, Check_out_month: checkoutmonth
            };
            DB.collection('stay').insertOne(obj, function (err2, res) {
                if (err2) {
                    console.log("error inserting accomondation");
                } else {
                    console.log("inserted accomondation");
                }
                db.close();
            });
        }
    });
    res.redirect('/bookNow');
});

app.get('/thingsToDo', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('activities').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No activity was found");
                    throw err2;
                } else {
                    res.render("thingsToDo", { data: rows });
                }
                db.close();
            });
        }
    });
});
//TODO2: Insert more accomondations

app.post('/events', function (req, res) {
    var firstnames = req.body.fnames;
    var lastnames = req.body.lnames;
    var dateOfbirths = req.body.dobs;
    var idNums = req.body.ccnum;
    var totalAmount = req.body.total;
    var checkinday = req.body.checkInDay;
    var checkinmonth = req.body.checkInmonth;
    // var checkoutday = req.body.checkOutDay;
    // var checkoutmonth = req.body.checkOutmonth
    var fdtitle = req.body.fd_title;
    console.log(fdtitle);
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db booknow');
        } else {
            var DB = db.db('my_db');
            var obj = {
                Event_name: fd_title,
                Firstnames: firstnames, Lastnames: lastnames, DateOfbirths: dateOfbirths, ID_numbers: idNums, Total_Amount: totalAmount,
                Check_in_day: checkinday, Check_in_month: checkinmonth, Check_out_day: checkoutday, Check_out_month: checkoutmonth,

            };
            DB.collection('events').insertOne(obj, function (err2, res) {
                if (err2) {
                    console.log("error inserting event");
                } else {
                    console.log("inserted event");
                }
                db.close();
            });
        }
    });
    res.redirect('/events');
});


app.get('/home-admin', function (req, res) {
    res.render('home-admin');
});

app.get('/users', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('users').countDocuments({}).then((count) => {
                console.log(count);
            });

            DB.collection('users').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    res.render("users", { data: rows });
                }
                db.close();
            });

        }
    });
});

app.get('/updateUsers-admin', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('users').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    res.render("updateUsers-admin", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post("/updateUsers-admin", function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db update');
        } else {
            var DB = db.db('my_db');
            DB.collection('users').updateOne({}, { $set: { Firstname: firstname, Lastname: lastname, Username: username, Email: email, Password: password } },
                function (err2, res) {
                    if (err2) {
                        console.log("No user was updated");
                        throw err2;
                    } else {
                        console.log('user was updated');
                    } db.close();
                });
        }
    });
    res.redirect('/users');
});

app.get('/deleteUsers-admin', function (req, res) {
    res.render('deleteUsers-admin');
});

app.post('/deleteUsers-admin', function (req, res) {
    var id = req.body.id;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db update');
        } else {
            var DB = db.db('my_db');
            DB.collection('users').deleteOne({ _id: ObjectId(id) }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error while delete user');
                } else {
                    console.log('delete successfully');
                } db.close();
            });
        }
    });
    res.redirect('/users');
});

app.get('/destination-admin', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('sights').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No sight was found");
                    throw err2;
                } else {
                    res.render("destination-admin", { data: rows });
                }
                db.close();
            });
        }
    });
});


app.post('/insertSight', function (req, res) {
    var img = req.body.image
    var title = req.body.title;
    var description = req.body.description;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('sights').insertOne({ Img: "public/css/Images/" + img, Title: title, Description: description }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting sight');
                } else {
                    console.log('sight inserted');
                } db.close();
            });
        }
    });
    res.redirect('/destination-admin');
});


app.post('/updateSight', function (req, res) {
    var titleOld = req.body.titleOld;
    var img = req.body.imageUpdate;
    var title = req.body.titleUpdate;
    var description = req.body.descriptionUpdate;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('sights').updateOne({ Title: titleOld }, { $set: { Img: "public/css/Images/" + img, Title: title, Description: description } }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error updating sight');
                } else {
                    console.log('sight updated');
                } db.close();
            });
        }
    });
    res.redirect('/destination-admin');
});

app.post('/deleteSight', function (req, res) {
    var titleOld = req.body.titleOld2;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('sights').deleteOne({ Title: titleOld }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error deleting sight');
                } else {
                    console.log('sight deleted');
                } db.close();
            });
        }
    });
    res.redirect('/destination-admin');
});

app.post('/insertURL', function (req, res) {
    var link = req.body.helpLink;
    var description = req.body.linkDescription;
    console.log(link);
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('helpful_url').insertOne({ Link: link, Description: description }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting URL');
                } else {
                    console.log('URL inserted');
                } db.close();
            });
        }
    });
    res.redirect('/helpfulURLs');
});

app.post('/insertURL-login', function (req, res) {
    var link = req.body.helpLink;
    var description = req.body.linkDescription;
    console.log(link);
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('helpful_url').insertOne({ Link: link, Description: description }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting URL');
                } else {
                    console.log('URL inserted');
                } db.close();
            });
        }
    });
    res.redirect('/helpfulURLs-login');
});

app.get('/helpfulURLs', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('helpful_url').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(rows);
                    res.render("helpfulURLs", { data: rows });
                }
                db.close();
            });
        }
    });
});



app.get('/helpfulURLs-login', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('helpful_url').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(rows);
                    res.render("helpfulURLs-login", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.get('/thingsToDo-login', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('activities').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No activity was found");
                    throw err2;
                } else {
                    res.render("thingsToDo-login", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.get('/reviews', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('reviews').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    res.render("reviews", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post('/comment', function (req, res) {
    var review = req.body.review;
    var rate = req.body.rate;
    var image = req.body.imageReview;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('reviews').insertOne({ Review: review, Rate: rate + "/10", Img: "public/css/Images/reviewImages/" + image }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting review');
                } else {
                    console.log('Review inserted');
                } db.close();
            });
        }
    });
    res.redirect('/reviews');
});

app.get('/reviews-login', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('reviews').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    res.render("reviews-login", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post('/comment-login', function (req, res) {
    var review = req.body.review;
    var rate = req.body.rate;
    var image = req.body.imageReview;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('reviews').insertOne({ Review: review, Rate: rate + "/10", Img: "public/css/Images/reviewImages/" + image }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting review');
                } else {
                    console.log('Review inserted');
                } db.close();
            });
        }
    });
    res.redirect('/reviews-login');
});


app.get('/events-admin', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('events').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No event was found");
                    throw err2;
                } else {
                    res.render("events-admin", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post('/comment-login', function (req, res) {
    var review = req.body.review;
    var rate = req.body.rate;
    var image = req.body.imageReview;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('reviews').insertOne({ Review: review, Rate: rate + "/10", Img: "public/css/Images/reviewImages/" + image }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting review');
                } else {
                    console.log('Review inserted');
                } db.close();
            });
        }
    });
    res.redirect('/reviews-login');
});

app.post('/uploadEvent', function (req, res) {
    var image = req.body.imageEvent;
    var title = req.body.titleEvent;
    var date = req.body.dateEvent;
    var price = req.body.ticketPrice;
    var map = req.body.map;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('events').insertOne({ Img: "public/css/Images/eventsImages/" + image, Title: title, _Date: date, Price: price, _Map:map }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting event');
                } else {
                    console.log('Event inserted');
                } db.close();
            });
        }
    });
    res.redirect('/events-admin');
});


app.get('/events', function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('events').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No event was found");
                    throw err2;
                } else {
                    res.render("events", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post('/deleteEvent', function (req, res) {
    var title = req.body.name;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db delete');
        } else {
            var DB = db.db('my_db');
            DB.collection('events').deleteOne({ Title: title }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error while delete event');
                } else {
                    console.log('event deleted successfully');
                } db.close();
            });
        }
    });
    res.redirect('/events-admin');
});

app.post('/updateEvent', function (req, res) {
    var titleOld = req.body.titleOld;
    var img = req.body.newImageEvent;
    var title = req.body.newTitle;
    var date = req.body.newDate;
    var price = req.body.newPrice;
    var map = req.body.newMap;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('events').updateOne({ Title: titleOld }, { $set: { Img: "public/css/Images/eventsImages/" + img, Title: title, _Date: date, Price: price, _Map : map} }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error updating sight');
                } else {
                    console.log('sight updated');
                } db.close();
            });
        }
    });
    res.redirect('/events-admin');
});

app.get('/reservations', function(req,res){
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('stay').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No reservation was found");
                    throw err2;
                } else {
                    res.render("reservations", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post('/deleteReservation', function (req, res) {
    var id = req.body.id;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db delete');
        } else {
            var DB = db.db('my_db');
            DB.collection('stay').deleteOne({ _id: ObjectId(id) }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error while deleting reservation');
                } else {
                    console.log('reservation deleted successfully');
                } db.close();
            });
        }
    });
    res.redirect('/reservations');
});

app.get('/thingsToDo-admin', function(req,res){
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            var DB = db.db('my_db');
            DB.collection('activities').find({}).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No activity was found");
                    throw err2;
                } else {
                    res.render("thingsToDo-admin", { data: rows });
                }
                db.close();
            });
        }
    });
});

app.post('/insertActivity', function(req,res){
    var image = req.body.imageActivity;
    var title = req.body.titleActivity;
    var link = req.body.urlActivity;
    var description = req.body.descriptionActivity;
    var type = req.body.typeActivity;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('activities').insertOne({ Img: "public/css/Images/thingsToDoImages/" + image, Title: title, Url: link, Description : description, Type:type }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting activity');
                } else {
                    console.log('Activity inserted');
                } db.close();
            });
        }
    });
    res.redirect('/thingsToDo-admin');
});

app.post('/updateActivity', function (req, res) {
    var titleOld = req.body.titleOld;
    var img = req.body.newImageActivity;
    var title = req.body.newTitle;
    var link = req.body.newURL;
    var description = req.body.newDescription;
    var type = req.body.newType;
    console.log(titleOld)
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('activities').updateOne({ Title: titleOld }, { $set: { Img: "public/css/Images/thingsToDoImages/" + img, Title: title, Url: link, Description: description, Type : type} }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error updating activity');
                } else {
                    console.log('Activity updated');
                } db.close();
            });
        }
    });
    res.redirect('/thingsToDo-admin');
});

app.post('/deleteActivity', function (req, res) {
    var id = req.body.id;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db delete');
        } else {
            var DB = db.db('my_db');
            DB.collection('activities').deleteOne({ _id: ObjectId(id) }, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error while deleting activity');
                } else {
                    console.log('activity deleted successfully');
                } db.close();
            });
        }
    });
    res.redirect('/thingsToDo-admin');
});

app.get('/more', function(req,res){
    res.render('more');
});

app.post('/contact',function(req,res){
    var email = req.body.email;
    var contact = req.body.contact;
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db');
        } else {
            var DB = db.db('my_db');
            DB.collection('contact').insertOne({ From : email, Description : contact}, function (err1, res) {
                if (err1 || res == null) {
                    console.log('error inserting contact');
                } else {
                    console.log('Contact inserted');
                } db.close();
            });
        }
    });
    res.redirect('/more');
});

app.get("/profile-admin", function (req, res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            console.log('error db profile');
        }
        else {
            console.log("the email" + my_email);
            var DB = db.db('my_db');
            DB.collection('users').find({ Email: my_email }).toArray(function (err2, rows) {
                if (err2) {
                    console.log("No user was found");
                    throw err2;
                } else {
                    console.log(rows);
                    res.render("profile-admin", { data: rows });
                }
                db.close();
            });
        }
    });
});

function pop(array) {
    let i = (Math.random() * array.length) | 0;
    return array.splice(i, 1)[0];
}