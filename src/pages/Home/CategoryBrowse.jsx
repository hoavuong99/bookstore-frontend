import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFetchAllCategoriesQuery } from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";

const fallbackImages = ["book-1.png", "book-5.png", "book-9.png", "book-13.png", "book-17.png"];

const CategoryBrowse = () => {
  const { data: categories = [], isLoading } = useFetchAllCategoriesQuery();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategoryId = searchParams.get("category") || "";

  const selectCategory = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    navigate(`/books?${params.toString()}`);
  };

  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="mb-20 scroll-mt-24 bg-white py-6">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">Tìm cuốn sách tiếp theo</p>
        <h2 className="font-serif text-4xl font-bold text-stone-900">Chọn theo thể loại</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:grid-rows-2">
        {categories.slice(0, 5).map((category, index) => (
          <button
            type="button"
            key={category.id}
            onClick={() => selectCategory(String(category.id))}
            className={`group relative min-h-48 overflow-hidden text-left ${
              index === 1 ? "md:row-span-2 md:min-h-full" : ""
            } ${
              selectedCategoryId === String(category.id)
                ? "ring-4 ring-amber-400"
                : ""
            }`}
          >
            <img
              src={getImgUrl(category.imageUrl || fallbackImages[index % fallbackImages.length])}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/40 transition group-hover:bg-black/55" />
            <span className="absolute bottom-5 left-5 right-5 font-serif text-lg font-bold text-white underline underline-offset-4">
              {category.name}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-9 text-center">
        <Link
          to="/books"
          className="inline-block bg-amber-400 px-7 py-4 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-amber-500"
        >
          Xem tất cả thể loại
        </Link>
      </div>
    </section>
  );
};

export default CategoryBrowse;
