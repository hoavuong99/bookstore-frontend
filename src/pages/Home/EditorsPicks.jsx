import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  useFetchEditorsPicksQuery,
  useFetchNewArrivalsQuery,
} from "../../redux/features/books/booksApi";

const EditorsPicks = () => {
  const { data: picks = [] } = useFetchEditorsPicksQuery({ size: 4 });
  const { data: newArrivals = [] } = useFetchNewArrivalsQuery({ size: 1 });
  const book = picks[0] || newArrivals[0];

  if (!book) {
    return null;
  }

  return (
    <section id="editors-picks" className="mb-20 scroll-mt-24 overflow-hidden bg-stone-100">
      <div className="grid min-h-[32rem] md:grid-cols-2">
        <div className="relative hidden overflow-hidden md:block">
          <img src={getImgUrl(book.coverImage)} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="h-96 max-w-[72%] object-contain shadow-2xl"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center px-8 py-14 md:px-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Lựa chọn biên tập</p>
          <h2 className="font-serif text-4xl font-bold text-stone-900 md:text-5xl">{book.title}</h2>
          <p className="mt-3 font-semibold text-stone-700">{book.authorName}</p>
          <p className="mt-6 max-w-md leading-7 text-stone-600">{book.description}</p>
          <Link
            to={`/books/${book._id}`}
            className="mt-8 w-fit bg-amber-400 px-7 py-4 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-amber-500"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EditorsPicks;
