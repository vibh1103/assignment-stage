const mongoose = require('mongoose');
const fs = require('fs');

// Define schemas
const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  preferences: {
    favoriteGenres: [String],
    dislikedGenres: [String],
  },
  watchHistory: [
    {
      contentId: String,
      watchedOn: Date,
      rating: Number,
    },
  ],
});

const movieSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  genres: [String],
  releaseDate: Date,
  director: String,
  actors: [String],
});

const tvShowSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  genres: [String],
  episodes: [
    {
      episodeNumber: Number,
      seasonNumber: Number,
      releaseDate: Date,
      director: String,
      actors: [String],
    },
  ],
});

// Create models
const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);
const TVShow = mongoose.model('TVShow', tvShowSchema);

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/mylist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Load data from JSON file
    const rawData = fs.readFileSync('data.json', 'utf-8');
    const data = JSON.parse(rawData);

    // Insert users
    User.insertMany(data.users)
      .then(() => console.log('Users inserted'))
      .catch((err) => console.error('Error inserting users:', err));

    // Insert movies
    Movie.insertMany(data.movies)
      .then(() => console.log('Movies inserted'))
      .catch((err) => console.error('Error inserting movies:', err));

    // Insert TV shows
    TVShow.insertMany(data.tvShows)
      .then(() => console.log('TV shows inserted'))
      .catch((err) => console.error('Error inserting TV shows:', err));
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));
