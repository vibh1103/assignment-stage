import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserListSchema } from './schema/user-list.schema';
import { UserSchema } from './schema/user.schema';
import { MovieSchema } from './schema/movie.schema';
import { TvShowSchema } from './schema/tv-show.schema';
import { UserListRepository } from './repository/user-list.repository';
import { UserRepository } from './repository/user.repository';
import { TvShowRepository } from './repository/tv-show.repository';
import { MovieRepository } from './repository/movie.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mylist'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Movie', schema: MovieSchema },
      { name: 'TvShow', schema: TvShowSchema },
      { name: 'UserList', schema: UserListSchema },
    ]),
  ],
  exports: [
    UserListRepository,
    UserRepository,
    TvShowRepository,
    MovieRepository,
  ],
  providers: [
    UserListRepository,
    UserRepository,
    TvShowRepository,
    MovieRepository,
  ],
})
export class MongodbModule {}
