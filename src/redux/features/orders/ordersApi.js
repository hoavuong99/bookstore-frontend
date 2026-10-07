import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/v1/orders`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (newOrder) => ({
                url: "/checkout",
                method: "POST",
                body: newOrder,
            }),
            transformResponse: (response) => response?.data || response,
        }),
        createZaloPayPayment: builder.mutation({
            query: (orderId) => ({
                url: `/${orderId}/payment/zalopay`,
                method: "POST",
            }),
            transformResponse: (response) => response?.data || response,
        }),
        refreshZaloPayPayment: builder.query({
            query: (orderId) => `/${orderId}/payment/zalopay`,
            transformResponse: (response) => response?.data || response,
            providesTags: ["Orders"],
        }),
        getOrderByEmail: builder.query({
            query: ({ page = 0, size = 10 } = {}) => `/my-orders?page=${page}&size=${size}`,
            transformResponse: (response) => {
                const data = response?.data || response;
                return Array.isArray(data)
                    ? { content: data, totalPages: 1 }
                    : data;
            },
            providesTags: ['Orders']
        }),
        getAllOrders: builder.query({
            query: ({ page = 0, size = 10 } = {}) => `/admin/all?page=${page}&size=${size}`,
            transformResponse: (response) => {
                const data = response?.data || response;
                return Array.isArray(data)
                    ? { content: data, totalPages: 1 }
                    : data;
            },
            providesTags: ["Orders"],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `/admin/${orderId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Orders"],
        })
        ,
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/${orderId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["Orders"],
        }),
    })
})

export const {
    useCreateOrderMutation,
    useCreateZaloPayPaymentMutation,
    useRefreshZaloPayPaymentQuery,
    useLazyRefreshZaloPayPaymentQuery,
    useGetOrderByEmailQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
} = ordersApi;

export default ordersApi;