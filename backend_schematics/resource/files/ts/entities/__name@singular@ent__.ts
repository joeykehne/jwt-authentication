import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class <%= classify(name) %> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;



  // Relationships

  @ManyToOne(() => User, (user) => user.<%= camelize(name) %>)
  user: User;


  // Functions

  @BeforeInsert()
  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();

    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}
