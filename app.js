const express = require('express');
const userController  = require("./controllers/user.controller");
const moviesController = require("./controllers/movie.controller");
const seriesController = require("./controllers/series/series.controller");
const categoryController = require("./controllers/category.controller");
const sessionsController = require("./controllers/series/session.controller");
const episodeController = require("./controllers/series/episode.controller");
const logger = require("./middleware/logger");
const Login = require("./controllers/login.controller");
const verifytoken = require("./config/verifytoken");


const app = express();
app.use(express.json());
app.use(logger);


app.use('/login',Login );


app.use(verifytoken);
app.use('/user', userController);
app.use('/movies', moviesController);
app.use('/series', seriesController);
app.use('/series', sessionsController);
app.use('/series', episodeController);
app.use('/category', categoryController);

app.use('/',(req,res)=>{
    res.send("Home Page!");
})

app.listen(3005);