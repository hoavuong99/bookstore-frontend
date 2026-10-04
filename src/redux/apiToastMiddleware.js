import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { showErrorToast, showSuccessToast } from "../utils/toast";

const mutationMessages = {
  addBook: "Book created successfully.",
  updateBook: "Book updated successfully.",
  deleteBook: "Book deleted successfully.",
  createCategory: "Category created successfully.",
  updateCategory: "Category updated successfully.",
  deleteCategory: "Category deleted successfully.",
  updateOrderStatus: "Order status updated successfully.",
  updateUserRole: "User role updated successfully.",
  updateMyProfile: "Profile updated successfully.",
  changeMyPassword: "Password changed successfully.",
  createOrder: "Order placed successfully.",
  addToCart: "Book added to cart.",
  removeFromCart: "Item removed from cart.",
  clearCart: "Cart cleared successfully.",
};

const getMutationEndpoint = (action) =>
  action.meta?.arg?.type === "mutation" ? action.meta.arg.endpointName : null;

const getErrorMessage = (action) =>
  action.payload?.data?.message ||
  action.payload?.error ||
  action.error?.message ||
  "The action could not be completed.";

const apiToastMiddleware = () => (next) => (action) => {
  const endpointName = getMutationEndpoint(action);
  if (endpointName && isFulfilled(action)) {
    showSuccessToast(mutationMessages[endpointName] || "Action completed successfully.");
  } else if (endpointName && isRejected(action)) {
    showErrorToast(getErrorMessage(action));
  }

  return next(action);
};

export default apiToastMiddleware;
