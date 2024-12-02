import { CoursePlace } from './entity/CoursePlace';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { calculateLexoRank } from './util/lexorank';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CoursePlace)
    private readonly coursePlaceRepository: Repository<CoursePlace>,
  ) {
  }

  // 싱글 업데이트 PUT
  async updateCoursePlacesSingle(
    courseId: number,
    places: { placeId: number; orderIndex: number }[],
  ): Promise<void> {
    for (const place of places) {
      await this.coursePlaceRepository.save({
        course: { id: courseId },
        place: { id: place.placeId },
        orderIndex: place.orderIndex,
      });
    }
  }

  // 벌크 업데이트 PUT
  async updateCoursePlacesBulk(
    courseId: number,
    places: { placeId: number; orderIndex: number }[],
  ): Promise<void> {
    const values = places.map((place) => ({
      course: { id: courseId },
      place: { id: place.placeId },
      orderIndex: place.orderIndex,
    }));

    await this.coursePlaceRepository
      .createQueryBuilder()
      .insert()
      .into(CoursePlace)
      .values(values)
      .orUpdate(['orderIndex'], ['course_id', 'place_id'])
      .execute();
  }

  // Lexorank 방식
  async reorderCoursePlacesLexorank(
    courseId: number,
    updatedPlaces: { placeId: number; prevRank: string | null; nextRank: string | null }[],
  ): Promise<void> {
    const queryRunner = this.coursePlaceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let currentBucket = 0; // 기본 Bucket
      for (const { placeId, prevRank, nextRank } of updatedPlaces) {
        const newRank = calculateLexoRank(prevRank, nextRank, currentBucket);

        if (newRank.split('|')[0] !== `${currentBucket}`) {
          currentBucket = parseInt(newRank.split('|')[0], 10);
        }

        await queryRunner.manager.update(
          CoursePlace,
          { course: { id: courseId }, place: { id: placeId } },
          { rank: newRank },
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


 async updateCoursePlacesLinkedList(
    courseId: number,
    updatedPlaces: { id: number; prevId: number | null }[],
  ): Promise<void> {
    const queryRunner = this.coursePlaceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // `prevId`를 기반으로 `CoursePlace` 객체를 조회 후 업데이트
      for (const place of updatedPlaces) {
        const prevCoursePlace = place.prevId
          ? await queryRunner.manager.findOne(CoursePlace, { where: { id: place.prevId } })
          : null;

        await queryRunner.manager.update(
          CoursePlace,
          { id: place.id, course: { id: courseId } },
          { prev: prevCoursePlace },
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Failed to update linked list:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async updateCoursePlacesEnhancedLinkedList(
    courseId: number,
    updatedOrder: { id: number }[],
  ): Promise<void> {
    const queryRunner = this.coursePlaceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 1: 기존 데이터 조회
      const existingPlaces = await this.coursePlaceRepository.find({
        where: { course: { id: courseId } },
        relations: ['prev'], // 기존 prev 필드 포함
        order: { orderIndex: 'ASC' },
      });

      // Step 2: 입력 데이터에서 prev 계산
      const updatedPrevMap = new Map<number, number | null>();
      updatedOrder.forEach((place, index) => {
        const prevId = index === 0 ? null : updatedOrder[index - 1].id;
        updatedPrevMap.set(place.id, prevId);
      });

      // Step 3: 기존 데이터와 변경된 상태 비교
      const updates: { id: number; prevId: number | null }[] = [];
      existingPlaces.forEach((place) => {
        const currentPrevId = place.prev ? place.prev.id : null;
        const newPrevId = updatedPrevMap.get(place.id);
        if (currentPrevId !== newPrevId) {
          updates.push({ id: place.id, prevId: newPrevId });
        }
      });

      // Step 4: 변경된 부분만 업데이트
      for (const update of updates) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(CoursePlace)
          .set({ prev: update.prevId ? { id: update.prevId } : null })
          .where('id = :id AND course_id = :courseId', {
            id: update.id,
            courseId,
          })
          .execute();
      }

      await queryRunner.commitTransaction();
      console.log(`${updates.length} rows updated`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Failed to update linked list:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


}
