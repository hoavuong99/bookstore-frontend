import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookCard from "../books/BookCard";
import { useFetchBooksPageQuery } from "../../redux/features/books/booksApi";
import { useFetchAllCategoriesQuery } from "../../redux/features/books/booksApi";

const TopSellers = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);
  const loadMoreRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const { data: bookPage = {}, isFetching } = useFetchBooksPageQuery({ page, size: 10, search });
  const { data: categories = [] } = useFetchAllCategoriesQuery();
  const hasMore = page + 1 < (bookPage.totalPages || 0);

  useEffect(() => {
    setPage(0);
    setBooks([]);
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setBooks((currentBooks) => (
      page === 0
        ? bookPage.content || []
        : [
            ...currentBooks,
            ...(bookPage.content || []).filter(
              (book) => !currentBooks.some((currentBook) => currentBook._id === book._id)
            ),
          ]
    ));
  }, [bookPage.content, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !isFetching) {
        setPage((currentPage) => currentPage + 1);
      }
    }, { rootMargin: "200px" });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const filteredBooks =
    !selectedCategoryId
      ? books
      : books.filter(
          (book) => book.categoryIds.includes(Number(selectedCategoryId))
        );

  const handleSearch = (event) => {
    if (event.key !== "Enter") return;
    const value = searchInput.trim();
    navigate(value ? `/?search=${encodeURIComponent(value)}` : "/");
  };

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">
        {search ? `Search results for "${search}"` : "All Books"}
      </h2>
      {/* category filtering */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          name="category"
          id="category"
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search books by name"
            className="w-full rounded-md border border-gray-300 bg-[#EAEAEA] py-2 pl-4 pr-20 focus:outline-none"
          />
          {(searchInput || selectedCategoryId) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSelectedCategoryId("");
                navigate("/");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.length > 0 &&
          filteredBooks.map((book, index) => (
            <div key={book._id || index}>
              <BookCard book={book} />
            </div>
          ))}
      </div>
      <div ref={loadMoreRef} className="h-8 text-center text-sm text-gray-500">
        {isFetching && "Loading more books..."}
      </div>
    </div>
  );
};

export default TopSellers;
