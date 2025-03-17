import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';

interface ConvertResponse {
  source_currency: string;
  target_currency: string;
  amount: number;
  conversion_rate: number;
  converted_amount: number;
}

export const convertApi = createApi({
  reducerPath: 'convertApi',
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
    convertCurrency: builder.mutation<ConvertResponse, { source_currency: string; target_currency: string; amount: number, idempotency_key: string }>({
      query: (body) => ({
        url: '/convert',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useConvertCurrencyMutation } = convertApi;