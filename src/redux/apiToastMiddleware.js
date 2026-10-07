import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { showErrorToast, showSuccessToast } from "../utils/toast";

const mutationMessages = {
  addBook: "Tạo sách thành công.",
  updateBook: "Cập nhật sách thành công.",
  deleteBook: "Xóa sách thành công.",
  createCategory: "Tạo thể loại thành công.",
  updateCategory: "Cập nhật thể loại thành công.",
  deleteCategory: "Xóa thể loại thành công.",
  updateOrderStatus: "Cập nhật trạng thái đơn hàng thành công.",
  updateUserRole: "Cập nhật vai trò người dùng thành công.",
  updateMyProfile: "Cập nhật hồ sơ thành công.",
  changeMyPassword: "Đổi mật khẩu thành công.",
  createOrder: "Đặt hàng thành công.",
  addToCart: "Đã thêm sách vào giỏ hàng.",
  removeFromCart: "Đã xóa sản phẩm khỏi giỏ hàng.",
  clearCart: "Xóa giỏ hàng thành công.",
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
    showSuccessToast(mutationMessages[endpointName] || "Thao tác thành công.");
  } else if (endpointName && isRejected(action)) {
    showErrorToast(getErrorMessage(action));
  }

  return next(action);
};

export default apiToastMiddleware;
