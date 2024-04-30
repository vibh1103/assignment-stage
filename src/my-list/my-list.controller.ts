import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Query,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { MyListService } from './my-list.service';

@Controller('mylist')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Post('/add')
  async addToMyList(@Body() body: any, @Req() req: Request) {
    const { itemId, type } = body;
    await this.myListService.addToMyList(req.headers['user-id'], itemId, type);
    return 'Item added to My List successfully.';
  }

  @Delete('remove/:listId')
  async removeFromMyListById(@Param('listId') listId: string) {
    try {
      return await this.myListService.removeFromMyListById(listId);
    } catch (error) {
      throw new NotFoundException('Item not found');
    }
  }

  @Get('/')
  async listMyItems(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.myListService.listMyItems(req.headers['user-id'], page, limit);
  }
}
