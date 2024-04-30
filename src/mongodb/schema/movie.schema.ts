import * as mongoose from 'mongoose';

export const MovieSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  genres: [String],
  releaseDate: Date,
  director: String,
  actors: [String],
});

export interface Movie extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  genres: string[];
  releaseDate: Date;
  director: string;
  actors: string[];
}
