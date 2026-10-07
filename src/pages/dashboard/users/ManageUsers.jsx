import { useState } from "react";
import Loading from "../../../components/Loading";
import ListTable from "../../../components/dashboard/ListTable";
import TablePagination from "../../../components/dashboard/TablePagination";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../redux/features/users/usersApi";

const roles = ["CUSTOMER", "STAFF", "ADMIN"];
const roleLabels = {
  CUSTOMER: "Khách hàng",
  STAFF: "Nhân viên",
  ADMIN: "Quản trị viên",
};
const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.error || fallback;

const ManageUsers = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError, error } = useGetUsersQuery({ page, size: pageSize });
  const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const users = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setMessage("");
    setErrorMessage("");
  };

  const closeRoleModal = () => {
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRoleChange = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    try {
      await updateUserRole({
        userId: selectedUser.id,
        role: selectedRole,
      }).unwrap();
      closeRoleModal();
      setMessage("Cập nhật vai trò người dùng thành công.");
    } catch (requestError) {
      setErrorMessage(getErrorMessage(requestError, "Không thể cập nhật vai trò người dùng."));
    }
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        {getErrorMessage(error, "Không thể tải người dùng.")}
      </div>
    );
  }

  return (
    <section className="dashboard-table-section">
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
      <ListTable
        columns={[
          { label: "Họ tên" },
          { label: "Email" },
          { label: "Điện thoại" },
          { label: "Vai trò" },
          { label: "Trạng thái" },
          { label: "Thao tác", className: "dashboard-table-actions" },
        ]}
        emptyMessage="Không tìm thấy người dùng."
      >
        {users.length > 0 &&
          users.map((user) => (
            <tr key={user.id}>
              <td className="font-medium">{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone || "—"}</td>
              <td>{roleLabels[user.role] || user.role}</td>
              <td>{user.isActive ? "Đang hoạt động" : "Không hoạt động"}</td>
              <td className="dashboard-table-actions">
                <button
                  type="button"
                  onClick={() => openRoleModal(user)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sửa vai trò
                </button>
              </td>
            </tr>
          ))}
      </ListTable>
      <TablePagination page={page} pageSize={pageSize} totalPages={totalPages} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(0); }} />
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Sửa vai trò người dùng</h2>
              <button
                type="button"
                onClick={closeRoleModal}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Chọn vai trò cho {selectedUser.fullName || selectedUser.email}.
            </p>
            <form onSubmit={handleRoleChange} className="space-y-5">
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                disabled={isUpdating}
                className="w-full rounded-md border p-2"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{roleLabels[role]}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeRoleModal} className="rounded-md border px-4 py-2">
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:bg-purple-300"
                >
                  {isUpdating ? "Đang lưu..." : "Lưu vai trò"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageUsers;
