//the movie api code, not used for this project


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
