import { Controller, Put, Post, Body, Param } from '@nestjs/common';
import { CoursesService } from './CoursesService';
import { DataSeeder } from './DataSeeder';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService,
              private readonly dataSeeder: DataSeeder) {
  }

  @Put(':id/places/single')
  async updateCoursePlacesSingle(
    @Param('id') courseId: number,
    @Body() { places }: { places: { placeId: number; orderIndex: number }[] },
  ) {
    await this.coursesService.updateCoursePlacesSingle(courseId, places);
    return { message: '싱글 업데이트 PUT 완료' };
  }

  @Put(':id/places/bulk')
  async updateCoursePlacesBulk(
    @Param('id') courseId: number,
    @Body() { places }: { places: { placeId: number; orderIndex: number }[] },
  ) {
    await this.coursesService.updateCoursePlacesBulk(courseId, places);
    return { message: '벌크 업데이트 PUT 완료' };
  }

  @Post(':id/places/lexorank')
  async reorderCoursePlacesLexorank(
    @Param('id') courseId: number,
    @Body() body: { updatedPlaces: { placeId: number; prevRank: string | null; nextRank: string | null }[] },
  ): Promise<{ message: string }> {
    await this.coursesService.reorderCoursePlacesLexorank(courseId, body.updatedPlaces);
    return { message: 'LexoRank 방식으로 순서가 업데이트되었습니다.' };
  }

  // @Post(':courseId/places/linked-list')
  // async updateCoursePlacesLinkedList(
  //   @Param('courseId') courseId: number,
  //   @Body('updatedPlaces') updatedPlaces: { id: number; prevId: number | null }[],
  // ): Promise<{ message: string }> {
  //   await this.coursesService.updateCoursePlacesLinkedList(courseId, updatedPlaces);
  //   return { message: 'Linked list order updated successfully' };
  // }
  //
  // @Post(':courseId/places/enhanced-linked-list')
  // async updateCoursePlacesEnhancedLinkedList(
  //   @Param('courseId') courseId: number,
  //   @Body('updatedOrder') updatedOrder: { id: number }[],
  // ): Promise<{ message: string }> {
  //   await this.coursesService.updateCoursePlacesEnhancedLinkedList(courseId, updatedOrder);
  //   return { message: 'Linked list order updated successfully' };
  // }

  @Post('seed')
  async seedData(): Promise<string> {
    await this.dataSeeder.seed();
    return 'Seeding completed!';
  }
}

