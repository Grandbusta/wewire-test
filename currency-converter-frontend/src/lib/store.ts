import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/auth/authApi';
import { convertApi } from './features/convert/convertApi';
import { transactionsApi } from './features/transactions/transactionsApi';
import { exchangeApi } from './features/exchange/exchangeApi';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [convertApi.reducerPath]: convertApi.reducer,
    [exchangeApi.reducerPath]: exchangeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(convertApi.middleware)
      .concat(exchangeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;