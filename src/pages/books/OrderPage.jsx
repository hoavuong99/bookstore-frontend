import { useMemo, useState } from "react";
import { MdCheck, MdSearch, MdShoppingBag } from "react-icons/md";
import {
  useGetOrderByEmailQuery,
  useCancelOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { formatVND } from "../../utils/currency";
import fallbackBookCover from "../../assets/books/book-1.png";
import { getImgUrl } from "../../utils/getImgUrl";
import confirmAction from "../../utils/confirmAction";

const statusTabs = [
  { key: "ALL", label: "Tất cả đơn hàng" },
  { key: "PENDING", label: "Đang xử lý" },
  { key: "SHIPPING", label: "Đang giao" },
  { key: "DELIVERED", label: "Đã giao" },
  { key: "CANCELLED", label: "Đã hủy" },
];

const statusLabels = {
  PENDING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-sky-100 text-sky-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const trackerSteps = [
  { key: "PENDING", label: "Đã đặt hàng" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "SHIPPING", label: "Đang giao hàng" },
  { key: "DELIVERED", label: "Đã nhận hàng" },
];

const getStatusIndex = (status) => trackerSteps.findIndex((step) => step.key === status);

const OrderPage = () => {
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orderPage = {}, isLoading, isError, refetch } =
    useGetOrderByEmailQuery({ page, size: 10 });
  const [cancelOrder, { isLoading: isCancellingOrder }] = useCancelOrderMutation();
  const orders = orderPage.content || [];

  const visibleOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTab = activeTab === "ALL" || order.orderStatus === activeTab;
      const matchesSearch =
        !query ||
        String(order.orderId).toLowerCase().includes(query) ||
        order.recipientName?.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, orders, searchTerm]);

  const handleCancelOrder = async (orderId) => {
    const confirmed = await confirmAction(
      "Hủy đơn hàng?",
      "Bạn có chắc muốn hủy đơn hàng này không?"
    );
    if (!confirmed) return;
    await cancelOrder(orderId).unwrap();
    await refetch();
  };

  if (isLoading) {
    return <div className="bg-[#fcfbf9] py-20 text-center text-gray-600">Đang tải đơn hàng...</div>;
  }

  if (isError) {
    return <div className="bg-[#fcfbf9] py-20 text-center text-red-600">Không thể tải dữ liệu đơn hàng.</div>;
  }

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#1b1c1e]">
      <section className="border-b border-[#edebe8] bg-[#fbf5ea] py-10">
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#72757d]">
                Tài khoản của tôi
              </p>
              <h1 className="font-serif text-4xl font-bold leading-tight text-[#141416]">
                Đơn hàng của tôi
              </h1>
            </div>
            <label className="relative block w-full sm:w-[300px]">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo mã đơn hàng..."
                className="h-11 w-full border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#f0a85d]"
              />
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); setPage(0); }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-[#111] text-white"
                    : "text-[#72757d] hover:bg-black/5 hover:text-[#111]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-6 py-10">
        {visibleOrders.length === 0 ? (
          <div className="border border-[#edebe8] bg-white px-6 py-20 text-center shadow-sm">
            <MdShoppingBag className="mx-auto mb-4 text-5xl text-[#f0a85d]" />
            <h2 className="font-serif text-2xl font-bold">Chưa tìm thấy đơn hàng</h2>
            <p className="mt-2 text-sm text-[#72757d]">Các đơn hàng của bạn sẽ được hiển thị tại đây.</p>
          </div>
        ) : (
          visibleOrders.map((order) => {
            const currentIndex = getStatusIndex(order.orderStatus);
            const isCancelled = order.orderStatus === "CANCELLED";
            return (
              <article key={order.orderId} className="mb-10 overflow-hidden border border-[#edebe8] bg-white shadow-sm">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edebe8] bg-[#fdfbf8] px-6 py-5">
                  <div className="flex flex-wrap gap-7">
                    <div>
                      <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-[#72757d]">Mã đơn hàng</span>
                      <strong className="text-sm text-gray-800">#{order.orderId}</strong>
                    </div>
                    <div>
                      <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-[#72757d]">Ngày đặt</span>
                      <strong className="text-sm text-gray-800">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-[#72757d]">Phương thức thanh toán</span>
                      <strong className="text-sm text-gray-800">
                        {order.paymentMethod === "ZALOPAY" ? "ZaloPay" : "Thanh toán khi nhận hàng (COD)"}
                      </strong>
                    </div>
                  </div>
                  <span className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${statusStyles[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                    {statusLabels[order.orderStatus] || order.orderStatus}
                  </span>
                </header>

                {!isCancelled && (
                  <div className="grid grid-cols-2 gap-y-6 border-b border-[#edebe8] bg-[#faf9f6] px-6 py-6 sm:grid-cols-4">
                    {trackerSteps.map((step, index) => {
                      const completed = currentIndex >= index;
                      return (
                        <div key={step.key} className="relative flex flex-col items-center text-center">
                          {index < trackerSteps.length - 1 && (
                            <span className={`absolute left-1/2 top-3 hidden h-0.5 w-full sm:block ${completed && currentIndex > index ? "bg-[#f0a85d]" : "bg-gray-200"}`} />
                          )}
                          <span className={`relative z-10 mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs ${completed ? "bg-[#f0a85d] text-[#111]" : "bg-gray-200 text-gray-400"}`}>
                            {completed ? <MdCheck /> : index + 1}
                          </span>
                          <strong className="text-xs text-gray-700">{step.label}</strong>
                        </div>
                      );
                    })}
                  </div>
                )}

                {order.items?.length > 0 && (
                  <div className="border-b border-[#edebe8] px-6 py-5">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#72757d]">
                      Sản phẩm trong đơn hàng
                    </h3>
                    <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.bookId} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex min-w-0 items-center gap-4">
                          <img
                            src={item.imageUrl ? getImgUrl(item.imageUrl) : fallbackBookCover}
                            alt={item.bookTitle}
                            className="h-24 w-16 shrink-0 rounded-sm object-cover shadow-sm"
                            onError={(event) => {
                              event.currentTarget.src = fallbackBookCover;
                            }}
                          />
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-gray-900">{item.bookTitle}</h3>
                            <p className="mt-1 text-sm text-[#72757d]">
                              Số lượng: <strong className="text-gray-900">{item.quantity}</strong>
                            </p>
                          </div>
                        </div>
                        <strong className="shrink-0 text-sm text-gray-900">
                          {formatVND(Number(item.price || 0) * Number(item.quantity || 0))}
                        </strong>
                      </div>
                    ))}
                    </div>
                  </div>
                )}

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edebe8] px-6 py-4">
                  <div className="flex flex-wrap items-center gap-5">
                    <span className="text-sm text-[#72757d]">
                      Tổng đơn hàng <strong className="ml-1 text-xl text-gray-900">{formatVND(order.totalAmount)}</strong>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {order.orderStatus === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={isCancellingOrder}
                        className="inline-flex items-center justify-center border border-red-300 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {isCancellingOrder ? "Đang hủy..." : "Hủy đơn hàng"}
                      </button>
                    )}
                  </div>
                </footer>
              </article>
            );
          })
        )}

        {orderPage.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button type="button" disabled={page === 0} onClick={() => setPage((current) => current - 1)} className="border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-40">Trang trước</button>
            <span className="text-sm text-gray-600">Trang {page + 1} / {orderPage.totalPages}</span>
            <button type="button" disabled={page + 1 >= orderPage.totalPages} onClick={() => setPage((current) => current + 1)} className="border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-40">Trang sau</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default OrderPage;
