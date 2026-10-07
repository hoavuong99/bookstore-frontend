import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLazyRefreshZaloPayPaymentQuery } from "../../redux/features/orders/ordersApi";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("apptransid")?.split("_").pop();
  const [message, setMessage] = useState("Đang chờ ZaloPay xác nhận thanh toán...");
  const [status, setStatus] = useState("pending");
  const [refreshPayment] = useLazyRefreshZaloPayPaymentQuery();

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setMessage("Không thể xác định đơn hàng thanh toán.");
      return undefined;
    }

    let attempts = 0;
    let timer;
    let active = true;

    const checkPayment = async () => {
      try {
        const payment = await refreshPayment(orderId).unwrap();
        if (!active) return;
        if (payment.paymentStatus === "PAID") {
          setStatus("success");
          setMessage("Thanh toán đã được xác nhận và đơn hàng đang được chuẩn bị.");
          return;
        }
        if (payment.paymentStatus === "FAILED" || payment.state === "FAILED") {
          setStatus("error");
          setMessage(payment.error || "Thanh toán chưa hoàn tất.");
          return;
        }
        attempts += 1;
        if (attempts >= 30) {
          setStatus("pending");
          setMessage("Thanh toán vẫn đang được xác minh. Vui lòng kiểm tra đơn hàng sau ít phút.");
          return;
        }
        timer = window.setTimeout(checkPayment, 2000);
      } catch {
        if (!active) return;
        attempts += 1;
        if (attempts < 30) timer = window.setTimeout(checkPayment, 2000);
        else {
          setStatus("error");
          setMessage("Chưa thể xác minh thanh toán. Vui lòng kiểm tra đơn hàng trước khi thử lại.");
        }
      }
    };

    checkPayment();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [orderId, refreshPayment]);

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-stone-50 px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto flex size-16 items-center justify-center rounded-full text-3xl ${
          status === "success" ? "bg-emerald-100 text-emerald-700" :
            status === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
        }`}>
          {status === "success" ? "✓" : status === "error" ? "!" : "…"}
        </div>
        <h1 className="mt-5 font-serif text-3xl font-bold text-stone-900">
          {status === "success" ? "Thanh toán thành công" : status === "error" ? "Thanh toán cần được kiểm tra" : "Đang xác nhận thanh toán"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">{message}</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/orders" className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white">
            Xem đơn hàng
          </Link>
          {status === "error" && (
            <Link to="/books" className="rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">
              Tiếp tục mua sắm
            </Link>
          )}
        </div>
      </section>
    </main>
  );
};

export default PaymentResultPage;
