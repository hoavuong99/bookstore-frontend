import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const  baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token =  localStorage.getItem('token');
        if(token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
})

const normalizeBook = (book) => ({
    ...book,
    _id: book?.id,
    newPrice: Number(book?.price || 0),
    oldPrice: Number(book?.price || 0),
    coverImage: book?.imageUrl || '',
    description: book?.description || `ISBN: ${book?.isbn || ''}`,
    categoryIds: Array.isArray(book?.categoryIds) ? book.categoryIds : [],
    categoryNames: Array.isArray(book?.categoryNames) ? book.categoryNames : [],
    category: Array.isArray(book?.categoryNames) ? book.categoryNames.join(', ') : '',
});

const unwrapApiResponse = (response) => {
    if (response?.success === true) {
        return response.data;
    }
    return response;
};

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Books', 'Categories', 'Cart'],
    endpoints: (builder) =>({
        fetchAllCategories: builder.query({
            query: () => "/categories",
            transformResponse: unwrapApiResponse,
            providesTags: ["Categories"],
        }),
        createCategory: builder.mutation({
            query: (category) => ({
                url: "/categories",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["Categories"],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...category }) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: category,
            }),
            invalidatesTags: ["Books", "Categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Books", "Categories"],
        }),
        fetchAllBooks: builder.query({
            query: () => "/books",
            transformResponse: (response) => {
                const data = unwrapApiResponse(response);
                return Array.isArray(data) ? data.map(normalizeBook) : [];
            },
            providesTags: ["Books"]
        }),
        fetchBookById: builder.query({
            query: (id) => `/books/${id}`,
            transformResponse: (response) => normalizeBook(unwrapApiResponse(response)),
            providesTags: (result, error, id) => [{ type: "Books", id }],
        }),
        addBook: builder.mutation({
            query: (newBook) => ({
                url: `/books`,
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ["Books"]
        }),
        updateBook: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/books/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/books/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Books"]
        }),
        getCart: builder.query({
            query: () => "/cart",
            transformResponse: (response) => unwrapApiResponse(response),
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation({
            query: ({ bookId, quantity = 1 }) => ({
                url: "/cart/items",
                method: "POST",
                body: { bookId, quantity },
            }),
            transformResponse: (response) => unwrapApiResponse(response),
            invalidatesTags: ["Cart"],
        }),
        removeFromCart: builder.mutation({
            query: (itemId) => ({
                url: `/cart/items/${itemId}`,
                method: "DELETE",
            }),
            transformResponse: (response) => unwrapApiResponse(response),
            invalidatesTags: ["Cart"],
        })
    })
})

export const {
    useFetchAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchAllBooksQuery,
    useFetchBookByIdQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
} = booksApi;
export default booksApi;