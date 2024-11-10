import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
