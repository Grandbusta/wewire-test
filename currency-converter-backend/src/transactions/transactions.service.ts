import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findByUserId(userId: string, page: number, limit: number): Promise<any> {
    const [data, total] = await this.transactionRepository.findAndCount({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }
}
