import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeModule } from './exchange/exchange.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ConvertModule } from './convert/convert.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, 
      synchronize: true
    }),
    AuthModule,
    ExchangeModule,
    TransactionsModule,
    ConvertModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
