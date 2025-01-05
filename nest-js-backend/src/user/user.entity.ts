import { RefreshToken } from 'src/auth/refreshToken.entity';
import { Role } from 'src/auth/role/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ default: false })
  isPaying: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ nullable: true })
  registeredAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;
}
