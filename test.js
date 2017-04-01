"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const request = require('request');
const cookieSession = require('cookie-session');

knex("favourite").select("name", "list_id").join("list", "list.id", "=", "favourite.list_id").where({
  "favourite.user_id": "101009559760674447488",
}).asCallback((error, result)=>{
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
})

