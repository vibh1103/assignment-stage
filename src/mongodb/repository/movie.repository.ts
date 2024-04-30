import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../schema/movie.schema';

@Injectable()
export class MovieRepository {
  constructor(@InjectModel('User') private readonly movieModel: Model<Movie>) {}

  async findById(id: string): Promise<Movie> {
    return await this.movieModel.findById(id);
  }
}
