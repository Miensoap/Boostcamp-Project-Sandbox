import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/TypeOrmConfigService';
import { CoursesController } from './course/CoursesController';
import { CoursesService } from './course/CoursesService';
import { CoursePlace } from './course/entity/CoursePlace';
import { Course } from './course/entity/Course';
import { Place } from './course/entity/Place';
import { Route } from './course/entity/Route';
import { DataSeeder } from './course/DataSeeder';
import { RequestIdMiddleware } from './config/RequestIdMiddleware';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: 'logs/queries.log',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`,
            ),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([Place, Course, CoursePlace, Route]),

  ],
  controllers: [AppController, CoursesController],
  providers: [AppService, CoursesService, DataSeeder],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
