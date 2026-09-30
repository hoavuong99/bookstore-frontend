import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

    if (isLoading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
    if (isError) return <div className="text-center text-red-500">Error getting orders data</div>;

    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
                <p className="text-gray-700 mb-8">Welcome, {currentUser?.name || 'User'}! Here are your recent orders:</p>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>
                    {orders.length > 0 ? (
                        <ul className="space-y-6">
                            {orders.map((order, index) => (
                                <li
                                    key={order._id}
                                    className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">Order #{index + 1}</h3>
                                        <span className="text-sm text-gray-600">Date: {new Date(order?.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 mt-2">Order ID: <span className="font-medium">{order._id}</span></p>
                                    <p className="text-gray-700">Total: <span className="font-medium">${order.totalPrice}</span></p>
                                    <div className="mt-4">
                                        <h4 className="text-gray-800 font-medium mb-2">Products:</h4>
                                        <ul className="list-decimal list-inside text-gray-700 space-y-1">
                                            {order.productIds.map((productId) => (
                                                <li key={productId} className="hover:text-blue-600 transition-colors duration-300">
                                                    {productId}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-center">You have no recent orders.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
