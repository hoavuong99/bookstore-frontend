/* eslint-disable react/prop-types */
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAddToCartMutation } from "../../redux/features/books/booksApi";
import Swal from "sweetalert2";

const BookCard = ({ book }) => {
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
        title: "Product added to the cart",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to add product",
        text: error?.data?.message || "Please try again.",
      });
    }
  };
  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
        <div className="h-72 w-48 flex-shrink-0 overflow-hidden border rounded-md bg-gray-50">
          <Link to={`/books/${book._id}`}>
            <img
              src={`${getImgUrl(book?.coverImage)}`}
              alt=""
              className="h-full w-full rounded-md object-contain p-2 cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        <div className="flex flex-col items-start sm:items-start">
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book?.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-5">
            {book?.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book?.description}
          </p>
          <p className="font-medium sm:mb-5 lg:mb-5 md:mb-0">
            ${book?.newPrice}{" "}
            <span className="line-through font-normal ml-2">
              $ {book?.oldPrice}
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Stock:</strong>{" "}
            <span className={book?.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
              {book?.stockQuantity ?? 0}
            </span>
          </p>
          <div className="w-full flex justify-center sm:justify-start mt-4">
            <button
              onClick={() => handleAddToCart(book)}
              disabled={isLoading || book?.stockQuantity <= 0}
              className="btn-primary flex items-center gap-1 px-6 space-x-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>{book?.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
