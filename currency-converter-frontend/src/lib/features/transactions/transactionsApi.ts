import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';

interface Transaction {
  id: string;
  source_currency: string;
  target_currency: string;
  amount: number;
  converted_amount: number;
  conversion_rate: number;
  created_at: string;
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      console.log('token:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query<{
        data: Transaction[];
        total: number;
        page: number;
        last_page: number;
    }, number>({
      query: (page = 1) => ({
        url: '/user/transactions',
        method: 'GET',
        params: { page, limit: 10 },
      }),
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionsApi;