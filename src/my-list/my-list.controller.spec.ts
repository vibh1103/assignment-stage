import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';

describe('MyListController', () => {
  let controller: MyListController;
  let myListServiceMock;

  beforeEach(async () => {
    myListServiceMock = {
      addToMyList: jest.fn(),
      removeFromMyListById: jest.fn(),
      listMyItems: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyListController],
      providers: [{ provide: MyListService, useValue: myListServiceMock }],
    }).compile();

    controller = module.get<MyListController>(MyListController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToMyList', () => {
    it('should add an item to the user list', async () => {
      const body = { userId: 'user_id', itemId: 'item_id', type: 'movie' };
      await controller.addToMyList(body);
      expect(myListServiceMock.addToMyList).toHaveBeenCalledWith(
        body.userId,
        body.itemId,
        body.type,
      );
    });
  });

  describe('removeFromMyListById', () => {
    it('should remove an item from the user list', async () => {
      const listId = 'list_id';
      await controller.removeFromMyListById(listId);
      expect(myListServiceMock.removeFromMyListById).toHaveBeenCalledWith(
        listId,
      );
    });

    it('should throw NotFoundException if item is not found', async () => {
      const listId = 'list_id';
      myListServiceMock.removeFromMyListById.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(
        controller.removeFromMyListById(listId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('listMyItems', () => {
    it('should list user items', async () => {
      const userId = 'user_id';
      const page = 1;
      const limit = 10;
      const result = {
        userList: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
      };
      myListServiceMock.listMyItems.mockResolvedValueOnce(result);
      const response = await controller.listMyItems(userId, page, limit);
      expect(response).toEqual(result);
    });
  });
});
