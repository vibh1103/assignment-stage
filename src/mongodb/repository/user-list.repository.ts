import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserList } from '../schema/user-list.schema';

@Injectable()
export class UserListRepository {
  constructor(
    @InjectModel('UserList') private readonly userListModel: Model<UserList>,
  ) {}

  async findOneByUserIdAndItemId(
    userId: string,
    itemId: string,
    type: string,
  ): Promise<UserList> {
    return await this.userListModel
      .findOne({ userId, [type === 'tv' ? 'tvShowId' : 'movieId']: itemId })
      .exec();
  }

  async create(
    userId: string,
    itemId: string,
    type: string,
  ): Promise<UserList> {
    const newList = new this.userListModel({
      userId,
      [type === 'tv' ? 'tvShowId' : 'movieId']: itemId,
      type,
    });
    return await newList.save();
  }

  async findByIdAndDelete(listId: string): Promise<UserList> {
    return await this.userListModel.findByIdAndDelete(listId).exec();
  }

  async listByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<UserList[]> {
    const skip = (page - 1) * limit;
    return await this.userListModel
      .find({ userId })
      .populate({
        path: 'userId',
        model: 'User',
        select: 'username',
      })
      .populate({
        path: 'movieId',
        model: 'Movie',
        select: 'title',
      })
      .populate({
        path: 'tvShowId',
        model: 'TvShow',
        select: 'title',
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.userListModel.countDocuments({ userId });
  }
}
