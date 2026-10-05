import { useState } from "react";
import Loading from "../../../components/Loading";
import ListTable from "../../../components/dashboard/ListTable";
import TablePagination from "../../../components/dashboard/TablePagination";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/features/orders/ordersApi";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.error || fallback;

const statusClasses = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const ManageOrders = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: orderPage = {}, isLoading, isError, error } = useGetAllOrdersQuery({ page, size: pageSize });
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const orders = orderPage.content || [];
  const totalPages = orderPage.totalPages || 0;

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.orderStatus);
    setMessage("");
    setErrorMessage("");
  };

  const closeStatusModal = () => {
    setSelectedOrder(null);
    setSelectedStatus("");
  };

  const handleStatusChange = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    try {
      await updateOrderStatus({
        orderId: selectedOrder.orderId,
        status: selectedStatus,
      }).unwrap();
      closeStatusModal();
      setMessage("Order status updated successfully.");
    } catch (requestError) {
      setErrorMessage(
        getErrorMessage(requestError, "Unable to update the order status.")
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        {getErrorMessage(error, "Unable to load orders.")}
      </div>
    );
  }

  return (
    <section className="dashboard-table-section">
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
      <ListTable
        columns={[
          { label: "Order ID" },
          { label: "Customer" },
          { label: "Phone" },
          { label: "Total" },
          { label: "Payment" },
          { label: "Status" },
          { label: "Created" },
          { label: "Actions", className: "dashboard-table-actions" },
        ]}
        emptyMessage="No orders have been placed."
      >
        {orders.length > 0 &&
          orders.map((order) => (
            <tr key={order.orderId}>
              <td className="font-medium">#{order.orderId}</td>
              <td>{order.recipientName}</td>
              <td>{order.recipientPhone}</td>
              <td>${order.totalAmount}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    statusClasses[order.orderStatus] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="dashboard-table-actions">
                <button
                  type="button"
                  onClick={() => openStatusModal(order)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit Status
                </button>
              </td>
            </tr>
          ))}
      </ListTable>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Edit Order Status</h2>
              <button
                type="button"
                onClick={closeStatusModal}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Update the status for order #{selectedOrder.orderId}.
            </p>
            <form onSubmit={handleStatusChange} className="space-y-5">
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                disabled={isUpdating}
                className="w-full rounded-md border p-2"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeStatusModal} className="rounded-md border px-4 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:bg-purple-300"
                >
                  {isUpdating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <TablePagination page={page} pageSize={pageSize} totalPages={totalPages} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(0); }} />
    </section>
  );
};

export default ManageOrders;
