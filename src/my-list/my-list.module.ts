import { Module } from '@nestjs/common';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { MongodbModule } from '../mongodb/mongodb.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserListRepository } from '../mongodb/repository/user-list.repository';
import { TvShowRepository } from '../mongodb/repository/tv-show.repository';
import { MovieRepository } from '../mongodb/repository/movie.repository';
import { UserRepository } from '../mongodb/repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserListSchema } from '../mongodb/schema/user-list.schema';
import { UserSchema } from '../mongodb/schema/user.schema';
import { MovieSchema } from '../mongodb/schema/movie.schema';
import { TvShowSchema } from '../mongodb/schema/tv-show.schema';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Movie', schema: MovieSchema },
      { name: 'TvShow', schema: TvShowSchema },
      { name: 'UserList', schema: UserListSchema },
    ]),
  ],
  controllers: [MyListController],
  providers: [
    MyListService,
    { provide: CACHE_MANAGER, useValue: {} },
    UserListRepository,
    UserRepository,
    TvShowRepository,
    MovieRepository,
  ],
})
export class MyListModule {}
