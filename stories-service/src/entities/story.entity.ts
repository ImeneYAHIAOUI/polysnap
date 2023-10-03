import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  user: string;
  @Column()
  filename: string;
  @Column()
  views: number;
  @Column()
  format: string;
  @Column()
  size: string;

}
