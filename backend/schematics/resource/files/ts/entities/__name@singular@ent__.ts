import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class <%= classify(name) %> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;
}
