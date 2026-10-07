import { Link } from "react-router-dom";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi2";
import { getImgUrl } from "../../utils/getImgUrl";
import confirmAction from "../../utils/confirmAction";
import {
  useGetCartQuery,
  useClearCartMutation,
  useRemoveFromCartMutation,
} from "../../redux/features/books/booksApi";
import { formatVND } from "../../utils/currency";

const CartPage = () => {
  const { data: cart, isLoading, isError, error } = useGetCartQuery();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const cartItems = cart?.items || [];
  const totalPrice = Number(cart?.subtotal || 0);

  const handleRemoveFromCart = async (itemId) => {
    if (!(await confirmAction("Xóa sản phẩm?", "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?"))) return;
    await removeFromCart(itemId).unwrap();
  };

  const handleClearCart = async () => {
    if (!(await confirmAction("Xóa giỏ hàng?", "Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng không?"))) return;
    try {
      await clearCart().unwrap();
    } catch (error) {
      console.error("Unable to clear cart", error);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Đang tải giỏ hàng...</div>;
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        {error?.data?.message || "Không thể tải giỏ hàng."}
      </div>
    );
  }

  const isUpdating = isRemoving || isClearing;

  return (
    <main className="min-h-screen bg-[#fcfbf9] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-stone-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Book Works</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">Giỏ hàng của bạn</h1>
            <p className="mt-2 text-sm text-stone-500">Kiểm tra sách đã chọn trước khi hoàn tất đơn hàng.</p>
          </div>
          <Link to="/books" className="text-sm font-bold text-stone-700 underline decoration-amber-400 decoration-2 underline-offset-4">
            Tiếp tục mua sắm
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Giỏ hàng đang trống</h2>
            <p className="mt-2 text-sm text-stone-500">Hãy khám phá bộ sưu tập và chọn cuốn sách tiếp theo của bạn.</p>
            <Link to="/books" className="mt-7 inline-flex bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950 hover:bg-amber-500">
              Xem tất cả sách
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="border border-stone-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 sm:px-7">
                <h2 className="font-serif text-xl font-bold text-stone-900">Sản phẩm đã chọn</h2>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">{cart?.totalItems || 0} sản phẩm</span>
              </div>
              <ul role="list" className="divide-y divide-stone-100 px-5 sm:px-7">
                {cartItems.map((product) => (
                  <li key={product.itemId} className="grid gap-4 py-6 sm:grid-cols-[96px_minmax(0,1fr)_auto_auto_auto] sm:items-center">
                    <Link to={`/books/${product.bookId}`} className="h-28 w-24 overflow-hidden border border-stone-200 bg-stone-50">
                      <img alt={product.bookTitle} src={getImgUrl(product.imageUrl)} className="h-full w-full object-contain p-2" />
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/books/${product.bookId}`} className="font-serif text-lg font-bold text-stone-900 hover:text-amber-600">
                        {product.bookTitle}
                      </Link>
                      <p className="mt-1 text-sm text-stone-500">{formatVND(product.unitPrice)} / sản phẩm</p>
                      <button onClick={() => handleRemoveFromCart(product.itemId)} disabled={isUpdating} type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-rose-600 disabled:opacity-50">
                        <HiTrash /> Xóa
                      </button>
                    </div>
                    <div className="flex w-fit items-center border border-stone-300">
                      <button type="button" disabled className="p-2 text-stone-300" aria-label="Giảm số lượng"><HiMinus /></button>
                      <span className="min-w-9 text-center text-sm font-bold">{product.quantity}</span>
                      <button type="button" disabled className="p-2 text-stone-300" aria-label="Tăng số lượng"><HiPlus /></button>
                    </div>
                    <strong className="text-sm text-stone-900">{formatVND(Number(product.unitPrice) * Number(product.quantity))}</strong>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end border-t border-stone-100 px-5 py-4 sm:px-7">
                <button type="button" onClick={handleClearCart} disabled={isUpdating} className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 disabled:opacity-50">
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </section>

            <aside className="sticky top-28 border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="font-serif text-xl font-bold text-stone-900">Tóm tắt đơn hàng</h2>
              <div className="mt-6 space-y-4 border-t border-stone-100 pt-5 text-sm">
                <div className="flex justify-between text-stone-500"><span>Tạm tính</span><span>{formatVND(totalPrice)}</span></div>
                <div className="flex justify-between text-stone-500"><span>Vận chuyển</span><span className="font-semibold text-emerald-600">Miễn phí</span></div>
                <div className="flex justify-between border-t border-stone-100 pt-4 text-lg font-bold text-stone-900"><span>Tổng cộng</span><span>{formatVND(totalPrice)}</span></div>
              </div>
              <Link to="/checkout" className="mt-7 flex w-full items-center justify-center bg-amber-400 px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-amber-500">
                Tiến hành thanh toán
              </Link>
              <p className="mt-4 text-center text-xs leading-5 text-stone-500">Phí vận chuyển và thông tin giao hàng sẽ được xác nhận ở bước tiếp theo.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
