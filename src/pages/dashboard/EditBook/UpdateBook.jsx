/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import InputField from '../addBook/InputField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';

const UpdateBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('isbn', bookData.isbn);
      setValue('price', bookData.price);
      setValue('stockQuantity', bookData.stockQuantity);
      setValue('description', bookData.description);
      setValue('imageUrl', bookData.imageUrl || '');
    }
  }, [bookData, setValue])

  const onSubmit = async (data) => {
    const updateBookData = {
      id,
      title: data.title,
      isbn: data.isbn,
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity),
      description: data.description,
      imageUrl: data.imageUrl || null,
    };
    try {
      await updateBook(updateBookData).unwrap();
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!"
      });
      await refetch()
    } catch (error) {
      console.log("Failed to update book.");
      alert("Failed to update book.");
    }
  }
  if (isLoading) return <Loading />
  if (isError) return <div>Error fetching book data</div>
  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="ISBN"
          name="isbn"
          placeholder="Enter ISBN"
          register={register}
        />

        <InputField
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          register={register}
        />

        <InputField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          placeholder="Enter stock quantity"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <InputField
          label="Image URL"
          name="imageUrl"
          type="text"
          placeholder="Image URL"
          register={register}
        />

        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          {isUpdating ? 'Updating...' : 'Update Book'}
        </button>
      </form>
    </div>
  )
}

export default UpdateBook