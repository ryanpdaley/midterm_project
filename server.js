"use strict";

let user = {};
let all_maps = {};

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const request = require('request');
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}));

const usersRoutes = require("./routes/users");

app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


// Home page
app.get("/", (req, res) => {
  let user;
  let list_id;
  let data;
  let liked;
  if (req.query.subpage) {
    data = JSON.parse(req.query.data)[0]
  } else {
    data = {}
  }
  if (req.query.list_id) {
    list_id = req.query.list_id;
  } else {
    list_id = 0;
  }
  if (req.query.liked) {
    liked = req.query.liked;
  } else {
    liked = false;
  }
  if (req.session.google_id) {
    user = req.session.google_id;
  } else {
    user = 0;
  }
  console.log(`Server liked = ${liked}`)
  knex("list").select().asCallback((error, result) => {
   res.render("index", {user, lists: result, list_id: list_id, data: data, isLiked: liked});
  })
});

app.get("/sign-in", (req, res) => {
  if (req.session.google_id) {
    console.log("User already logged in");
    res.redirect("/");
  } else {
    res.render("sign-in");
  }
});

app.get("/logout", (req, res) => {
  // We should probably logout of Google too, but leaving it this way makes testing easier...
  req.session = null;
  res.redirect("/");
});

app.get("/map/:id", (req,  res) => {
  let list_id = req.params.id;
  let isSignedIn = false;
  let liked = false;
  if (req.session.google_id) {
    knex("favourite").select().where("list_id", "=", req.params.id).asCallback((error, result) => {
      console.log(result)
      if (error) {
        console.log(error);
      } else {
        if (result.length && result[0].user_id == req.session.google_id) {
          liked = true;
        }
        isSignedIn = true;
      }
      let urlBuilder = `?list_id=${list_id}&liked=${liked}&isSignedIn=${isSignedIn}`
      res.redirect("/" + urlBuilder);
    });
  } else {
    let urlBuilder = `?list_id=${list_id}&liked=${liked}&isSignedIn=${isSignedIn}`
    res.redirect("/" + urlBuilder);
  }
});

app.get("/user", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    res.render("user");
  }
});


app.get("/user/favourite", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    let user = req.session.google_id;
    knex("favourite").select("name", "list_id").join("list", "list.id", "=", "favourite.list_id").where({"favourite.user_id": req.session.google_id}).asCallback((error, result)=>{
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.render("favourite", {maps: result, user: user});
      }
    });
  }
});

app.get("/user/list", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    let user = req.session.google_id;
    knex('list').select('list.id', 'list.name', 'list.user_id', knex.raw(`CASE WHEN favourite.id IS NULL THEN 0 ELSE 1 END AS isFav`))
    .leftJoin('favourite', 'list.id', 'favourite.list_id')
    .where({'list.user_id': user})
    .asCallback(function (error, result) {
        if (error) {
          console.log(error);
        } else {
          res.render('showlists', {list: result, user: user});
        }
      })
  }
});

app.get("/user/list/:id/delete", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    knex("list").select().where("id", "=", req.params.id).asCallback((error, result) => {
      console.log(req.params.id);
      console.log(result)
      if (error) {
        console.log(error)
      } else {
        console.log(result[0]);
        const user_id = result[0].user_id;
        if (user_id !== req.session.google_id) {
          console.log("Not the same user who created the list");
          res.status(403).redirect("/");
        } else {
          knex("point").where("list_id", "=", req.params.id).del().asCallback((error, result) => {
            if (error) {
              console.log(error);
            } else {
              knex("favourite").where("list_id", "=", req.params.id).del().asCallback((error, result) => {
              if (error) {
                console.log(error);
              } else {
                knex("list").where("id", "=", req.params.id).del().asCallback((error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("List deleted");
                    res.redirect(`/user/list/`);
                  }
                })
              }
            })
            }
          })
        }
      }
    });
  }
});

app.get("/user/point/:id", (req, res) => {

  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    let user = req.session.google_id;
    knex("point").select().where("id", "=", req.params.id).asCallback((error, result) => {
      if (error) {
        console.log(error)
      } else {
        const user_id = result[0].user_id;
        if (user_id !== req.session.google_id) {
          console.log("Not the same user who created the list");
          res.status(403).redirect("/");
        } else {
          const point = result[0];
          console.log(point);
          res.render("showpoint", {point: point, user: user});
        }
      }
    });
  }
});

app.get("/user/point/:id/delete", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    knex("point").select().where("id", "=", req.params.id).asCallback((error, result) => {
      console.log(req.params.id);
      if (error) {
        console.log(error)
      } else {
        console.log(result[0]);
        const user_id = result[0].user_id;
        const list_id = result[0].list_id;
        if (user_id !== req.session.google_id) {
          console.log("Not the same user who created the list");
          res.status(403).redirect("/");
        } else {
          knex("point").where("id", "=", req.params.id).del().asCallback((error, result) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Point deleted");
              res.redirect(`/user/list/${list_id}`);
            }
          })
        }
      }
    });
  }
});

