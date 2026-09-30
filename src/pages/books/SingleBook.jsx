import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";

import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (isLoading)
    return <div className="text-center text-lg">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Failed to load book information
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 relative">
      {/* Heading */}
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        {book.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Book Image */}
        <div className="flex-shrink-0 group">
          <img
            src={`${getImgUrl(book.coverImage)}`}
            alt={book.title}
            className="w-full md:w-72 h-auto rounded-lg object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Book Details */}
        <div className="flex-grow">
          <p className="text-gray-700 mb-2">
            <strong>Author:</strong> {book.author || "Admin"}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Published:</strong>{" "}
            {new Date(book?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-2 capitalize">
            <strong>Category:</strong> {book?.category}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Description:</strong> {book.description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-6 md:justify-end">
        <button
          onClick={() => handleAddToCart(book)}
          className="btn-primary px-6 py-3 hover:text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2 shadow-lg transition duration-200"
        >
          <FiShoppingCart className="text-lg" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default SingleBook;
