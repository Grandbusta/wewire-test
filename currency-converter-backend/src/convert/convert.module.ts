import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertController } from './convert.controller';
import { ExchangeModule } from '../exchange/exchange.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBalance } from '../auth/entity/user-balance.entity';
import { Transaction } from '../transactions/entity/transaction.entity';

@Module({
  imports: [
    ExchangeModule,
    TypeOrmModule.forFeature([UserBalance, Transaction])
  ],
  controllers: [ConvertController],
  providers: [ConvertService],
})
export class ConvertModule {}