app.get("/user/list/create", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    res.render("create_list");
  }
});

app.get("/user/list/:id", (req, res) => {

  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    let user = req.session.google_id;
    knex("list").select("user_id").where("id", "=", req.params.id).asCallback((error, result) => {
      if (error) {
        console.log(error);
      } else {
        const user_id = result[0].user_id;
        if (user_id !== req.session.google_id) {
          console.log("Not the same user who created the list");
          res.status(403).redirect("/");
        }
      }
    });

    knex('list').join('point', "list.id", "=", "point.list_id")
      .where("list.id", "=", req.params.id)
      .asCallback(function (error, result) {
        if (error) {
          console.log(error)
        } else {
          console.log(result);
          res.render("showlist", {points: result, list_id: req.params.id, user: user});
        }
      });
  }
});

app.get("/user/list/:id/create", (req, res) => {

  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    let user = req.session.google_id;
    knex("list").select("user_id").where("id", "=", req.params.id).asCallback((error, result) => {
      if (error) {
        console.log(error);
      } else {
        const user_id = result[0].user_id;
        if (user_id !== req.session.google_id) {
          console.log("Not the same user who created the list");
          res.status(403).redirect("/");
        } else {
          res.render("create_point", {list_id: req.params.id, user: user});
        }
      }
    });
  }
});

app.get("/getPoints/:id", (req, res)=>{
  knex("list").select().join("point", "point.list_id", "=", "list.id").where("list.id", "=", req.params.id).asCallback((error, result)=>{
    if (error){
      console.log(error);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/map/:id/like", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    knex("favourite").insert({list_id: req.params.id, user_id: req.session.google_id}).asCallback((error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Like inserted");
        res.redirect('/user/list');
      }
    })
  }
});

app.post("/map/:id/unlike", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    knex("favourite").where({
      list_id: req.params.id,
      user_id: req.session.google_id
    }).del().asCallback((error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Map unliked");
        res.redirect('/user/list');
      }
    })
  }
});

app.post("/user/list/create", (req, res) => {

  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    const list_name = req.body.list_name;
    console.log("List Name: " + req.body.list_name);
    console.log("Google ID: " + req.session.google_id);
    knex("list").insert({
      name: req.body.list_name,
      user_id: req.session.google_id
    }).asCallback(function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("Entry inserted");
        res.redirect("/user/list");
      }
    })
  }
});

app.post("/user/list/point/create", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    knex("point").insert({
      list_id: req.body.list_id,
      user_id: req.session.google_id,
      title: req.body.title,
      address: req.body.address,
      lat: req.body.lat,
      long: req.body.long,
      desc: req.body.desc,
      img_url: req.body.img_url
    }).asCallback(function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("Point inserted")
        res.redirect(`/user/list/${req.body.list_id}`);
      }
    })
  }
});

app.post("/user/point/:id/update", (req, res) => {
  if (!req.session.google_id) {
    console.log("User not signed in");
    res.redirect("/");
  } else {
    knex("point").select("user_id").where("id", "=", req.params.id).asCallback((error, result) => {
      if (error) {
        console.log(error);
      } else {
        if (result[0].user_id !== req.session.google_id) {
          console.log("Not the same user created the point")
          res.status(403).redirect("/");
        } else {
          knex("point").where("id", "=", req.params.id).update({
            title: req.body.title,
            address: req.body.address,
            long: req.body.long,
            lat: req.body.lat,
            desc: req.body.desc,
            img_url: req.body.img_url
          }).asCallback((error, result) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Point updated");
              res.redirect(`/user/list/${req.body.list_id}`);
            }
          })
        }
      }
    })
  }
});

app.post("/sign-in", (req, res) => {

  if (req.session.google_id) {
    console.log("User already logged in");
    res.redirect("/");
  } else if (req.body.id_token) {
    request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.id_token}`,
      function (error, response, body) {
        if (error) {
          console.log(error);
        } else {

          const resObj = JSON.parse(body);
          const google_id = resObj.sub;
          console.log("google_id: " + google_id);
          const name = resObj.name;
          console.log("name: " + name);
          const email = resObj.email;
          console.log("email: " + email);

          knex.select().from("google_user").where({google_id: google_id}).asCallback(function (err, result) {

            console.log("length of result: " + result.length);
            if (result.length !== 0) {
              console.log("user exists");
              req.session.google_id = google_id;
              res.redirect("/");
            } else {
              console.log("Going to create new user");
              knex("google_user").insert({
                google_id: google_id,
                name: name,
                email: email
              }).asCallback(function (error, result) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("user created");
                }
              });
              req.session.google_id = google_id;
              res.redirect("/");
            }
          });
        }
      });
  } else {
    res.statusCode(400).redirect("/");
  }
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
