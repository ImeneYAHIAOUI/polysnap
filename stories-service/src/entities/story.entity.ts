import { AfterInsert,Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn } from 'typeorm';

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
  @CreateDateColumn({ type: 'timestamp' })
  creationTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  expirationTime: Date;

}
