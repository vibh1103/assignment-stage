import { Module } from '@nestjs/common';
import { MyListModule } from './my-list/my-list.module';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyListService } from './my-list/my-list.service';
import { MyListController } from './my-list/my-list.controller';
import { MongodbModule } from './mongodb/mongodb.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule, MongodbModule, MyListModule, CacheModule.register()],
  providers: [AppService, MyListService],
  controllers: [AppController, MyListController],
})
export class AppModule {}
