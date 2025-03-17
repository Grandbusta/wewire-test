import { Injectable, BadRequestException } from '@nestjs/common';
import { ConvertDto } from './dto/convert.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserBalance } from '../auth/entity/user-balance.entity';
import { Transaction } from '../transactions/entity/transaction.entity';

@Injectable()
export class ConvertService {
    constructor(
        private readonly exchangeService: ExchangeService,
        private readonly dataSource: DataSource,
        @InjectRepository(UserBalance)
        private readonly userBalanceRepository: Repository<UserBalance>,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async convertCurrency(userId: string, convertDto: ConvertDto): Promise<any> {
        const { source_currency, target_currency, amount } = convertDto;

        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than zero.');
        }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // Fetch the user's balance for the source currency
            const sourceBalance = await queryRunner.manager.findOne(UserBalance, {
                where: { user: { id: userId }, currency: source_currency },
            });


            if (!sourceBalance || Number(sourceBalance.amount) < amount) {
                throw new BadRequestException('Insufficient balance for conversion.');
            }

            // Get the latest exchange rates and ensure both currencies are supported
            const { rates } = await this.exchangeService.getLatestRates();

            if (!rates[source_currency] || !rates[target_currency]) {
                throw new BadRequestException('Unsupported currency provided.');
            }


            // Calculate conversion rate and the converted amount
            const conversion_rate = rates[target_currency] / rates[source_currency];
            const converted_amount =  Number((amount * conversion_rate).toFixed(6));

            sourceBalance.amount = Number(sourceBalance.amount) - amount;
            await queryRunner.manager.save(sourceBalance);


            // Update (or create) the target balance
            let targetBalance = await queryRunner.manager.findOne(UserBalance, {
                where: { user: { id: userId }, currency: target_currency },
            });
            if (!targetBalance) {
                targetBalance = queryRunner.manager.create(UserBalance, {
                    user: { id: userId },
                    currency: target_currency,
                    amount: 0,
                });
            }
            targetBalance.amount = Number(targetBalance.amount) + converted_amount;
            await queryRunner.manager.save(targetBalance);

            // Record the conversion transaction
            const transaction = queryRunner.manager.create(Transaction, {
                user: { id: userId },
                source_currency: source_currency,
                target_currency: target_currency,
                amount,
                converted_amount: converted_amount,
                conversion_rate: conversion_rate,
            });

            await queryRunner.manager.save(transaction);

            await queryRunner.commitTransaction();

            return {
                source_currency,
                target_currency,
                amount,
                conversion_rate,
                converted_amount,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
