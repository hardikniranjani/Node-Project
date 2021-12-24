const express = require("express");
const userController = require("./controllers/user.controller");
const moviesController = require("./controllers/movie.controller");
const seriesController = require("./controllers/series/series.controller");
const categoryController = require("./controllers/genre.controller");
const seasonController = require("./controllers/series/season.controller");
const episodeController = require("./controllers/series/episode.controller");
const countryController = require("./controllers/country.controller");
const subscriptionController = require("./controllers/subscription.controller");
const languages = require('./controllers/spokenLanguage.controller');
const GenresController = require('./controllers/genre.controller');
const companiesController = require('./controllers/company.controller');
// const logger = require("./middleware/logger");
const Login = require("./controllers/login.controller");
const verifytoken = require("./authentication/auth.middleware");
var mongoDB = "mongodb+srv://Hardik:Hardik@ottcluster.tapyt.mongodb.net/ottplatform";
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"));

const app = express();
app.use(express.json());
// app.use(logger);

// app.use('/login',Login );
app.use(fileupload());
// app.use(verifytoken);
app.use("/user", userController);
app.use("/movies", moviesController);
app.use("/series", seriesController);
app.use("/series", seasonController);
app.use("/episode", episodeController);
app.use("/category", categoryController);
app.use("/country", countryController);
app.use("/subscription", subscriptionController);
app.use("/languages",languages);
app.use("/genre", GenresController);
app.use("/company", companiesController);

app.use("/", (req, res) => {
  res.send("Home Page!");
});

app.listen(3005, () => console.log("listening on port 3005"));
