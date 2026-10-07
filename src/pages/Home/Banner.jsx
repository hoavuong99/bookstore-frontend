
import { Link } from "react-router-dom";
import bannerImg from "../../assets/banner.png";
import {
  useFetchBestSellersQuery,
  useFetchBooksPageQuery,
} from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";

const Banner = () => {
  const { data: bestSellers = [] } = useFetchBestSellersQuery({ size: 3 });
  const { data: firstBookPage = {} } = useFetchBooksPageQuery({ page: 0, size: 3 });
  const heroBooks = bestSellers.length > 0 ? bestSellers : firstBookPage.content || [];

  return (
    <section className="mb-12 grid min-h-[32rem] overflow-hidden bg-[#fbe9c8] md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-14 md:px-20">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">Sách mới nhất</p>
        <h1 className="max-w-md font-serif text-5xl font-bold leading-[1.05] text-stone-950 md:text-7xl">
          Sách hay, tâm trạng vui
        </h1>
        <p className="mt-7 max-w-sm leading-7 text-stone-700">
          Khám phá những câu chuyện đáng nhớ, từ sách bán chạy đến lựa chọn yêu thích tiếp theo của bạn.
        </p>
        <Link
          to="/books"
          className="mt-9 w-fit bg-amber-400 px-7 py-4 text-sm font-bold uppercase tracking-wide text-stone-950 transition hover:bg-amber-500"
        >
          Khám phá ngay
        </Link>
      </div>
      <div className="hidden min-h-full items-end justify-center gap-5 bg-[#f8dfb3] px-8 pt-12 md:flex">
        {heroBooks.length > 0 ? (
          heroBooks.slice(0, 3).map((book, index) => (
            <img
              key={book._id}
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className={`h-80 w-44 rounded-t-sm object-cover object-center shadow-2xl ${
                index === 1 ? "mb-10" : ""
              }`}
            />
          ))
        ) : (
          <img
            src={bannerImg}
            alt=""
            className="h-80 max-w-full object-contain object-bottom"
          />
        )}
      </div>
    </section>
  );
};

export default Banner;