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
import { formatVND } from "../../../utils/currency";

const emptyBook = {
  title: "",
  authorName: "",
  isbn: "",
  price: "",
  stockQuantity: "",
  categoryIds: [],
  description: "",
  imageUrl: "",
  editorsPick: false,
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
  const selectedCategoryIds = watch("categoryIds") || [];
  const selectedCategoryNames = categories
    .filter((category) => selectedCategoryIds.includes(String(category.id)))
    .map((category) => category.name);

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
      authorName: data.authorName?.trim() || null,
      isbn: data.isbn.trim(),
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity),
      categoryIds: data.categoryIds.map(Number),
      description: data.description?.trim() || "",
      imageUrl: data.imageUrl?.trim() || null,
      editorsPick: Boolean(data.editorsPick),
    };

    try {
      let requestBody = payload;
      if (imageFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key === "categoryIds") {
            value.forEach((categoryId) => formData.append(key, String(categoryId)));
          } else if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });
        formData.append("image", imageFile);
        requestBody = formData;
      }
      if (isEditing) await updateBook({ id: book.id, body: requestBody }).unwrap();
      else await addBook(requestBody).unwrap();
      onSaved(isEditing ? "Cập nhật sách thành công." : "Tạo sách thành công.");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, isEditing ? "Không thể cập nhật sách." : "Không thể tạo sách.")
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Chỉnh sửa sách" : "Thêm sách mới"}
          </h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            ["title", "Tên sách", "text"],
            ["authorName", "Tác giả", "text"],
            ["isbn", "ISBN", "text"],
            ["price", "Giá (nghìn đồng)", "number"],
            ["stockQuantity", "Số lượng tồn kho", "number"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor={`book-${name}`}>
                {label}
              </label>
              <input
                id={`book-${name}`}
                type={type}
                step={name === "price" ? "any" : undefined}
                {...register(name, { required: name !== "authorName" })}
                className="w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
              {errors[name] && <p className="text-sm text-red-600">{label} là bắt buộc.</p>}
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input type="checkbox" {...register("editorsPick")} />
            Lựa chọn biên tập
          </label>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-categoryIds">
              Thể loại
            </label>
            <input type="hidden" {...register("categoryIds", { required: true })} />
            <div className="relative">
              <button
                id="book-categoryIds"
                type="button"
                disabled={isLoadingCategories}
                onClick={() => setIsCategoryMenuOpen((open) => !open)}
                className="flex min-h-11 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left focus:border-blue-300 focus:outline-none focus:ring"
              >
                <span className={selectedCategoryNames.length ? "text-gray-800" : "text-gray-400"}>
                  {selectedCategoryNames.length
                    ? `${selectedCategoryNames.length} đã chọn: ${selectedCategoryNames.join(", ")}`
                    : "Chọn thể loại"}
                </span>
                <span className="ml-3 text-gray-500">{isCategoryMenuOpen ? "▴" : "▾"}</span>
              </button>
              {isCategoryMenuOpen && (
                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-white p-2 shadow-lg">
                  {categories.length === 0 ? (
                    <p className="px-2 py-1 text-sm text-gray-500">Chưa có thể loại.</p>
                  ) : (
                    categories.map((category) => {
                      const categoryId = String(category.id);
                      const isSelected = selectedCategoryIds.includes(categoryId);
                      return (
                        <label key={category.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const nextCategoryIds = isSelected
                                ? selectedCategoryIds.filter((id) => id !== categoryId)
                                : [...selectedCategoryIds, categoryId];
                              setValue("categoryIds", nextCategoryIds, { shouldValidate: true, shouldDirty: true });
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{category.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
            {errors.categoryIds && <p className="text-sm text-red-600">Chọn ít nhất một thể loại.</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-description">
              Mô tả
            </label>
            <textarea id="book-description" {...register("description")} className="min-h-24 w-full rounded-md border p-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-imageUrl">
              URL hình ảnh
            </label>
            <input id="book-imageUrl" {...register("imageUrl")} className="w-full rounded-md border p-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="book-image">
              {isEditing ? "Thay ảnh bìa" : "Tải ảnh bìa lên"}
            </label>
            <input id="book-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setImageFile(event.target.files[0] || null)} />
            <p className="mt-1 text-xs text-gray-500">Tối đa 5 MB. JPEG, PNG, WEBP hoặc GIF.</p>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Hủy</button>
            <button type="submit" disabled={isSaving} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:bg-purple-300">
              {isSaving ? "Đang lưu..." : isEditing ? "Cập nhật sách" : "Thêm sách"}
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
    if (!(await confirmAction("Xóa sách?", `Bạn có chắc muốn xóa "${book.title}" không?`))) return;
    setMessage("");
    setErrorMessage("");
    try {
      await deleteBook(book.id).unwrap();
      setMessage("Xóa sách thành công.");
    } catch (requestError) {
      setErrorMessage(getErrorMessage(requestError, "Không thể xóa sách."));
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="rounded-md bg-red-50 p-4 text-red-700">{getErrorMessage(error, "Không thể tải sách.")}</div>;

  return (
    <section className="dashboard-table-section">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => { setMessage(""); setErrorMessage(""); setIsAdding(true); }} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700">
          Thêm sách mới
        </button>
      </div>
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
      <ListTable
        columns={[
          { label: "Tên sách" },
          { label: "Thể loại" },
          { label: "Giá" },
          { label: "Tồn kho" },
          { label: "Thao tác", className: "dashboard-table-actions" },
        ]}
        emptyMessage="Chưa có sách nào."
      >
        {books.length > 0 &&
          books.map((book) => (
              <tr key={book.id}>
                <td className="font-medium">{book.title}</td>
                <td>{book.categoryNames.join(", ") || "—"}</td>
                <td>{formatVND(book.newPrice)}</td>
                <td className={book.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
                  {book.stockQuantity ?? 0}
                </td>
                <td className="dashboard-table-actions space-x-3">
                  <button onClick={() => { setMessage(""); setErrorMessage(""); setModalBook(book); }} className="font-medium text-indigo-600">Sửa</button>
                  <button onClick={() => handleDelete(book)} disabled={isDeleting} className="font-medium text-red-600 disabled:text-red-300">Xóa</button>
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
