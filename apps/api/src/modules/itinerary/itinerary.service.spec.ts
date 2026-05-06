import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryService } from './itinerary.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('ItineraryService', () => {
  let service: ItineraryService;
  let supabaseService: SupabaseService;

  const mockSupabaseClient = {
    from: jest.fn(),
  };

  const mockSupabaseService = {
    client: mockSupabaseClient,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItineraryService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ItineraryService>(ItineraryService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getItinerary', () => {
    it('should return itinerary with days and items', async () => {
      const tripId = 'trip-123';
      const mockDays = [
        { id: 'day-1', trip_id: tripId, day_number: 1, created_at: '2026-05-06' },
        { id: 'day-2', trip_id: tripId, day_number: 2, created_at: '2026-05-07' },
      ];
      const mockItems = [
        {
          id: 'item-1',
          day_id: 'day-1',
          title: 'Breakfast',
          time: '08:00',
          category: 'Food',
          duration: '1 hour',
          cost: '$10',
          notes: 'At hotel',
          position: 0,
          created_at: '2026-05-06',
        },
        {
          id: 'item-2',
          day_id: 'day-1',
          title: 'Tour',
          time: '10:00',
          category: 'Activity',
          duration: '3 hours',
          cost: '$50',
          notes: 'Museum tour',
          position: 1,
          created_at: '2026-05-06',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      // Mock days query
      mockQuery.select.mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({ data: mockDays, error: null }),
      } as any);

      // Mock items queries
      mockQuery.select.mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({ data: mockItems, error: null }),
      } as any);

      mockQuery.select.mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
      } as any);

      // Rebuild the mock to work correctly
      mockSupabaseClient.from.mockReset();

      const selectMock = jest.fn();
      const eqMock = jest.fn();
      const orderMock = jest.fn();

      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'itinerary_days') {
          return {
            select: selectMock.mockReturnThis(),
            eq: eqMock.mockReturnThis(),
            order: orderMock.mockResolvedValueOnce({ data: mockDays, error: null }),
          };
        } else if (table === 'itinerary_items') {
          return {
            select: selectMock.mockReturnThis(),
            eq: eqMock.mockReturnThis(),
            order: orderMock.mockResolvedValueOnce({ data: mockItems, error: null }),
          };
        }
      });

      const result = await service.getItinerary(tripId);

      expect(result.days).toHaveLength(2);
      expect(result.days[0].items).toHaveLength(2);
    });

    it('should throw error if days query fails', async () => {
      const tripId = 'trip-123';
      const error = new Error('Database error');

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({ data: null, error }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.getItinerary(tripId)).rejects.toThrow('Database error');
    });
  });

  describe('createItem', () => {
    it('should create and return a new itinerary item', async () => {
      const dayId = 'day-1';
      const createDto = {
        title: 'Breakfast',
        time: '08:00',
        category: 'Food',
        duration: '1 hour',
        cost: '$10',
        notes: 'At hotel',
      };

      const mockItem = {
        id: 'item-new',
        day_id: dayId,
        ...createDto,
        position: 0,
        created_at: '2026-05-06',
      };

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: mockItem, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.createItem(dayId, createDto);

      expect(result).toEqual(mockItem);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('itinerary_items');
      expect(mockQuery.insert).toHaveBeenCalledWith({ ...createDto, day_id: dayId });
    });

    it('should throw error if insert fails', async () => {
      const dayId = 'day-1';
      const createDto = {
        title: 'Breakfast',
        time: '08:00',
      };
      const error = new Error('Insert failed');

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: null, error }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.createItem(dayId, createDto)).rejects.toThrow('Insert failed');
    });
  });

  describe('updateItem', () => {
    it('should update and return the itinerary item', async () => {
      const itemId = 'item-1';
      const updateDto = {
        title: 'Updated Breakfast',
        time: '09:00',
      };

      const mockUpdatedItem = {
        id: itemId,
        day_id: 'day-1',
        ...updateDto,
        category: 'Food',
        duration: '1 hour',
        cost: '$10',
        notes: 'At hotel',
        position: 0,
        created_at: '2026-05-06',
      };

      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: mockUpdatedItem, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.updateItem(itemId, updateDto);

      expect(result).toEqual(mockUpdatedItem);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('itinerary_items');
      expect(mockQuery.update).toHaveBeenCalledWith(updateDto);
    });

    it('should throw error if update fails', async () => {
      const itemId = 'item-1';
      const updateDto = { title: 'Updated' };
      const error = new Error('Update failed');

      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: null, error }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.updateItem(itemId, updateDto)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteItem', () => {
    it('should delete an itinerary item', async () => {
      const itemId = 'item-1';

      const mockQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.deleteItem(itemId);

      expect(result).toEqual({ success: true });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('itinerary_items');
      expect(mockQuery.delete).toHaveBeenCalled();
    });

    it('should throw error if delete fails', async () => {
      const itemId = 'item-1';
      const error = new Error('Delete failed');

      const mockQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({ data: null, error }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.deleteItem(itemId)).rejects.toThrow('Delete failed');
    });
  });
});
