import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { HiOutlineBookOpen } from "react-icons/hi2";
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaPaypal,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black px-6 py-16 text-sm text-stone-400 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid gap-12 border-b border-stone-800 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="flex size-8 items-center justify-center bg-amber-400 text-stone-950">
                <HiOutlineBookOpen className="size-5" />
              </span>
              Tiệm mọt sách
            </Link>
            <p className="mt-5 max-w-64 leading-6">
              Điểm đến yêu thích cho sách, cộng đồng đọc và những khám phá văn học.
            </p>
          </div>

          <FooterColumn title="Liên kết nhanh">
            <Link to="/">Trang chủ</Link>
            <Link to="/books">Tất cả sách</Link>
            <a href="/#categories">Thể loại</a>
            <Link to="/cart">Giỏ hàng</Link>
          </FooterColumn>

          <FooterColumn title="Khám phá">
            <a href="/#new-arrivals">Sách mới</a>
            <a href="/#best-sellers">Sách bán chạy</a>
            <a href="/#editors-picks">Đề xuất của tiệm</a>
            <Link to="/books">Xem danh mục</Link>
          </FooterColumn>

          <FooterColumn title="Hỗ trợ">
            <Link to="/orders">Theo dõi đơn hàng</Link>
            <Link to="/user-dashboard/profile">Tài khoản</Link>
            <Link to="/cart">Giỏ hàng</Link>
            <Link to="/login">Đăng nhập</Link>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-7 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tiệm mọt sách</p>
          <div className="flex items-center gap-3 text-xl text-white" aria-label="Accepted payment methods">
            <FaCcMastercard aria-label="Mastercard" />
            <FaCcVisa aria-label="Visa" />
            <FaCcAmex aria-label="American Express" />
            <FaPaypal aria-label="PayPal" />
          </div>
          <div className="flex items-center gap-5 text-base text-stone-400">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-white">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transition hover:text-white">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children }) => (
  <div>
    <h2 className="mb-5 font-semibold text-white">{title}</h2>
    <div className="flex flex-col gap-3">
      {children}
    </div>
  </div>
);

FooterColumn.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Footer;
