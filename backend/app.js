const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Movie = require("./models/movie");

const app = express();
const {spawn} = require('child_process');

mongoose
  .connect(
    "mongodb+srv://sai:GNliaHHVYZqdTJu6@cluster0-vo2do.mongodb.net/movie_database_main?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


//Getting auction data from liquidation
app.get("/api/getLinkData/:url/:siteNum", (req, res) => {


  
  var url = req.params.url;
  var siteNum = req.params.siteNum;
  console.log(req.params)
 

  var largeDataSet = [];

	// spawn new child process to call the python script
	const python = spawn('python3', ["-u",'script3.py',url,siteNum]); 
	// collect data from script
	python.stdout.on('data', function (data) {

    pythonData = data;

    
    largeDataSet.push(data.toString());
      
  });
  



	// in close event we are sure that stream is from child process is closed
	python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);  
  
    console.log(largeDataSet.join(""));
    res.status(200).json({
      message: "got link data",
      data: JSON.parse(largeDataSet.join(""))
    });
  });
  var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
  };
  python.stderr.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string.
    console.log("stderr");
    console.log(uint8arrayToString(data));
  });
  python.on('exit', (code) => {
    console.log("Process quit with code : " + code);
  });
	
});

















app.get("/api/getMovies/:page", (req, res) => {
  var moverPerPage = 20;
  var page = req.params.page;
  Movie.find({}).skip( (page - 1) * moverPerPage ).limit(moverPerPage).exec( function(err, result) {
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    if (!result) {
        return res.status(401).json({
            title: 'Movie get failed',
            error: {message: 'movies not found'}
        });
    }
    res.status(200).json({
      message: "Movies fetched successfully!",
      movies: result
    });

  });

});

app.get("/api/getMovie/:id", (req, res) => {
  Movie.findById( req.params.id, function (err, movie){
    console.log('logging id from app.js', req.params.id);
    if (err) {
      return res.status(500).json({
          title: 'An error occurred',
          error: err
      });
    }

    if (!movie) {

        return res.status(401).json({
            title: 'Could not find movie',
            error: {message: 'Movie not found'}
        });
    }

    res.status(200).json({
        message: 'Successfully got movies',
        movie: movie
      });
    });

});

app.get("/api/getMoviesSearch/:search", (req, res) => {
  var search = req.params.search;
  Movie.find( {Title: new RegExp( search, 'i')} , function (err, movie){
    console.log('logging id from app.js', search);
    if (err) {
      return res.status(500).json({
          title: 'An error occurred',
          error: err
      });
    }

    if (!movie) {
        return res.status(401).json({
            title: 'Could not find movie',
            error: {message: 'Movie not found'}
        });
    }

    res.status(200).json({
        message: 'Successfully got movies',
        movies: movie
      });
    });

});




module.exports = app;
