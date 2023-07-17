// Dependencies
// ==================================================
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require('express-flash-messages');
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const app = express();
const PORT = process.env.PORT || 3001;

const chatInstanceLocator = process.env.REACT_APP_CHAT_INSTANCE_LOCATOR;
const chatKey = process.env.CHAT_KEY;

// Chatkit credentials
const chatkit = new Chatkit.default({
  instanceLocator: chatInstanceLocator,
  key: chatKey,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
} else {
  app.use(express.static("client/public"));
}

// Connect to Mongoose
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/getaway-travel-planning", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error: ", error);
  });

app.use(cookieParser());
app.use(flash());
require('./config/passport')(passport);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 2592000000,
    httpOnly: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://localhost:3001'); // eventually change to heroku url - may need to be localhost:3000
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Chatkit post users and authenticate code goes from here >>>>>>>>>

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
});

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});
// <<<<<<<<to here

// Routes
const routes = require("./routes");
app.use(routes);

app.get('*', (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
  }
});

// Start API server
app.listen(PORT, function () {
  console.log(`API Server now listening on PORT ${PORT}!`);
});
