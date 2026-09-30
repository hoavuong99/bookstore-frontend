/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import InputField from './InputField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [imageFile, setimageFile] = useState(null);
    const [addBook, {isLoading, isError}] = useAddBookMutation()
    const [imageFileName, setimageFileName] = useState('')
    const onSubmit = async (data) => {
      const payload = {
        title: data.title,
        isbn: data.isbn,
        price: Number(data.price),
        stockQuantity: Number(data.stockQuantity),
        description: data.description,
        imageUrl: data.imageUrl || null,
      };

      let requestBody = payload;

      if (imageFile) {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('isbn', payload.isbn);
        formData.append('price', String(payload.price));
        formData.append('stockQuantity', String(payload.stockQuantity));
        formData.append('description', payload.description || '');
        formData.append('image', imageFile);
        requestBody = formData;
      }

        try {
        await addBook(requestBody).unwrap();
            Swal.fire({
                title: "Book added",
                text: "Your book is uploaded successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
              });
              reset();
              setimageFileName('')
              setimageFile(null);
        } catch (error) {
            console.error(error);
            alert("Failed to add book. Please try again.")   
        }
      
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setimageFile(file);
            setimageFileName(file.name);
        }
    }
  return (
    <div className="max-w-lg   mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        {/* Reusable Input Field for Title */}
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

        {/* Reusable Textarea for Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}

        />

        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 w-full" />
          {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
        </div>

        <InputField
          label="Image URL (optional if no file upload)"
          name="imageUrl"
          placeholder="https://example.com/image.jpg"
          register={register}
        />

        {/* Submit Button */}
        <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
         {
            isLoading ? <span className="">Adding.. </span> : <span>Add Book</span>
          }
        </button>
      </form>
    </div>
  )
}

export default AddBook