import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";

const OrderPage = () => {
  const { currentUser } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser?.email);

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
    </div>
  );
};

export default OrderPage;
