import { MdInventory2, MdLocalShipping, MdPeople, MdTrendingUp } from "react-icons/md";
import Loading from "../../components/Loading";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useGetDashboardSummaryQuery } from "../../redux/features/dashboard/dashboardApi";
import RevenueChart from "./RevenueChart";

const Dashboard = () => {
  const { data: summary, isLoading: isLoadingSummary, isError } =
    useGetDashboardSummaryQuery();
  const { data: books = [], isLoading: isLoadingBooks } = useFetchAllBooksQuery();

  if (isLoadingSummary || isLoadingBooks) return <Loading />;
  if (isError) {
    return <div className="rounded-md bg-red-50 p-4 text-red-700">Unable to load dashboard data.</div>;
  }

  const bestSellers = (summary?.bestSellers || []).slice(0, 3);
  const lowStockBooks = summary?.lowStockBooks || [];
  const totalRevenue = Number(summary?.totalRevenue || 0).toFixed(2);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Revenue", `$${totalRevenue}`, "text-green-600", "bg-green-100", MdTrendingUp],
          ["Total Stock", summary?.totalStockQuantity || 0, "text-blue-600", "bg-blue-100", MdInventory2],
          ["Products", summary?.totalBooks || books.length, "text-purple-600", "bg-purple-100", MdPeople],
          ["Best Sellers", bestSellers.length, "text-yellow-600", "bg-yellow-100", MdLocalShipping],
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
          <h2 className="mb-4 text-xl font-semibold">Best Sellers</h2>
          {bestSellers.length === 0 ? (
            <p className="text-gray-500">No delivered book sales yet.</p>
          ) : (
            <ul className="divide-y">
              {bestSellers.map((book) => (
                <li key={book.bookId} className="flex items-center justify-between py-3">
                  <span className="font-medium">{book.title}</span>
                  <span className="text-sm text-gray-500">{book.quantitySold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Low Stock</h2>
          {lowStockBooks.length === 0 ? (
            <p className="text-gray-500">All products have healthy stock levels.</p>
          ) : (
            <ul className="divide-y">
              {lowStockBooks.map((book) => (
                <li key={book.bookId} className="flex items-center justify-between py-3">
                  <span className="font-medium">{book.title}</span>
                  <span className="font-semibold text-red-600">{book.stockQuantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Revenue</h2>
        <RevenueChart totalRevenue={Number(summary?.totalRevenue || 0)} />
      </div>
    </section>
  );
};

export default Dashboard;
