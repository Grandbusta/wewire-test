import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 3 })
  source_currency: string;

  @Column({ type: 'char', length: 3 })
  target_currency: string;

  @Column({ type: 'numeric', precision: 16, scale: 6 })
  amount: number;

  @Column({ type: 'numeric', precision: 16, scale: 6 })
  converted_amount: number;

  @Column({ type: 'numeric', precision: 16, scale: 6 })
  conversion_rate: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
  user: User;
}
