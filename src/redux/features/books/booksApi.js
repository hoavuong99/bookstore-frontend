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
    category: book?.category || '',
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
    tagTypes: ['Books'],
    endpoints: (builder) =>({
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
        })
    })
})

export const {useFetchAllBooksQuery, useFetchBookByIdQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation} = booksApi;
export default booksApi;