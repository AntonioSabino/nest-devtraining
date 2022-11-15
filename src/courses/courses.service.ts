import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  private courses: Course[] = [
    {
      id: '1',
      name: 'NestJS',
      description:
        'NestJS é um framework Node.js para construção de aplicações escaláveis.',
      tags: ['nodejs', 'nestjs', 'framework', 'typescript'],
    },
  ];

  findAll() {
    return this.courses;
  }

  findOne(id: string) {
    const course = this.courses.find((course) => course.id === id);

    if (!course) {
      throw new HttpException(`Course #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return course;
  }

  create(createCourseDto: any) {
    this.courses.push(createCourseDto);
  }

  update(id: string, updateCourseDto: any) {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    this.courses[courseIndex] = updateCourseDto;
  }

  remove(id: string) {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    this.courses.splice(courseIndex, 1);
  }
}
