import BookCard from "../books/BookCard";
import { useFetchBestSellersQuery } from "../../redux/features/books/booksApi";

const Recommened = () => {
  const { data: books = [], isLoading, isError } = useFetchBestSellersQuery({ size: 10 });

  return (
    <section id="best-sellers" className="mb-20 scroll-mt-24 bg-white py-6">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">Được độc giả yêu thích</p>
        <h2 className="font-serif text-4xl font-bold text-stone-900">Sách bán chạy nhất</h2>
      </div>
      {isLoading && <p className="text-gray-500">Đang tải sách bán chạy...</p>}
      {isError && <p className="text-red-600">Không thể tải sách bán chạy.</p>}
      {!isLoading && !isError && books.length === 0 && (
        <p className="text-gray-500">Chưa có sách bán chạy.</p>
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book) => (
          <div key={book._id}>
            <BookCard book={book} compact />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommened;
