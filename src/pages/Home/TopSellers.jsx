import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiArrowPath, HiMagnifyingGlass } from "react-icons/hi2";
import BookCard from "../books/BookCard";
import { useFetchBooksPageQuery } from "../../redux/features/books/booksApi";
import { useFetchAllCategoriesQuery } from "../../redux/features/books/booksApi";
import { formatVND } from "../../utils/currency";

const TopSellers = () => {
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);
  const loadMoreRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get("search") || "";
  const selectedCategoryId = searchParams.get("category") || "";
  const selectedMaxPrice = searchParams.get("maxPrice") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [categoryInput, setCategoryInput] = useState(selectedCategoryId);
  const [maxPriceInput, setMaxPriceInput] = useState(selectedMaxPrice || "1000000");

  const { data: bookPage = {}, isFetching } = useFetchBooksPageQuery({
    page,
    size: 10,
    search,
    categoryId: selectedCategoryId,
    maxPrice: selectedMaxPrice,
  });
  const { data: categories = [] } = useFetchAllCategoriesQuery();
  const hasMore = page + 1 < (bookPage.totalPages || 0);

  useEffect(() => {
    setPage(0);
    setBooks([]);
    setSearchInput(search);
    setCategoryInput(selectedCategoryId);
    setMaxPriceInput(selectedMaxPrice || "1000000");
  }, [search, selectedCategoryId, selectedMaxPrice]);

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

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("search", searchInput.trim());
    if (categoryInput) params.set("category", categoryInput);
    if (maxPriceInput && maxPriceInput !== "1000000") params.set("maxPrice", maxPriceInput);
    navigate(params.size ? `/books?${params.toString()}` : "/books");
  };

  const resetFilters = () => {
    setSearchInput("");
    setCategoryInput("");
    setMaxPriceInput("1000000");
    navigate("/books");
  };

  const hasDraftFilters = Boolean(searchInput.trim() || categoryInput || maxPriceInput !== "1000000");

  return (
    <section id="all-books" className="scroll-mt-24 bg-white py-8">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl font-bold text-stone-900">
          {search ? `Kết quả tìm kiếm cho "${search}"` : "Khám phá sách mới"}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Khám phá bộ sưu tập sách và tìm câu chuyện phù hợp cho chương tiếp theo của bạn.
        </p>
      </div>

      <div className="mb-10 grid gap-5 border border-stone-200 bg-[#fbf5ea] p-6 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1.5fr)_auto_auto] lg:items-end lg:gap-4 lg:px-7">
        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
          Tìm sách
          <span className="relative">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyFilters();
              }}
              placeholder="Tìm theo tên sách..."
              className="h-11 w-full border border-stone-300 bg-white pl-10 pr-3 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-amber-400"
            />
          </span>
        </label>
        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
          Thể loại
          <select
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            className="h-11 border border-stone-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-400"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
          Giá tối đa
          <span className="flex h-11 min-w-0 items-center gap-3">
            <input
              type="range"
              min="10"
              max="1000000"
              step="1"
              value={maxPriceInput}
              onChange={(event) => setMaxPriceInput(event.target.value)}
              className="min-w-0 flex-1 accent-amber-400"
            />
            <span className="min-w-[112px] shrink-0 whitespace-nowrap rounded-full bg-amber-400 px-3 py-1 text-center text-xs font-bold tracking-normal text-stone-900">
              {formatVND(maxPriceInput)}
            </span>
          </span>
        </label>
        <button
          type="button"
          onClick={applyFilters}
          className="h-11 bg-amber-400 px-5 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-amber-500"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasDraftFilters}
          className="flex h-11 items-center justify-center gap-2 border border-stone-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-stone-700 transition hover:border-amber-400 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <HiArrowPath /> Đặt lại
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
        {books.length > 0 &&
          books.map((book, index) => (
            <div key={book._id || index}>
              <BookCard book={book} catalog />
            </div>
          ))}
      </div>
      {!isFetching && books.length === 0 && (search || selectedCategoryId || selectedMaxPrice) && (
        <div className="py-12 text-center text-stone-500">
          <p className="font-serif text-xl font-bold text-stone-800">Không tìm thấy sách phù hợp với bộ lọc.</p>
          <p className="mt-2 text-sm">Hãy thử điều chỉnh từ khóa, thể loại hoặc giá tối đa.</p>
        </div>
      )}
      <div ref={loadMoreRef} className="h-8 text-center text-sm text-gray-500">
        {isFetching && "Đang tải thêm sách..."}
      </div>
    </section>
  );
};

export default TopSellers;
