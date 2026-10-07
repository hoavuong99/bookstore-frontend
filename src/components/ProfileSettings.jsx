import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import {
  useChangeMyPasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../redux/features/users/usersApi";

const ProfileSettings = ({ showProfile = true, showPassword = true }) => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { data: profile } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userProfile = profile || currentUser;
    setProfileForm({
      fullName: userProfile?.fullName || userProfile?.name || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
    });
  }, [currentUser, profile]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    try {
      const updatedProfile = await updateProfile(profileForm).unwrap();
      updateCurrentUser(updatedProfile);
      setMessage("Cập nhật hồ sơ thành công.");
    } catch (error) {
      setErrorMessage(error?.data?.message || "Không thể cập nhật hồ sơ.");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    try {
      await changePassword(passwordForm).unwrap();
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage("Đổi mật khẩu thành công.");
    } catch (error) {
      setErrorMessage(error?.data?.message || "Không thể đổi mật khẩu.");
    }
  };

  return (
    <div className={`grid gap-6 ${showProfile && showPassword ? "md:grid-cols-2" : "max-w-xl"}`}>
      {showProfile && (
        <form onSubmit={handleProfileSubmit} className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold">Cập nhật hồ sơ</h2>
          <label className="mb-1 block text-sm font-medium">Họ và tên</label>
          <input
            required
            value={profileForm.fullName}
            onChange={(event) => setProfileForm({ ...profileForm, fullName: event.target.value })}
            className="mb-4 w-full rounded-md border p-2"
          />
          <label className="mb-1 block text-sm font-medium">Điện thoại</label>
          <input
            value={profileForm.phone}
            onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
            className="mb-4 w-full rounded-md border p-2"
          />
          <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
          <textarea
            value={profileForm.address}
            onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })}
            className="mb-5 w-full rounded-md border p-2"
          />
          <button disabled={isUpdatingProfile} className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            {isUpdatingProfile ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </form>
      )}

      {showPassword && (
        <form onSubmit={handlePasswordSubmit} className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold">Đổi mật khẩu</h2>
          <label className="mb-1 block text-sm font-medium">Mật khẩu hiện tại</label>
          <input
            type="password"
            required
            value={passwordForm.currentPassword}
            onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
            className="mb-4 w-full rounded-md border p-2"
          />
          <label className="mb-1 block text-sm font-medium">Mật khẩu mới</label>
          <input
            type="password"
            required
            minLength="6"
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
            className="mb-5 w-full rounded-md border p-2"
          />
          <button disabled={isChangingPassword} className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            {isChangingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      )}

      {(message || errorMessage) && (
        <p className={`text-sm ${errorMessage ? "text-red-700" : "text-green-700"}`}>
          {errorMessage || message}
        </p>
      )}
    </div>
  );
};

export default ProfileSettings;

ProfileSettings.propTypes = {
  showProfile: PropTypes.bool,
  showPassword: PropTypes.bool,
};
