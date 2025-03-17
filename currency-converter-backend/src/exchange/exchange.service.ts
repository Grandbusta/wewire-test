import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SUPPORTED_CURRENCIES } from '../constants/supported-currencies';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class ExchangeService {
    constructor(private readonly httpService: HttpService) { }
    
    getSupportedCurrencies(): string[] {
        return SUPPORTED_CURRENCIES;
    }


    async getLatestRates(): Promise<any> {
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
      
            return { base: "USD", rates: filteredRates };
          } catch (error) {
            throw new HttpException('Failed to fetch exchange rates', HttpStatus.BAD_GATEWAY);
          }
    }
}
