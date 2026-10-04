import { useState } from "react";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../../redux/features/books/booksApi";

const CartPage = () => {
  const { data: cart, isLoading, isError, error } = useGetCartQuery();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [isClearing, setIsClearing] = useState(false);
  const cartItems = cart?.items || [];
  const totalPrice = Number(cart?.subtotal || 0).toFixed(2);

  const handleRemoveFromCart = async (itemId) => {
    await removeFromCart(itemId).unwrap();
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await Promise.all(
        cartItems.map((item) => removeFromCart(item.itemId).unwrap())
      );
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading cart...</div>;
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        {error?.data?.message || "Unable to load your cart."}
      </div>
    );
  }

  const isUpdating = isRemoving || isClearing;

  return (
    <div className="mt-12 flex h-full flex-col overflow-hidden bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="text-lg font-medium text-gray-900">Shopping cart</div>
          <button
            type="button"
            onClick={handleClearCart}
            disabled={isUpdating || cartItems.length === 0}
            className="relative -m-2 rounded-md bg-red-500 px-2 py-1 text-white transition-all duration-200 hover:bg-red-600 disabled:bg-red-300"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-8">
          {cartItems.length > 0 ? (
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartItems.map((product) => (
                <li key={product.itemId} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      alt={product.bookTitle}
                      src={getImgUrl(product.imageUrl)}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link to={`/books/${product.bookId}`}>
                          {product.bookTitle}
                        </Link>
                      </h3>
                      <p className="sm:ml-4">${product.unitPrice}</p>
                    </div>
                    <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                      <p className="text-gray-500">
                        <strong>Qty:</strong> {product.quantity}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(product.itemId)}
                        disabled={isUpdating}
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-indigo-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No product found!</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${totalPrice}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </Link>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Continue Shopping <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
