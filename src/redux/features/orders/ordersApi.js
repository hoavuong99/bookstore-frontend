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
            })
        }),
        getOrderByEmail: builder.query({
            query: () => ({
                url: "/my-orders",
            }),
            transformResponse: (response) => {
                const data = response?.data || response;
                return Array.isArray(data) ? data : data?.content || [];
            },
            providesTags: ['Orders']
        }),
        getAllOrders: builder.query({
            query: () => "/admin/all?page=0&size=100",
            transformResponse: (response) => {
                const data = response?.data || response;
                return Array.isArray(data) ? data : data?.content || [];
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
    })
})

export const {
    useCreateOrderMutation,
    useGetOrderByEmailQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
} = ordersApi;

export default ordersApi;