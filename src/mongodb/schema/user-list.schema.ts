import * as mongoose from 'mongoose';

export const UserListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tvShowId: { type: String },
  movieId: { type: String },
  type: { type: String },
});

export interface UserList extends mongoose.Document {
  userId: string;
  tvShowId?: string;
  movieId?: string;
  type?: string;
}
