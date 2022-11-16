import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseEntity } from './entities/course.entity';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,

    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  findAll() {
    return this.coursesRepository.find({
      relations: ['tags'],
    });
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findOne(id, {
      relations: ['tags'],
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    const tags = await Promise.all(
      createCourseDto.tags.map((name) => this.preloadTagByName(name)),
    );

    const course = this.coursesRepository.create({
      ...createCourseDto,
      tags,
    });
    return this.coursesRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const tags =
      updateCourseDto.tags &&
      (await Promise.all(
        updateCourseDto.tags.map((name) => this.preloadTagByName(name)),
      ));

    const course = await this.coursesRepository.preload({
      id: +id,
      ...updateCourseDto,
      tags,
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    return this.coursesRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.coursesRepository.findOne(id);

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    return this.coursesRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<TagEntity> {
    const tag = await this.tagsRepository.findOne({ name });

    if (tag) {
      return tag;
    }

    return this.tagsRepository.create({ name });
  }
}
