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
              key={order._id}
              className="border rounded-lg shadow-sm p-6 bg-white hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex items-center mb-4">
                <p className="p-2 bg-secondary text-white text-center rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">
                  #{index + 1}
                </p>
                <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              </div>
              <p className="text-gray-700 mb-1">Name: <span className="font-medium">{order.name}</span></p>
              <p className="text-gray-700 mb-1">Email: <span className="font-medium">{order.email}</span></p>
              <p className="text-gray-700 mb-1">Phone: <span className="font-medium">{order.phone}</span></p>
              <p className="text-gray-700 mb-1">Total Price: <span className="font-medium">${order.totalPrice}</span></p>
              <h3 className="text-lg font-semibold mt-4">Address:</h3>
              <p className="text-gray-700">
                {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
              </p>
              <h3 className="text-lg font-semibold mt-4">Products:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {order.productIds.map((productId) => (
                  <li key={productId}>{productId}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
