import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoursesService } from './courses.service';
import { CourseEntity } from './entities/course.entity';
import { TagEntity } from './entities/tag.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
});

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(CourseEntity),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(TagEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<MockRepository>(
      getRepositoryToken(CourseEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('find course by ID', () => {
      it('should return a course with the correct ID', async () => {
        const expectedCourse = {};
        courseRepository.findOne.mockReturnValue(expectedCourse);
        const course = await service.findOne('1');
        expect(course).toEqual({});
      });

      it('should return NotFoundException with incorrect ID', async () => {
        courseRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne('100');
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toEqual('Course #100 not found');
        }
      });
    });
  });
});
