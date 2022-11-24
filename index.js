const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session=require("express-session");
var MongoStore = require('connect-mongo');
const connectDB = require("./config/db");


const { auth_route, user_route, product_route, cart_route, order_route,payment_route } = require('./routes');

const app = express();

/* configure body-parser */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());



app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
              mongoUrl: "mongodb://127.0.0.1:27017/ecommercesite",
          }),
    cookie: {
      expires: 60 * 1000 * 60 * 1,
    },
  })
);

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});



/* connecting to the database */
connectDB();





app.use('/', auth_route);
app.use('/users', user_route);
app.use('/products', product_route);
app.use('/carts', cart_route);
app.use('/orders', order_route);
app.use('/pay',payment_route)



/* listen for requests */
app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});