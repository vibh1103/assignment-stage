import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MyListService } from './my-list.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MyListModule } from './my-list.module';

describe('MyListService', () => {
  let service: MyListService;
  let module: TestingModule;
  let userListRepositoryMock;
  let userRepositoryMock;
  let movieRepositoryMock;
  let tvShowRepositoryMock;
  let cacheManagerMock;

  beforeEach(async () => {
    userListRepositoryMock = {
      findOneByUserIdAndItemId: jest.fn(),
      create: jest.fn(),
      findByIdAndDelete: jest.fn(),
      listByUserId: jest.fn(),
      countByUserId: jest.fn(),
    };

    userRepositoryMock = {
      findById: jest.fn(),
    };

    movieRepositoryMock = {
      findById: jest.fn(),
    };

    tvShowRepositoryMock = {
      findById: jest.fn(),
    };

    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [MyListModule],
      providers: [
        MyListService,
        { provide: 'UserListRepository', useValue: userListRepositoryMock },
        { provide: 'UserRepository', useValue: userRepositoryMock },
        { provide: 'MovieRepository', useValue: movieRepositoryMock },
        { provide: 'TvShowRepository', useValue: tvShowRepositoryMock },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile();

    service = module.get<MyListService>(MyListService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('addToMyList', () => {
    it('should add an item to the user list', async () => {
      const userId = 'user_id';
      const itemId = 'item_id';
      const type = 'movie';

      userRepositoryMock.findById.mockResolvedValueOnce({ id: userId });
      userListRepositoryMock.findOneByUserIdAndItemId.mockResolvedValueOnce(
        null,
      );
      movieRepositoryMock.findById.mockResolvedValueOnce({ id: itemId });

      const result = await service.addToMyList(userId, itemId, type);

      expect(result).toBeDefined();
      expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
      expect(
        userListRepositoryMock.findOneByUserIdAndItemId,
      ).toHaveBeenCalledWith(userId, itemId, 'movieId');
      expect(movieRepositoryMock.findById).toHaveBeenCalledWith(itemId);
      expect(userListRepositoryMock.create).toHaveBeenCalledWith(
        userId,
        itemId,
        type,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'user_id';
      const itemId = 'item_id';
      const type = 'movie';

      userRepositoryMock.findById.mockResolvedValueOnce(null);

      await expect(
        service.addToMyList(userId, itemId, type),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException if item already exists in the list', async () => {
      const userId = 'user_id';
      const itemId = 'item_id';
      const type = 'movie';

      userRepositoryMock.findById.mockResolvedValueOnce({ id: userId });
      userListRepositoryMock.findOneByUserIdAndItemId.mockResolvedValueOnce({});

      await expect(
        service.addToMyList(userId, itemId, type),
      ).rejects.toThrowError(ConflictException);
    });

    it('should throw NotFoundException if item is not found', async () => {
      const userId = 'user_id';
      const itemId = 'item_id';
      const type = 'movie';

      userRepositoryMock.findById.mockResolvedValueOnce({ id: userId });
      userListRepositoryMock.findOneByUserIdAndItemId.mockResolvedValueOnce(
        null,
      );
      movieRepositoryMock.findById.mockResolvedValueOnce(null);

      await expect(
        service.addToMyList(userId, itemId, type),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('removeFromMyListById', () => {
    it('should remove an item from the user list', async () => {
      const listId = 'list_id';
      const removedItem = { id: listId };

      userListRepositoryMock.findByIdAndDelete.mockResolvedValueOnce(
        removedItem,
      );

      const result = await service.removeFromMyListById(listId);

      expect(result).toBe(removedItem);
      expect(userListRepositoryMock.findByIdAndDelete).toHaveBeenCalledWith(
        listId,
      );
    });

    it('should throw NotFoundException if item is not found', async () => {
      const listId = 'list_id';

      userListRepositoryMock.findByIdAndDelete.mockResolvedValueOnce(null);

      await expect(service.removeFromMyListById(listId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('listMyItems', () => {
    it('should list user items', async () => {
      const userId = 'user_id';
      const page = 1;
      const limit = 10;
      const totalItems = 20;
      const userList = [{}, {}];

      userListRepositoryMock.listByUserId.mockResolvedValueOnce(userList);
      userListRepositoryMock.countByUserId.mockResolvedValueOnce(totalItems);

      const result = await service.listMyItems(userId, page, limit);

      expect(result).toEqual({
        userList,
        totalItems,
        totalPages: 2,
        currentPage: page,
      });
      expect(userListRepositoryMock.listByUserId).toHaveBeenCalledWith(
        userId,
        page,
        limit,
      );
      expect(userListRepositoryMock.countByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
