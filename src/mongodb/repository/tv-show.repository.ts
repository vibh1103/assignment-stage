import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TvShow } from '../schema/tv-show.schema';

@Injectable()
export class TvShowRepository {
  constructor(
    @InjectModel('User') private readonly tvShowModel: Model<TvShow>,
  ) {}

  async findById(id: string): Promise<TvShow> {
    return await this.tvShowModel.findById(id);
  }
}
