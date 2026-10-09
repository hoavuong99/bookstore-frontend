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
    authorName: book?.authorName || "Chưa cập nhật tác giả",
    editorsPick: Boolean(book?.editorsPick),
    categoryIds: Array.isArray(book?.categoryIds) ? book.categoryIds : [],
    categoryNames: Array.isArray(book?.categoryNames) ? book.categoryNames : [],
    category: Array.isArray(book?.categoryNames) ? book.categoryNames.join(', ') : '',
});

const normalizeBookPage = (response) => {
    const data = unwrapApiResponse(response);
    if (Array.isArray(data)) return { content: data.map(normalizeBook), totalPages: 1 };
    return { ...data, content: (data?.content || []).map(normalizeBook) };
};

const normalizeCategoryPage = (response) => {
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? { content: data, totalPages: 1 } : { ...data, content: data?.content || [] };
};

const unwrapApiResponse = (response) => {
    if (response?.success === true) {
        return response.data;
    }
    return response;
};

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Books', 'Categories', 'Cart', 'Reviews'],
    endpoints: (builder) =>({
        fetchAllCategories: builder.query({
            query: () => "/categories",
            transformResponse: unwrapApiResponse,
            providesTags: ["Categories"],
        }),
        fetchCategoriesPage: builder.query({
            query: ({ page = 0, size = 10 } = {}) => `/categories?page=${page}&size=${size}`,
            transformResponse: normalizeCategoryPage,
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
            query: ({ id, body, ...category }) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: body || category,
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
        fetchBooksPage: builder.query({
            query: ({ page = 0, size = 10, search = "", categoryId = "", maxPrice = "" } = {}) => {
                const params = new URLSearchParams({ page, size });
                if (search) params.set("search", search);
                if (categoryId) params.set("categoryId", categoryId);
                if (maxPrice) params.set("maxPrice", maxPrice);
                return `/books?${params.toString()}`;
            },
            transformResponse: normalizeBookPage,
            providesTags: ["Books"],
        }),
        fetchBestSellers: builder.query({
            query: ({ size = 10 } = {}) => `/books/best-sellers?size=${size}`,
            transformResponse: (response) => {
                const data = unwrapApiResponse(response);
                return Array.isArray(data) ? data.map(normalizeBook) : [];
            },
            providesTags: ["Books"],
        }),
        fetchNewArrivals: builder.query({
            query: ({ size = 5 } = {}) => `/books/new-arrivals?size=${size}`,
            transformResponse: (response) => {
                const data = unwrapApiResponse(response);
                return Array.isArray(data) ? data.map(normalizeBook) : [];
            },
            providesTags: ["Books"],
        }),
        fetchEditorsPicks: builder.query({
            query: ({ size = 4 } = {}) => `/books/editors-picks?size=${size}`,
            transformResponse: (response) => {
                const data = unwrapApiResponse(response);
                return Array.isArray(data) ? data.map(normalizeBook) : [];
            },
            providesTags: ["Books"],
        }),
        fetchBookById: builder.query({
            query: (id) => `/books/${id}`,
            transformResponse: (response) => normalizeBook(unwrapApiResponse(response)),
            providesTags: (result, error, id) => [{ type: "Books", id }],
        }),
        fetchReviews: builder.query({
            query: (bookId) => `/books/${bookId}/reviews`,
            transformResponse: unwrapApiResponse,
            providesTags: (result, error, bookId) => [{ type: "Reviews", id: bookId }],
        }),
        fetchReviewEligibility: builder.query({
            query: (bookId) => `/books/${bookId}/reviews/eligibility`,
            transformResponse: unwrapApiResponse,
            providesTags: (result, error, bookId) => [{ type: "Reviews", id: `eligibility-${bookId}` }],
        }),
        createReview: builder.mutation({
            query: ({ bookId, rating, comment }) => ({
                url: `/books/${bookId}/reviews`,
                method: "POST",
                body: { rating, comment },
            }),
            invalidatesTags: (result, error, { bookId }) => [
                { type: "Reviews", id: bookId },
                { type: "Reviews", id: `eligibility-${bookId}` },
            ],
        }),
        updateReview: builder.mutation({
            query: ({ bookId, reviewId, rating, comment }) => ({
                url: `/books/${bookId}/reviews/${reviewId}`,
                method: "PUT",
                body: { rating, comment },
            }),
            invalidatesTags: (result, error, { bookId }) => [
                { type: "Reviews", id: bookId },
                { type: "Reviews", id: `eligibility-${bookId}` },
            ],
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
            query: ({ id, body, ...rest }) => ({
                url: `/books/${id}`,
                method: "PUT",
                body: body || rest,
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
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: "/cart/items",
                method: "DELETE",
            }),
            transformResponse: (response) => unwrapApiResponse(response),
            invalidatesTags: ["Cart"],
        })
    })
})

export const {
    useFetchAllCategoriesQuery,
    useFetchCategoriesPageQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchAllBooksQuery,
    useFetchBooksPageQuery,
    useFetchBestSellersQuery,
    useFetchNewArrivalsQuery,
    useFetchEditorsPicksQuery,
    useFetchBookByIdQuery,
    useFetchReviewsQuery,
    useFetchReviewEligibilityQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = booksApi;
export default booksApi;