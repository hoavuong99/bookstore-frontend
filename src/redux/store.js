import { configureStore } from '@reduxjs/toolkit'
import booksApi from './features/books/booksApi'
import ordersApi from './features/orders/ordersApi'
import usersApi from './features/users/usersApi'
import apiToastMiddleware from './apiToastMiddleware'
import dashboardApi from './features/dashboard/dashboardApi'

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      usersApi.middleware,
      dashboardApi.middleware,
      apiToastMiddleware,
    ),
})