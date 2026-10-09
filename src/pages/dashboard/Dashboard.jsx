import { MdInventory2, MdPeople, MdTrendingUp } from "react-icons/md";
import Loading from "../../components/Loading";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useGetDashboardSummaryQuery } from "../../redux/features/dashboard/dashboardApi";
import RevenueChart from "./RevenueChart";
import { formatVND } from "../../utils/currency";
import { useEffect, useState } from "react";

const toInputDate = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const getDefaultRange = (period) => {
  const today = new Date();
  const to = toInputDate(today);
  const fromDate = new Date(today);
  if (period === "day") fromDate.setDate(fromDate.getDate() - 2);
  if (period === "month") {
    fromDate.setDate(1);
    fromDate.setMonth(fromDate.getMonth() - 2);
  }
  if (period === "year") {
    fromDate.setMonth(0, 1);
    fromDate.setFullYear(fromDate.getFullYear() - 2);
  }
  return { from: toInputDate(fromDate), to };
};

const Dashboard = () => {
  const [period, setPeriod] = useState("month");
  const [range, setRange] = useState(() => getDefaultRange("month"));
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    period: "month",
    ...getDefaultRange("month"),
  }));
  useEffect(() => {
    setRange(getDefaultRange(period));
  }, [period]);
  const { data: summary, isLoading: isLoadingSummary, isError } =
    useGetDashboardSummaryQuery({
      period: appliedFilters.period,
      from: appliedFilters.from,
      to: appliedFilters.to,
    });
  const { data: books = [], isLoading: isLoadingBooks } = useFetchAllBooksQuery();

  if (isLoadingSummary || isLoadingBooks) return <Loading />;
  if (isError) {
    return <div className="rounded-md bg-red-50 p-4 text-red-700">Không thể tải dữ liệu tổng quan.</div>;
  }

  const bestSellers = (summary?.bestSellers || []).slice(0, 3);
  const lowStockBooks = summary?.lowStockBooks || [];
  const totalRevenue = Number(summary?.totalRevenue || 0);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Tổng doanh thu", formatVND(totalRevenue), "text-green-600", "bg-green-100", MdTrendingUp],
          ["Tổng tồn kho", summary?.totalStockQuantity || 0, "text-blue-600", "bg-blue-100", MdInventory2],
          ["Số đầu sách", summary?.totalBooks || books.length, "text-purple-600", "bg-purple-100", MdPeople],
        ].map(([label, value, textColor, backgroundColor, Icon]) => (
          <div key={label} className="flex items-center rounded-lg bg-white p-6 shadow">
            <div className={`mr-4 inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${textColor} ${backgroundColor}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <span className="block text-2xl font-bold">{value}</span>
              <span className="block text-gray-500">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Sách bán chạy</h2>
          {bestSellers.length === 0 ? (
            <p className="text-gray-500">Chưa có sách nào được giao.</p>
          ) : (
            <ul className="divide-y">
              {bestSellers.map((book) => (
                <li key={book.bookId} className="flex items-center justify-between py-3">
                  <span className="font-medium">{book.title}</span>
                  <span className="text-sm text-gray-500">Đã bán {book.quantitySold}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Sắp hết hàng</h2>
          {lowStockBooks.length === 0 ? (
            <p className="text-gray-500">Tất cả sản phẩm đều còn đủ hàng.</p>
          ) : (
            <ul className="divide-y">
              {lowStockBooks.map((book) => (
                <li key={book.bookId} className="flex items-center justify-between py-3">
                  <span className="font-medium">{book.title}</span>
                  <span className="font-semibold text-red-600">Còn {book.stockQuantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <RevenueChart
        totalRevenue={Number(summary?.totalRevenue || 0)}
        revenuePoints={summary?.revenuePoints || []}
        period={period}
        from={range.from}
        to={range.to}
        onPeriodChange={setPeriod}
        onRangeChange={setRange}
        onApplyFilters={() => setAppliedFilters({ period, ...range })}
      />
    </section>
  );
};

export default Dashboard;
