/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesPageQuery,
  useUpdateCategoryMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import ListTable from "../../../components/dashboard/ListTable";
import TablePagination from "../../../components/dashboard/TablePagination";
import confirmAction from "../../../utils/confirmAction";

const emptyCategory = { name: "", description: "", imageUrl: "" };
const getErrorMessage = (error, fallback) => error?.data?.message || error?.error || fallback;

const CategoryFormModal = ({ category, onClose, onSaved }) => {
  const isEditing = Boolean(category);
  const [formData, setFormData] = useState(category || emptyCategory);
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      imageUrl: formData.imageUrl?.trim() || null,
    };
    if (!payload.name) {
      setErrorMessage("Tên thể loại là bắt buộc.");
      return;
    }
    try {
      let requestBody = payload;
      if (imageFile) {
        const multipartBody = new FormData();
        multipartBody.append("name", payload.name);
        multipartBody.append("description", payload.description || "");
        multipartBody.append("imageUrl", payload.imageUrl || "");
        multipartBody.append("image", imageFile);
        requestBody = multipartBody;
      }
      if (isEditing) await updateCategory({ id: category.id, body: requestBody }).unwrap();
      else await createCategory(requestBody).unwrap();
      onSaved(isEditing ? "Cập nhật thể loại thành công." : "Tạo thể loại thành công.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, isEditing ? "Không thể cập nhật thể loại." : "Không thể tạo thể loại."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}</h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500">&times;</button>
        </div>
        {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Tên thể loại" className="w-full rounded-md border p-2" required />
          <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} placeholder="Mô tả (không bắt buộc)" className="min-h-24 w-full rounded-md border p-2" />
          <input value={formData.imageUrl || ""} onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })} placeholder="URL hình ảnh (không bắt buộc)" className="w-full rounded-md border p-2" />
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="category-image">Tải ảnh thể loại</label>
            <input id="category-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setImageFile(event.target.files[0] || null)} className="w-full rounded-md border p-2" />
            <p className="mt-1 text-xs text-gray-500">Tối đa 5 MB. JPEG, PNG, WEBP hoặc GIF.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Hủy</button>
            <button type="submit" disabled={isSaving} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:bg-purple-300">{isSaving ? "Đang lưu..." : isEditing ? "Cập nhật thể loại" : "Thêm thể loại"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageCategories = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: categoryPage = {}, isLoading, isError, error } = useFetchCategoriesPageQuery({ page, size: pageSize });
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [modalCategory, setModalCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const categories = categoryPage.content || [];
  const totalPages = categoryPage.totalPages || 0;

  const closeModal = () => {
    setModalCategory(null);
    setIsAdding(false);
  };

  const handleDelete = async (category) => {
    if (!(await confirmAction("Xóa thể loại?", `Bạn có chắc muốn xóa "${category.name}" không?`))) return;
    setMessage("");
    setErrorMessage("");
    try {
      await deleteCategory(category.id).unwrap();
      setMessage("Xóa thể loại thành công.");
    } catch (requestError) {
      setErrorMessage(getErrorMessage(requestError, "Không thể xóa thể loại."));
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="rounded-md bg-red-50 p-4 text-red-700">{getErrorMessage(error, "Không thể tải thể loại.")}</div>;

  return (
    <section className="dashboard-table-section">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => { setMessage(""); setErrorMessage(""); setIsAdding(true); }} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700">Thêm thể loại mới</button>
      </div>
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
      <ListTable
        columns={[
          { label: "Tên" },
          { label: "Mô tả" },
          { label: "Thao tác", className: "dashboard-table-actions" },
        ]}
        emptyMessage="Chưa có thể loại nào."
      >
        {categories.length > 0 &&
          categories.map((category) => (
              <tr key={category.id}><td className="font-medium">{category.name}</td><td>{category.description || "—"}</td><td className="dashboard-table-actions space-x-3"><button onClick={() => { setMessage(""); setErrorMessage(""); setModalCategory(category); }} className="font-medium text-indigo-600">Sửa</button><button onClick={() => handleDelete(category)} disabled={isDeleting} className="font-medium text-red-600 disabled:text-red-300">Xóa</button></td></tr>
            ))}
      </ListTable>
      {(isAdding || modalCategory) && <CategoryFormModal category={modalCategory} onClose={closeModal} onSaved={(successMessage) => { closeModal(); setMessage(successMessage); }} />}
      <TablePagination page={page} pageSize={pageSize} totalPages={totalPages} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(0); }} />
    </section>
  );
};

export default ManageCategories;
