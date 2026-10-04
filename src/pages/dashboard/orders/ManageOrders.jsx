import { useState } from "react";
import Loading from "../../../components/Loading";
import ListTable from "../../../components/dashboard/ListTable";
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

const ManageOrders = () => {
  const { data: orders = [], isLoading, isError, error } = useGetAllOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleStatusChange = async (orderId, status) => {
    setMessage("");
    setErrorMessage("");
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
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
                <select
                  value={order.orderStatus}
                  disabled={isUpdating}
                  onChange={(event) =>
                    handleStatusChange(order.orderId, event.target.value)
                  }
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
      </ListTable>
    </section>
  );
};

export default ManageOrders;
