import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entity/Course';
import { Place } from './entity/Place';
import { CoursePlace } from './entity/CoursePlace';

@Injectable()
export class DataSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(CoursePlace)
    private readonly coursePlaceRepository: Repository<CoursePlace>,
  ) {
  }

  async seed(): Promise<void> {
    console.log('Seeding process started...');

    const connection = this.courseRepository.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 외래 키 비활성화
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);

      // 모든 데이터 삭제
      await queryRunner.query(`TRUNCATE TABLE course_place`);
      await queryRunner.query(`TRUNCATE TABLE place`);
      await queryRunner.query(`TRUNCATE TABLE course`);

      // Course 생성
      const course1 = await queryRunner.manager.save(Course, { id: 1, name: 'Reorder Test Course' });
      const course2 = await queryRunner.manager.save(Course, { id: 2, name: 'Large Course' });

      // Place 대량 생성 (공용으로 사용)
      const places = Array.from({ length: 1000 }, (_, i) => ({ name: `Place ${i + 1}` }));
      const insertedPlaces = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Place)
        .values(places)
        .execute();

      // CoursePlace 데이터 생성 (course_id = 1, 기본 순서)
      const course1Places = insertedPlaces.identifiers.slice(0, 100).map((identifier, index) => ({
        course: { id: course1.id },
        place: { id: identifier.id },
        orderIndex: index + 1,
        rank: `${index}`,
        // prev: index === 0 ? null : { id: index }, // 링크드 리스트 방식 - 주석 처리
      }));

      const course2Places = insertedPlaces.identifiers.map((identifier, index) => ({
        course: { id: course2.id },
        place: { id: identifier.id },
        orderIndex: index + 1,
        rank: `${index}`,
        // prev: index === 0 ? null : { id: insertedPlaces.identifiers[index - 1].id }, // 링크드 리스트 방식 - 주석 처리
      }));

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(CoursePlace)
        .values(course1Places)
        .execute();

      // 외래 키 활성화
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);

      await queryRunner.commitTransaction();
      console.log('Seeding completed with bulk insert!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Seeding failed:', error);
    } finally {
      await queryRunner.release();
    }
  }

  async onApplicationBootstrap() {
    await this.seed();
  }
}
