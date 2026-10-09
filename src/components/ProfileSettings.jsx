import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
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
    if (profileForm.phone && !/^\d{8,20}$/.test(profileForm.phone)) {
      setErrorMessage("Số điện thoại phải gồm 8-20 chữ số.");
      return;
    }
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
    if (!passwordForm.currentPassword.trim()) {
      setErrorMessage("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,128}$/.test(passwordForm.newPassword)) {
      setErrorMessage("Mật khẩu mới phải có ít nhất 8 ký tự, gồm cả chữ và số.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Đổi mật khẩu thành công.");
    } catch (error) {
      setErrorMessage(error?.data?.message || "Không thể đổi mật khẩu.");
    }
  };

  return (
    <div className={`grid gap-6 ${showProfile && showPassword ? "md:grid-cols-2" : "max-w-xl"}`}>
      {showProfile && (
        <form onSubmit={handleProfileSubmit} noValidate className="rounded-lg bg-white p-6 shadow">
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
          <p className="-mt-3 mb-4 text-xs text-gray-500">Số điện thoại chỉ gồm 8-20 chữ số.</p>
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
        <form onSubmit={handlePasswordSubmit} noValidate className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold">Đổi mật khẩu</h2>
          <label className="mb-1 block text-sm font-medium">Mật khẩu hiện tại</label>
          <div className="relative mb-4">
            <input
              type={visiblePasswords.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
              className="w-full rounded-md border p-2 pr-10"
            />
            <button type="button" onClick={() => setVisiblePasswords({ ...visiblePasswords, current: !visiblePasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label={visiblePasswords.current ? "Ẩn mật khẩu hiện tại" : "Hiện mật khẩu hiện tại"}>
              {visiblePasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <label className="mb-1 block text-sm font-medium">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={visiblePasswords.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
              className="w-full rounded-md border p-2 pr-10"
            />
            <button type="button" onClick={() => setVisiblePasswords({ ...visiblePasswords, new: !visiblePasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label={visiblePasswords.new ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}>
              {visiblePasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="mt-1 mb-5 text-xs text-gray-500">Mật khẩu mới phải có ít nhất 8 ký tự, gồm cả chữ và số.</p>
          <label className="mb-1 block text-sm font-medium">Xác nhận mật khẩu mới</label>
          <div className="relative mb-5">
            <input
              type={visiblePasswords.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
              className="w-full rounded-md border p-2 pr-10"
            />
            <button type="button" onClick={() => setVisiblePasswords({ ...visiblePasswords, confirm: !visiblePasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label={visiblePasswords.confirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}>
              {visiblePasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
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
