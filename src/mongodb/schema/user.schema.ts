import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
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

export interface User extends Document {
  id: string;
  username: string;
  preferences: {
    favoriteGenres: string[];
    dislikedGenres: string[];
  };
  watchHistory: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}
