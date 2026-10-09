/* eslint-disable react/prop-types */
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAddToCartMutation } from "../../redux/features/books/booksApi";
import Swal from "sweetalert2";
import { formatVND } from "../../utils/currency";

const BookCard = ({ book, compact = false, catalog = false }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ bookId: product.id || product._id, quantity: 1 }).unwrap();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Đã thêm sách vào giỏ hàng",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Không thể thêm sách",
        text: error?.data?.message || "Vui lòng thử lại.",
      });
    }
  };
  return (
    <div className={`transition-shadow duration-300 ${compact || catalog ? "h-full" : "rounded-lg"}`}>
      <div className={`flex gap-4 ${compact || catalog ? "h-full flex-col" : "flex-col sm:h-72 sm:flex-row sm:items-center sm:justify-center"}`}>
        <div className={`${compact ? "h-40 w-full" : catalog ? "h-80 w-full" : "h-72 w-48"} flex-shrink-0 overflow-hidden ${catalog ? "" : "rounded-md border bg-gray-50"}`}>
          <Link to={`/books/${book._id}`}>
            <img
              src={`${getImgUrl(book?.coverImage)}`}
              alt=""
              className={`h-full w-full cursor-pointer object-contain transition-all duration-200 hover:scale-105 ${catalog ? "bg-stone-100 p-0" : "rounded-md p-2"}`}
            />
          </Link>
        </div>

        <div className="flex flex-col items-start sm:items-start">
          <Link to={`/books/${book._id}`}>
            <h3 className={`${compact || catalog ? "line-clamp-2 text-sm" : "text-xl"} mb-3 font-semibold text-stone-900 hover:text-amber-600`}>
              {book?.title}
            </h3>
          </Link>
          <p className={`${compact || catalog ? "hidden" : "mb-5"} text-gray-600`}>
            {book?.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book?.description}
          </p>
          <p className={`${compact || catalog ? "text-sm" : "sm:mb-5 lg:mb-5 md:mb-0"} font-medium`}>
            {formatVND(book?.newPrice)}{" "}
            <span className="line-through font-normal ml-2">
              {formatVND(book?.oldPrice)}
            </span>
          </p>
          <p className={`${compact || catalog ? "hidden" : "mt-2"} text-sm text-gray-600`}>
            <strong>Tồn kho:</strong>{" "}
            <span className={book?.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
              {book?.stockQuantity ?? 0}
            </span>
          </p>
          <div className={`${compact || catalog ? "hidden" : "mt-4"} flex w-full justify-center sm:justify-start`}>
            <button
              onClick={() => handleAddToCart(book)}
              disabled={isLoading || book?.stockQuantity <= 0}
              className="btn-primary flex items-center gap-1 px-6 space-x-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>{book?.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
