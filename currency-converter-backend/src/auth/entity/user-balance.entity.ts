import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'currency'])
export class UserBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.balances, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, default: 0 })
  amount: number;
}
