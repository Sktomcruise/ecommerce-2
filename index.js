const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const { auth_route, user_route, product_route, cart_route, order_route } = require('./routes');

const app = express();

/* configure body-parser */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());


app.use('/', auth_route);
app.use('/users', user_route);
app.use('/products', product_route);
app.use('/carts', cart_route);
app.use('/orders', order_route);

const dbConfig = require('./config/database-config-examples');

/* connecting to the database */
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

/* listen for requests */
app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});