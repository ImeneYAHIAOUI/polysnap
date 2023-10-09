import {
  AfterInsert,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @Column()
  filename: string;

  @Column()
  views: number;

  @Column()
  format: string;

  @CreateDateColumn({ type: 'timestamp' })
  creationTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  expirationTime: Date;
}
