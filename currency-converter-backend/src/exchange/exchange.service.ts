import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SUPPORTED_CURRENCIES } from '../constants/supported-currencies';
import { lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class ExchangeService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    getSupportedCurrencies(): string[] {
        return SUPPORTED_CURRENCIES;
    }


    async getLatestRates(): Promise<any> {
        const cacheKey = 'exchange-rates';
        const cachedValue = await this.cacheManager.get(cacheKey);
        if (cachedValue) {
            console.log('------Cache hit!');
            return cachedValue;
        }
        const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
        if (!appId) {
            throw new Error('Open Exchange Rates API key is not configured');
        }

        const url = `https://openexchangerates.org/api/latest.json?app_id=${appId}`;

        try {
            const response = await lastValueFrom(this.httpService.get(url));
            const { rates } = response.data;
      
            const filteredRates = Object.keys(rates).reduce((acc, currency) => {
              if (SUPPORTED_CURRENCIES.includes(currency)) {
                acc[currency] = rates[currency];
              }
              return acc;
            }, {});
      
            const data = { base: "USD", rates: filteredRates };
            
            await this.cacheManager.set(cacheKey, data, 3600000); // Cache for 1 hour

            return data;
          } catch (error) {
            throw new HttpException('Failed to fetch exchange rates', HttpStatus.BAD_GATEWAY);
          }
    }
}
