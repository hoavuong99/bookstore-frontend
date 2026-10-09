import BookCard from "../books/BookCard";
import { Link } from "react-router-dom";
import { useFetchNewArrivalsQuery } from "../../redux/features/books/booksApi";

const NewArrivals = () => {
  const { data: books = [], isLoading, isError } = useFetchNewArrivalsQuery({ size: 5 });

  return (
    <section id="new-arrivals" className="mb-20 scroll-mt-24 bg-white py-6">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl font-bold text-stone-900">Khám phá sách mới</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Cập nhật những cuốn sách mới nhất từ các tác giả nổi tiếng và những câu chuyện hấp dẫn. Hãy khám phá và tìm cho mình những trải nghiệm đọc tuyệt vời.
        </p>
      </div>
      {isLoading && <p className="text-stone-600">Đang tải sách mới...</p>}
      {isError && <p className="text-red-600">Không thể tải sách mới.</p>}
      {!isLoading && !isError && books.length === 0 && (
        <p className="text-stone-600">Chưa có sách mới.</p>
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
        {books.map((book) => (
          <div key={book._id}>
            <BookCard book={book} compact />
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          to="/books"
          className="inline-block bg-amber-400 px-7 py-4 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-amber-500"
        >
          Xem thêm sách
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
