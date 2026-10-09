import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { FaBoxOpen } from "react-icons/fa";
import { HiChevronRight, HiLockClosed } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useGetCartQuery } from "../../redux/features/books/booksApi";
import booksApi from "../../redux/features/books/booksApi";
import { useDispatch } from "react-redux";
import { useCreateOrderMutation, useCreateZaloPayPaymentMutation } from "../../redux/features/orders/ordersApi";
import { useGetMyProfileQuery } from "../../redux/features/users/usersApi";
import { getImgUrl } from "../../utils/getImgUrl";
import { formatVND } from "../../utils/currency";

const paymentOptions = [
  { id: "ZALOPAY", label: "ZaloPay", icon: FaBoxOpen, disabled: false },
  { id: "COD", label: "Thanh toán khi nhận hàng", icon: FaBoxOpen, disabled: false },
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20";

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { data: cart, isLoading: isLoadingCart, isError: isCartError } = useGetCartQuery();
  const { data: profile } = useGetMyProfileQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createZaloPayPayment] = useCreateZaloPayPaymentMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const cartItems = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);
  const totalItems = cart?.totalItems || 0;

  useEffect(() => {
    reset({
      receiverName:
        profile?.fullName ||
        currentUser?.fullName ||
        currentUser?.displayName ||
        "",
      receiverPhone: profile?.phone || currentUser?.phone || "",
      address: profile?.address || currentUser?.address || "",
    });
  }, [currentUser, profile, reset]);

  const onSubmit = async (data) => {
    if (!acceptedTerms) return;

    try {
      const checkout = await createOrder({
        shippingAddress: [data.address, data.city, data.state, data.postalCode]
          .filter(Boolean)
          .join(", "),
        recipientName: data.receiverName,
        recipientPhone: data.receiverPhone,
        paymentMethod,
      }).unwrap();
      dispatch(booksApi.util.invalidateTags(["Cart", "Books"]));
      if (paymentMethod === "ZALOPAY") {
        const payment = await createZaloPayPayment(checkout.orderId).unwrap();
        if (!payment.paymentUrl) {
          throw new Error(payment.error || "ZaloPay did not return a payment URL.");
        }
        window.location.assign(payment.paymentUrl);
        return;
      }
      await Swal.fire({
        title: "Đặt hàng thành công",
        text: "Đơn hàng của bạn đã được tạo thành công.",
        icon: "success",
        confirmButtonColor: "#f0a85d",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order", error);
      Swal.fire({
        title: "Không thể đặt hàng",
        text: error?.data?.message || "Vui lòng kiểm tra thông tin và thử lại.",
        icon: "error",
        confirmButtonColor: "#f0a85d",
      });
    }
  };

  if (isLoadingCart) {
    return <div className="flex min-h-[50vh] items-center justify-center text-stone-500">Đang tải thông tin thanh toán...</div>;
  }

  if (isCartError) {
    return <div className="p-8 text-center text-red-600">Không thể tải giỏ hàng.</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-xl font-extrabold tracking-tight text-stone-950">
              <span className="mr-2 inline-block size-4 rounded-sm bg-amber-400" />
              Tiệm mọt sách
            </Link>
            <div className="hidden items-center gap-4 text-xs font-bold uppercase tracking-wider md:flex">
              <span className="flex items-center gap-2 text-stone-900">✓ Giỏ hàng</span>
              <HiChevronRight className="text-stone-300" />
              <span className="flex items-center gap-2 text-stone-900">
                <span className="text-amber-500">●</span> Thanh toán
              </span>
              <HiChevronRight className="text-stone-300" />
              <span className="text-stone-300">Xác nhận</span>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <HiLockClosed /> Bảo mật SSL 256-bit
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Hoàn tất đơn hàng
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Kiểm tra sách đã chọn và hoàn tất thanh toán an toàn.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Giỏ hàng đang trống</h2>
            <p className="mt-2 text-sm text-stone-500">Hãy thêm sách trước khi thanh toán.</p>
            <Link to="/books" className="mt-6 inline-block bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950">
              Xem sách
            </Link>
          </div>
        ) : (
          <div className="grid min-w-0 items-start gap-8 lg:grid-cols-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:col-span-7">
              <section className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-7">
                <SectionHeading number="1" title="Thông tin giao hàng" />
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Tên người nhận" id="receiverName" register={register} required placeholder="Họ và tên" />
                    <Field label="Số điện thoại" id="receiverPhone" register={register} required placeholder="Số điện thoại" type="tel" />
                  </div>
                  <Field label="Địa chỉ" id="address" register={register} required placeholder="Địa chỉ giao hàng" />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Thành phố" id="city" register={register} placeholder="Thành phố" />
                    <Field label="Tỉnh / Thành" id="state" register={register} placeholder="Tỉnh" />
                    <Field label="Mã bưu chính" id="postalCode" register={register} placeholder="Mã bưu chính" />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-7">
                <SectionHeading number="2" title="Phương thức thanh toán" />
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {paymentOptions.map(({ id, label, icon: Icon, disabled }) => (
                    <button
                      key={id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPaymentMethod(id)}
                      className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-center transition ${
                        paymentMethod === id
                          ? "border-amber-400 bg-amber-50/60"
                          : "border-stone-200"
                      } ${disabled ? "cursor-not-allowed opacity-45" : "hover:border-stone-300"}`}
                    >
                      <Icon className="text-lg text-stone-700" />
                      <span className="text-xs font-bold text-stone-800">{label}</span>
                      {disabled && <span className="text-[9px] uppercase tracking-wide text-stone-400">Sắp có</span>}
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-amber-50 p-5 text-center">
                  <FaBoxOpen className="mx-auto text-2xl text-amber-600" />
                  <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">Thanh toán khi nhận hàng</h3>
                  <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-stone-500">
                    {paymentMethod === "ZALOPAY"
                      ? "Bạn sẽ được chuyển đến ZaloPay để hoàn tất thanh toán an toàn."
                      : "Thanh toán khi nhận được đơn hàng."}
                  </p>
                </div>
                <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs text-stone-500">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-amber-500 focus:ring-amber-400"
                  />
                  <span>
                    Tôi đồng ý với <Link to="/about" className="underline underline-offset-2">Điều khoản</Link> và Chính sách mua hàng.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!acceptedTerms || isCreatingOrder}
                  className="mt-6 w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isCreatingOrder ? "Đang xử lý an toàn..." : paymentMethod === "ZALOPAY"
                    ? `Tiếp tục đến ZaloPay · ${formatVND(subtotal)}`
                    : `Đặt hàng · ${formatVND(subtotal)}`}
                </button>
              </section>
            </form>

            <aside className="lg:col-span-5">
              <div className="sticky top-28 rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-xl font-bold text-stone-900">Tóm tắt đơn hàng</h2>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-stone-800">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                </div>
                <div className="my-4 max-h-80 divide-y divide-stone-100 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.itemId} className="flex items-center gap-3.5 py-3.5">
                      <img src={getImgUrl(item.imageUrl)} alt={item.bookTitle} className="h-16 w-12 rounded object-cover shadow-sm" />
                      <div className="min-w-0 flex-grow">
                        <h3 className="truncate text-sm font-bold text-stone-900">{item.bookTitle}</h3>
                        <p className="mt-1 text-[11px] text-stone-500">SL: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-stone-900">
                        {formatVND(Number(item.unitPrice) * Number(item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-stone-100 pt-4 text-sm">
                  <div className="flex justify-between text-stone-500"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
                  <div className="flex justify-between text-stone-500"><span>Vận chuyển</span><span className="font-medium text-emerald-600">Miễn phí</span></div>
                  <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-bold text-stone-900"><span>Tổng cộng</span><span>{formatVND(subtotal)}</span></div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionHeading = ({ number, title }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="flex size-7 items-center justify-center rounded-full border border-amber-400 bg-amber-50 text-xs font-bold text-stone-900">{number}</span>
    <h2 className="font-serif text-xl font-bold text-stone-900">{title}</h2>
  </div>
);

SectionHeading.propTypes = {
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Field = ({ label, id, register, required = false, placeholder, type = "text" }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
    {label}
    <input
      {...register(id, { required })}
      id={id}
      type={type}
      placeholder={placeholder}
      className={inputClass}
    />
  </label>
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default CheckoutPage;
