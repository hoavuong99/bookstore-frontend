import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdBook, MdCategory, MdPeople, MdReceiptLong } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const isDashboardActive = location.pathname === "/dashboard";
  const isBooksActive = location.pathname === "/dashboard/manage-books";
  const isCategoriesActive = location.pathname === "/dashboard/categories";
  const isOrdersActive = location.pathname === "/dashboard/orders";
  const isUsersActive = location.pathname === "/dashboard/users";
  const isProfileActive = location.pathname === "/dashboard/profile";
  const pageTitle =
    location.pathname === "/dashboard/manage-books"
      ? "Sách"
      : location.pathname === "/dashboard/categories"
        ? "Thể loại"
        : location.pathname === "/dashboard/orders"
          ? "Đơn hàng"
          : location.pathname === "/dashboard/users"
            ? "Người dùng"
          : location.pathname === "/dashboard/profile"
            ? "Hồ sơ"
          : location.pathname === "/dashboard/change-password"
            ? "Đổi mật khẩu"
        : "Tổng quan";
  const userName =
    currentUser?.fullName || currentUser?.displayName || currentUser?.email;
  const userInitials = userName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">
      <aside className="hidden sm:flex sm:w-64 sm:flex-col">
        <a
          href="/"
          className="inline-flex h-20 items-center justify-center bg-purple-600 px-6 hover:bg-purple-500 focus:bg-purple-500"
        >
          <img src="/fav-icon.png" alt="" />
        </a>
        <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800">
          <nav className="mx-4 my-6 flex flex-col space-y-3">
            <Link
              to="/dashboard"
              className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${
                isDashboardActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400 focus:bg-gray-700 focus:text-gray-400"
              }`}
            >
              <span className="sr-only">Tổng quan</span>
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>Tổng quan</span>
            </Link>
            <Link
              to="/dashboard/manage-books"
              className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${
                isBooksActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400 focus:bg-gray-700 focus:text-gray-400"
              }`}
            >
              <span className="sr-only">Sách</span>
              <MdBook className="h-6 w-6" />
              <span>Sách</span>
            </Link>
            <Link
              to="/dashboard/categories"
              className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${
                isCategoriesActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400 focus:bg-gray-700 focus:text-gray-400"
              }`}
            >
              <span className="sr-only">Quản lý thể loại</span>
              <MdCategory className="h-6 w-6" />
              <span>Thể loại</span>
            </Link>
            <Link
              to="/dashboard/orders"
              className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${
                isOrdersActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400 focus:bg-gray-700 focus:text-gray-400"
              }`}
            >
              <span className="sr-only">Orders</span>
              <MdReceiptLong className="h-6 w-6" />
              <span>Đơn hàng</span>
            </Link>
            <Link
              to="/dashboard/users"
              className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${
                isUsersActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400 focus:bg-gray-700 focus:text-gray-400"
              }`}
            >
              <span className="sr-only">Người dùng</span>
              <MdPeople className="h-6 w-6" />
              <span>Người dùng</span>
            </Link>
          </nav>
          <div className="inline-flex h-20 items-center border-t border-gray-700 px-4">
            <button className="inline-flex items-center gap-3 rounded-lg p-3 hover:bg-gray-700 hover:text-gray-400 focus:bg-gray-700 focus:text-gray-400">
              <span className="sr-only">Cài đặt</span>
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-grow text-gray-800">
        <header className="relative flex items-center h-20 px-6 sm:px-10 bg-white">
          <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full">
            <span className="sr-only">Menu</span>
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <div className="flex flex-shrink-0 items-center ml-auto">
            <details className="relative">
              <summary className="inline-flex cursor-pointer list-none items-center rounded-lg p-2 hover:bg-gray-100 focus:bg-gray-100">
              <span className="sr-only">Menu người dùng</span>
              <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
                <span className="font-semibold">{userName}</span>
                <span className="text-sm text-gray-600">{currentUser?.email}</span>
              </div>
              <span className="flex h-12 w-12 ml-2 sm:ml-3 mr-2 items-center justify-center bg-purple-100 text-sm font-semibold text-purple-700 rounded-full">
                {userInitials}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="hidden sm:block h-6 w-6 text-gray-300"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              </summary>
              <div className="absolute right-0 top-16 z-30 w-48 rounded-md border bg-white p-2 shadow-lg">
                <Link
                  to="/dashboard/profile"
                  className={`block rounded px-3 py-2 text-sm ${
                    isProfileActive ? "bg-purple-50 text-purple-700" : "hover:bg-gray-100"
                  }`}
                >
                  Cập nhật hồ sơ
                </Link>
                <Link
                  to="/dashboard/change-password"
                  className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Đổi mật khẩu
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </div>
            </details>
          </div>
        </header>
        <main className="p-6 sm:p-10 space-y-6 ">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h1 className="text-4xl font-semibold mb-2">{pageTitle}</h1>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
