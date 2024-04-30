import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserList } from '../mongodb/schema/user-list.schema';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UserListRepository } from '../mongodb/repository/user-list.repository';
import { UserRepository } from '../mongodb/repository/user.repository';
import { MovieRepository } from '../mongodb/repository/movie.repository';
import { TvShowRepository } from '../mongodb/repository/tv-show.repository';

@Injectable()
export class MyListService {
  constructor(
    private readonly userListRepository: UserListRepository,
    private readonly userRepository: UserRepository,
    private readonly movieRepository: MovieRepository,
    private readonly tvShowRepository: TvShowRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addToMyList(
    userId: string,
    itemId: string,
    type: string,
  ): Promise<UserList> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingItem = await this.userListRepository.findOneByUserIdAndItemId(
      userId,
      itemId,
      type === 'tv' ? 'tvShowId' : 'movieId',
    );

    if (existingItem) {
      throw new ConflictException('Item already exists in the list');
    }

    let item;
    if (type === 'movie') {
      item = await this.movieRepository.findById(itemId);
    } else if (type === 'tv') {
      item = await this.tvShowRepository.findById(itemId);
    }

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return await this.userListRepository.create(userId, itemId, type);
  }

  async removeFromMyListById(listId: string): Promise<UserList> {
    const removedItem = await this.userListRepository.findByIdAndDelete(listId);
    if (!removedItem) {
      throw new NotFoundException('Item not found');
    }
    return removedItem;
  }

  async listMyItems(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    userList: UserList[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const key = `my-list-${userId}-${page}-${limit}`;
    const cachedData = await this.cacheManager.get(key);

    if (cachedData) {
      return cachedData as {
        userList: UserList[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
      };
    }

    const totalItems = await this.userListRepository.countByUserId(userId);
    const totalPages = Math.ceil(totalItems / limit);
    const userList = await this.userListRepository.listByUserId(
      userId,
      page,
      limit,
    );

    await this.cacheManager.set(
      key,
      {
        userList,
        totalItems,
        totalPages,
        currentPage: page,
      },
      60 * 60,
    );

    return {
      userList,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}
