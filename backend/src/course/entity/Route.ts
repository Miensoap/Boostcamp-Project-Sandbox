import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Place } from './Place';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'sourceId' })
  source: Place;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'destinationId' })
  destination: Place;

  @Column({ nullable: true })
  rank: string; // Reorank 값
}
