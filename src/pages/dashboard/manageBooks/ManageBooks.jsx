/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddBookMutation,
  useDeleteBookMutation,
  useFetchBooksPageQuery,
  useFetchAllCategoriesQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import ListTable from "../../../components/dashboard/ListTable";
import TablePagination from "../../../components/dashboard/TablePagination";
import confirmAction from "../../../utils/confirmAction";

const emptyBook = {
  title: "",
  isbn: "",
  price: "",
  stockQuantity: "",
  categoryIds: [],
  description: "",
  imageUrl: "",
};

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.error || fallback;

const BookFormModal = ({ book, onClose, onSaved }) => {
  const isEditing = Boolean(book);
  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchAllCategoriesQuery();
  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: book
      ? {
          ...book,
          categoryIds: book.categoryIds.map(String),
        }
      : emptyBook,
  });

  const isSaving = isAdding || isUpdating;

  useEffect(() => {
    reset(
      book
        ? {
            ...book,
            categoryIds: Array.isArray(book.categoryIds)
              ? book.categoryIds.map(String)
              : [],
          }
        : emptyBook
    );
  }, [book, categories, reset]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    const payload = {
      title: data.title.trim(),
      isbn: data.isbn.trim(),
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity),
      categoryIds: data.categoryIds.map(Number),
      description: data.description?.trim() || "",
      imageUrl: data.imageUrl?.trim() || null,
    };

    try {
      if (isEditing) {
        await updateBook({ id: book.id, ...payload }).unwrap();
      } else {
        let requestBody = payload;
        if (imageFile) {
          const formData = new FormData();
          formData.append("title", payload.title);
          formData.append("isbn", payload.isbn);
          formData.append("price", String(payload.price));
          formData.append("stockQuantity", String(payload.stockQuantity));
          payload.categoryIds.forEach((categoryId) =>
            formData.append("categoryIds", String(categoryId))
          );
          formData.append("description", payload.description);
          formData.append("image", imageFile);
          requestBody = formData;
        }
        await addBook(requestBody).unwrap();
      }
      onSaved(isEditing ? "Book updated successfully." : "Book created successfully.");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, isEditing ? "Unable to update the book." : "Unable to create the book.")
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            ["title", "Title", "text"],
            ["isbn", "ISBN", "text"],
            ["price", "Price", "number"],
            ["stockQuantity", "Stock Quantity", "number"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor={`book-${name}`}>
                {label}
              </label>
              <input
                id={`book-${name}`}
                type={type}
                step={name === "price" ? "any" : undefined}
                {...register(name, { required: true })}
                className="w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
              {errors[name] && <p className="text-sm text-red-600">{label} is required.</p>}
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-categoryIds">
              Categories
            </label>
            <select
              id="book-categoryIds"
              multiple
              disabled={isLoadingCategories}
              {...register("categoryIds", { required: true })}
              className="min-h-24 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryIds && <p className="text-sm text-red-600">Select at least one category.</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-description">
              Description
            </label>
            <textarea id="book-description" {...register("description")} className="min-h-24 w-full rounded-md border p-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-imageUrl">
              Image URL
            </label>
            <input id="book-imageUrl" {...register("imageUrl")} className="w-full rounded-md border p-2" />
          </div>

          {!isEditing && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-image">
                Cover Image Upload
              </label>
              <input id="book-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0] || null)} />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Cancel</button>
            <button type="submit" disabled={isSaving} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:bg-purple-300">
              {isSaving ? "Saving..." : isEditing ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageBooks = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: bookPage = {}, isLoading, isError, error } = useFetchBooksPageQuery({ page, size: pageSize });
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const [modalBook, setModalBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const books = bookPage.content || [];
  const totalPages = bookPage.totalPages || 0;

  const closeModal = () => {
    setModalBook(null);
    setIsAdding(false);
  };

  const handleDelete = async (book) => {
    if (!(await confirmAction("Delete book?", `Are you sure you want to delete "${book.title}"?`))) return;
    setMessage("");
    setErrorMessage("");
    try {
      await deleteBook(book.id).unwrap();
      setMessage("Book deleted successfully.");
    } catch (requestError) {
      setErrorMessage(getErrorMessage(requestError, "Unable to delete the book."));
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="rounded-md bg-red-50 p-4 text-red-700">{getErrorMessage(error, "Unable to load books.")}</div>;

  return (
    <section className="dashboard-table-section">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => { setMessage(""); setErrorMessage(""); setIsAdding(true); }} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700">
          Add New Book
        </button>
      </div>
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
      <ListTable
        columns={[
          { label: "Title" },
          { label: "Categories" },
          { label: "Price" },
          { label: "Stock" },
          { label: "Actions", className: "dashboard-table-actions" },
        ]}
        emptyMessage="No books have been created."
      >
        {books.length > 0 &&
          books.map((book) => (
              <tr key={book.id}>
                <td className="font-medium">{book.title}</td>
                <td>{book.categoryNames.join(", ") || "—"}</td>
                <td>${book.newPrice}</td>
                <td className={book.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
                  {book.stockQuantity ?? 0}
                </td>
                <td className="dashboard-table-actions space-x-3">
                  <button onClick={() => { setMessage(""); setErrorMessage(""); setModalBook(book); }} className="font-medium text-indigo-600">Edit</button>
                  <button onClick={() => handleDelete(book)} disabled={isDeleting} className="font-medium text-red-600 disabled:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
      </ListTable>
      {(isAdding || modalBook) && (
        <BookFormModal book={modalBook} onClose={closeModal} onSaved={(successMessage) => { closeModal(); setMessage(successMessage); }} />
      )}
      <TablePagination page={page} pageSize={pageSize} totalPages={totalPages} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(0); }} />
    </section>
  );
};

export default ManageBooks;
