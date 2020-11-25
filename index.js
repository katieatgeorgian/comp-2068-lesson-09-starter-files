require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// Mongo access
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
  auth: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).catch(err => console.error(`Error: ${err}`));

// Implement Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup our session
const session = require('express-session');
//unique to that particular user
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'any salty secret here'
}));

// Setting up Passport
//authentication strategy - using local strategy = username/pswrd
const passport = require('passport');
app.use(passport.initialize());//initalize and register as middleware
app.use(passport.session());
const User = require('./models/user');
passport.use(User.createStrategy());//telluse strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Setting up Passport JWT


// register the routes
const routes = require('./routes');
const router = routes(express.Router(), passport);
app.use(router);

// error handling
const { handle404s, errorHandler } = require('./errorHandling');
app.use(handle404s);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Always watching... on port ${port}`));