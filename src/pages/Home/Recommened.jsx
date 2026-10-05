import BookCard from "../books/BookCard";
import { useFetchBestSellersQuery } from "../../redux/features/books/booksApi";

const Recommened = () => {
  const { data: books = [], isLoading, isError } = useFetchBestSellersQuery({ size: 10 });

  return (
    <section className="py-10">
      <h2 className="mb-6 text-3xl font-semibold">Top 10 Best Sellers</h2>
      {isLoading && <p className="text-gray-500">Loading best sellers...</p>}
      {isError && <p className="text-red-600">Unable to load best sellers.</p>}
      {!isLoading && !isError && books.length === 0 && (
        <p className="text-gray-500">No best sellers are available yet.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div key={book._id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommened;
