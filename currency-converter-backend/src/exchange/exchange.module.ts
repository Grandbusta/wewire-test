import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [ExchangeService],
  controllers: [ExchangeController],
  exports: [ExchangeService],
})
export class ExchangeModule { }
