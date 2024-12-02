import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course';
import { Place } from './Place';

@Entity()
export class CoursePlace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ nullable: true })
  rank: string; // Lexorank 값

  @Column({ nullable: true })
  orderIndex: number; // 명시적 순서
  //
  // @ManyToOne(() => CoursePlace, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'prev_id' })
  // prev: CoursePlace | null; // Linked List 방식
}
