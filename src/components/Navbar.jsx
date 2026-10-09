import { Link } from "react-router-dom";
import {
  HiOutlineBookOpen,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";

import avatarImg from "../assets/avatar.png";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGetCartQuery } from "../redux/features/books/booksApi";

const navigation = [
  { name: "Hồ sơ", href: "/user-dashboard/profile" },
  { name: "Đổi mật khẩu", href: "/user-dashboard/change-password" },
  { name: "Đơn hàng", href: "/orders" },
  { name: "Giỏ hàng", href: "/cart" },
  { name: "Thanh toán", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { data: cart } = useGetCartQuery(undefined, { skip: !currentUser });
  const cartItemCount = cart?.totalItems || 0;

  const handleLogOut = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-purple-100 bg-white/95 px-4 py-4 backdrop-blur">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-stone-900">
            <span className="flex size-9 items-center justify-center rounded-sm bg-amber-400 text-stone-900">
              <HiOutlineBookOpen className="size-5" />
            </span>
            <span>TIỆM MỌT SÁCH</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide text-stone-800 lg:flex">
            <Link to="/books" className="hover:text-amber-600">Tất cả sách</Link>
            <a href="/#new-arrivals" className="hover:text-amber-600">Sách mới</a>
            <a href="/#best-sellers" className="hover:text-amber-600">Bán chạy</a>
            <a href="/#editors-picks" className="hover:text-amber-600">Đề xuất của tiệm</a>
            <a href="/#categories" className="hover:text-amber-600">Thể loại</a>
          </div>
        </div>

        <div className="relative flex items-center space-x-2 md:space-x-3">
          <div>
            {currentUser ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarImg}
                    alt=""
                    className={`size-7 rounded-full ${
                      currentUser ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                </button>
                {/* show dropdowns */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                {" "}
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>

          <Link
            to="/cart"
            className="flex items-center rounded-sm bg-stone-900 p-2 text-white shadow-sm transition hover:bg-stone-700 sm:px-4"
          >
            <HiOutlineShoppingCart className="" />
            {cartItemCount > 0 ? (
              <span className="text-sm font-semibold sm:ml-1">
                {cartItemCount}
              </span>
            ) : (
              <span className="text-sm font-semibold sm:ml-1">0</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
