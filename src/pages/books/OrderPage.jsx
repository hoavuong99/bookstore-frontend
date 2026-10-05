import { useState } from "react";
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";

const OrderPage = () => {
  const [page, setPage] = useState(0);

  const {
    data: orderPage = {},
    isLoading,
    isError,
  } = useGetOrderByEmailQuery({ page, size: 10 });
  const orders = orderPage.content || [];

  if (isLoading) 
    return <div className="text-center text-lg text-gray-600">Loading...</div>;

  if (isError) 
    return <div className="text-center text-red-500">Error getting orders data</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found!</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order.orderId}
              className="border rounded-lg shadow-sm p-6 bg-white hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex items-center mb-4">
                <p className="p-2 bg-secondary text-white text-center rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">
                  #{index + 1}
                </p>
                <h2 className="text-xl font-semibold">Order ID: {order.orderId}</h2>
              </div>
              <p className="text-gray-700 mb-1">Name: <span className="font-medium">{order.recipientName}</span></p>
              <p className="text-gray-700 mb-1">Phone: <span className="font-medium">{order.recipientPhone}</span></p>
              <p className="text-gray-700 mb-1">Total Price: <span className="font-medium">${order.totalAmount}</span></p>
              <p className="text-gray-700 mb-1">Status: <span className="font-medium">{order.orderStatus}</span></p>
              <p className="text-gray-700 mb-1">Payment: <span className="font-medium">{order.paymentMethod}</span></p>
            </div>
          ))}
        </div>
      )}
      {orderPage.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button type="button" disabled={page === 0} onClick={() => setPage((current) => current - 1)} className="rounded-md border px-4 py-2 disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-600">Page {page + 1} of {orderPage.totalPages}</span>
          <button type="button" disabled={page + 1 >= orderPage.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-md border px-4 py-2 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
