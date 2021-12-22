const express = require('express');
const userController  = require("./controllers/user.controller");
const moviesController = require("./controllers/movie.controller");
const seriesController = require("./controllers/series/series.controller");
const categoryController = require("./controllers/genre.controller");
const seasonController = require("./controllers/series/season.controller");
const episodeController = require("./controllers/series/episode.controller");
const countryController = require('./controllers/country.controller');
const subscriptionController = require('./controllers/subscription.controller');
// const logger = require("./middleware/logger");
const Login = require("./controllers/login.controller");
const verifytoken = require("./authentication/auth.middleware");
var mongoDB =
  "mongodb+srv://Hardik:Hardik@ottcluster.tapyt.mongodb.net/ottPlatform";
const mongoose = require('mongoose');

mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=> console.log('Connected to MongoDB'));




const app = express();
app.use(express.json());
// app.use(logger);


// app.use('/login',Login );


// app.use(verifytoken);
app.use('/user', userController);
app.use('/movies', moviesController);
app.use('/series', seriesController);
app.use('/series', seasonController);
app.use('/episode', episodeController);
app.use('/category', categoryController);
app.use('/country',countryController);
app.use('/subscription',subscriptionController);

app.use('/',(req,res)=>{
    res.send("Home Page!");
})

app.listen(3005,()=>console.log("listening on port 3005"));