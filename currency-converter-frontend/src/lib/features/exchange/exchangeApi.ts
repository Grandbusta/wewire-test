import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';

export const exchangeApi = createApi({
  reducerPath: 'exchangeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getExchangeRates: builder.query<{ rates: Record<string, number> }, void>({
      query: () => '/exchange-rates',
    }),
  }),
});

export const { useGetExchangeRatesQuery } = exchangeApi;