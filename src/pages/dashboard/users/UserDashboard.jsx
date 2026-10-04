import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';
import {
    useChangeMyPasswordMutation,
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
} from '../../../redux/features/users/usersApi';

const UserDashboard = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);
    const { data: profile } = useGetMyProfileQuery();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();
    const [profileForm, setProfileForm] = useState({
        fullName: currentUser?.fullName || '',
        phone: '',
        address: '',
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (profile) {
            setProfileForm({
                fullName: profile.fullName || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        }
    }, [profile]);

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setErrorMessage('');
        try {
            const updatedProfile = await updateProfile(profileForm).unwrap();
            updateCurrentUser(updatedProfile);
            setMessage('Profile updated successfully.');
        } catch (error) {
            setErrorMessage(error?.data?.message || 'Unable to update your profile.');
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setErrorMessage('');
        try {
            await changePassword(passwordForm).unwrap();
            setPasswordForm({ currentPassword: '', newPassword: '' });
            setMessage('Password changed successfully.');
        } catch (error) {
            setErrorMessage(error?.data?.message || 'Unable to change your password.');
        }
    };

    if (isLoading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
    if (isError) return <div className="text-center text-red-500">Error getting orders data</div>;

    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
                <p className="text-gray-700 mb-8">Welcome, {currentUser?.name || 'User'}! Here are your recent orders:</p>
                {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
                {errorMessage && <p className="mb-4 text-sm text-red-700">{errorMessage}</p>}
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <form onSubmit={handleProfileSubmit} className="rounded-lg border p-5">
                        <h2 className="mb-4 text-xl font-semibold">My Information</h2>
                        <label className="mb-1 block text-sm font-medium">Full name</label>
                        <input value={profileForm.fullName} onChange={(event) => setProfileForm({ ...profileForm, fullName: event.target.value })} required className="mb-3 w-full rounded-md border p-2" />
                        <label className="mb-1 block text-sm font-medium">Phone</label>
                        <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} className="mb-3 w-full rounded-md border p-2" />
                        <label className="mb-1 block text-sm font-medium">Address</label>
                        <textarea value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} className="mb-4 w-full rounded-md border p-2" />
                        <button disabled={isUpdatingProfile} className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
                            {isUpdatingProfile ? 'Saving...' : 'Update Information'}
                        </button>
                    </form>

                    <form onSubmit={handlePasswordSubmit} className="rounded-lg border p-5">
                        <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
                        <label className="mb-1 block text-sm font-medium">Current password</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} required className="mb-3 w-full rounded-md border p-2" />
                        <label className="mb-1 block text-sm font-medium">New password</label>
                        <input type="password" minLength="6" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} required className="mb-4 w-full rounded-md border p-2" />
                        <button disabled={isChangingPassword} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>
                    {orders.length > 0 ? (
                        <ul className="space-y-6">
                            {orders.map((order, index) => (
                                <li
                                    key={order.orderId}
                                    className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">Order #{index + 1}</h3>
                                        <span className="text-sm text-gray-600">Date: {new Date(order?.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 mt-2">Order ID: <span className="font-medium">{order.orderId}</span></p>
                                    <p className="text-gray-700">Total: <span className="font-medium">${order.totalAmount}</span></p>
                                    <p className="text-gray-700">Status: <span className="font-medium">{order.orderStatus}</span></p>
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
