/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import ListTable from "../../../components/dashboard/ListTable";

const emptyCategory = { name: "", description: "" };
const getErrorMessage = (error, fallback) => error?.data?.message || error?.error || fallback;

const CategoryFormModal = ({ category, onClose, onSaved }) => {
  const isEditing = Boolean(category);
  const [formData, setFormData] = useState(category || emptyCategory);
  const [errorMessage, setErrorMessage] = useState("");
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const payload = { name: formData.name.trim(), description: formData.description.trim() || null };
    if (!payload.name) {
      setErrorMessage("Category name is required.");
      return;
    }
    try {
      if (isEditing) await updateCategory({ id: category.id, ...payload }).unwrap();
      else await createCategory(payload).unwrap();
      onSaved(isEditing ? "Category updated successfully." : "Category created successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, isEditing ? "Unable to update the category." : "Unable to create the category."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Category" : "Add New Category"}</h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500">&times;</button>
        </div>
        {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Category name" className="w-full rounded-md border p-2" required />
          <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} placeholder="Description (optional)" className="min-h-24 w-full rounded-md border p-2" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Cancel</button>
            <button type="submit" disabled={isSaving} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:bg-purple-300">{isSaving ? "Saving..." : isEditing ? "Update Category" : "Add Category"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageCategories = () => {
  const { data: categories = [], isLoading, isError, error } = useFetchAllCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [modalCategory, setModalCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeModal = () => {
    setModalCategory(null);
    setIsAdding(false);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    setMessage("");
    setErrorMessage("");
    try {
      await deleteCategory(category.id).unwrap();
      setMessage("Category deleted successfully.");
    } catch (requestError) {
      setErrorMessage(getErrorMessage(requestError, "Unable to delete the category."));
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="rounded-md bg-red-50 p-4 text-red-700">{getErrorMessage(error, "Unable to load categories.")}</div>;

  return (
    <section className="dashboard-table-section">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => { setMessage(""); setErrorMessage(""); setIsAdding(true); }} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700">Add New Category</button>
      </div>
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
      <ListTable
        columns={[
          { label: "Name" },
          { label: "Description" },
          { label: "Actions", className: "dashboard-table-actions" },
        ]}
        emptyMessage="No categories have been created."
      >
        {categories.length > 0 &&
          categories.map((category) => (
              <tr key={category.id}><td className="font-medium">{category.name}</td><td>{category.description || "—"}</td><td className="dashboard-table-actions space-x-3"><button onClick={() => { setMessage(""); setErrorMessage(""); setModalCategory(category); }} className="font-medium text-indigo-600">Edit</button><button onClick={() => handleDelete(category)} disabled={isDeleting} className="font-medium text-red-600 disabled:text-red-300">Delete</button></td></tr>
            ))}
      </ListTable>
      {(isAdding || modalCategory) && <CategoryFormModal category={modalCategory} onClose={closeModal} onSaved={(successMessage) => { closeModal(); setMessage(successMessage); }} />}
    </section>
  );
};

export default ManageCategories;
