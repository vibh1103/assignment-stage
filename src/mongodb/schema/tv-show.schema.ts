import * as mongoose from 'mongoose';

export const TvShowSchema = new mongoose.Schema({
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

export interface TvShow extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  genres: string[];
  episodes: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}
