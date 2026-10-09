import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FaBoxOpen,
  FaBolt,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import {
  useAddToCartMutation,
} from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";
import { formatVND } from "../../utils/currency";

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("synopsis");
  const [isLookInsideOpen, setIsLookInsideOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";

    const loadBook = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(`${apiBaseUrl}/books/${id}`);
        if (!response.ok) {
          throw new Error(`Book request failed with status ${response.status}`);
        }
        const payload = await response.json();
        const data = payload?.success === true ? payload.data : payload;
        if (!data?.id) {
          throw new Error("Book response did not contain a book.");
        }
        if (isMounted) {
          setBook({
            ...data,
            _id: data.id,
            newPrice: Number(data.price || 0),
            coverImage: data.imageUrl || "",
            description: data.description || `ISBN: ${data.isbn || ""}`,
            authorName: data.authorName || "Chưa cập nhật tác giả",
            editorsPick: Boolean(data.editorsPick),
            category: Array.isArray(data.categoryNames) ? data.categoryNames.join(", ") : "",
          });
        }
      } catch (error) {
        console.error("Unable to load book details", error);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadBook();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const addBookToCart = async (redirectToCart = false) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        bookId: book.id || book._id,
        quantity,
      }).unwrap();

      if (redirectToCart) {
        navigate("/cart");
        return;
      }

      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Đã thêm vào giỏ",
        text: `${book.title} đã được thêm vào giỏ hàng.`,
        showConfirmButton: false,
        timer: 1600,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Không thể thêm sách",
        text: error?.data?.message || "Vui lòng thử lại.",
      });
    }
  };

  if (isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-stone-500">Đang tải thông tin sách...</div>;
  }

  if (isError || !book) {
    return (
      <div className="p-10 text-center text-red-600">
        <p>Không thể tải thông tin sách.</p>
        <Link to="/books" className="mt-4 inline-block text-sm font-semibold underline">Quay lại danh sách sách</Link>
      </div>
    );
  }

  const price = Number(book.newPrice || book.price || 0);
  const author = book.authorName || "Chưa cập nhật tác giả";
  const category = book.category || "Book collection";
  const stock = Number(book.stockQuantity || 0);
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Chưa cập nhật";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900">
      <div className="border-b border-stone-200 bg-[#f6f2ea] py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs font-medium text-stone-500 sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-stone-900">Trang chủ</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-stone-900">Tất cả sách</Link>
          <span>/</span>
          <span className="truncate font-semibold text-stone-900">{book.title}</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="group relative flex min-h-[30rem] items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-amber-50/60 p-7 sm:p-9">
              {book.editorsPick && (
                <div className="absolute left-4 top-4 bg-stone-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 shadow-sm">
                  Lựa chọn biên tập
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsLookInsideOpen(true)}
                className="absolute bottom-5 right-5 z-10 rounded-full border border-stone-200 bg-white/90 px-3.5 py-2 text-xs font-bold shadow-lg transition hover:bg-white"
              >
                Xem bên trong
              </button>
              <div className="my-6 flex h-[22rem] w-56 items-center justify-center rounded-r-md border-l-[6px] border-amber-950 bg-white p-4 shadow-2xl ring-1 ring-stone-200 transition duration-500 [transform:perspective(900px)_rotateY(-8deg)] group-hover:-translate-y-1 group-hover:[transform:perspective(900px)_rotateY(0deg)] sm:h-[24rem] sm:w-64">
                <img
                  src={getImgUrl(book.coverImage)}
                  alt={book.title}
                  className="h-full w-full object-contain object-center"
                />
              </div>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] tracking-wide text-stone-500">◉&nbsp; Di chuột lên bìa sách để xem chi tiết</p>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-7">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-amber-600">
                <span>{category}</span>
                <span className="size-1 rounded-full bg-stone-300" />
                <span className={stock > 0 ? "text-emerald-700" : "text-rose-600"}>
                  {stock > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
                {book.title}
              </h1>
              <p className="mt-2 text-sm font-medium text-stone-500">
                Bởi <span className="font-semibold text-stone-900 underline decoration-amber-400 decoration-2 underline-offset-4">{author}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold">{formatVND(price)}</span>
              </div>
              <span className="text-right text-[11px] font-medium text-stone-500">Thanh toán an toàn</span>
            </div>

            <p className="text-sm leading-7 text-stone-600">{book.description}</p>

            <div className="space-y-3.5 pt-2">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center justify-between rounded-lg border border-stone-300 bg-white px-3 py-2 sm:w-32">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-8 items-center justify-center rounded hover:bg-stone-100" aria-label="Giảm số lượng">
                    <HiMinus className="text-xs" />
                  </button>
                  <span className="text-sm font-bold">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(Math.max(stock, 1), value + 1))} disabled={stock <= quantity} className="flex size-8 items-center justify-center rounded hover:bg-stone-100 disabled:opacity-30" aria-label="Tăng số lượng">
                    <HiPlus className="text-xs" />
                  </button>
                </div>
                <button type="button" onClick={() => addBookToCart(false)} disabled={isAdding || stock <= 0} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-950 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50">
                  <FaShoppingBag /> {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
                </button>
                <button type="button" onClick={() => addBookToCart(true)} disabled={isAdding || stock <= 0} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <FaBolt className="text-amber-400" /> Mua ngay
                </button>
                <button type="button" onClick={() => setIsFavorite((value) => !value)} className={`flex size-12 items-center justify-center rounded-lg border bg-white transition ${isFavorite ? "border-rose-300 text-rose-500" : "border-stone-300 text-stone-700 hover:border-amber-400"}`} title="Thêm vào danh sách yêu thích" aria-label="Thêm vào danh sách yêu thích">
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-5 text-xs sm:grid-cols-4">
              <Spec label="ISBN" value={book.isbn || "Chưa cập nhật"} />
              <Spec label="Ngày phát hành" value={formattedDate} />
              <Spec label="Tồn kho" value={`${stock} sản phẩm`} />
              <Spec label="Định dạng" value="Bìa mềm" />
            </div>

            <div className="grid gap-3 rounded-xl border border-stone-200 bg-amber-50/50 p-4 text-xs text-stone-500 sm:grid-cols-3">
              <Trust icon={FaTruck} label="Miễn phí giao hàng nhanh" />
              <Trust icon={FaBoxOpen} label="Đổi trả dễ dàng" />
              <Trust icon={FaShieldAlt} label="Cam kết chính hãng" />
            </div>
          </div>
        </div>

        <section className="mt-16 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8 flex flex-wrap gap-8 border-b border-stone-200 text-sm font-bold uppercase tracking-wider">
            {[
              ["synopsis", "Tóm tắt & Tổng quan"],
              ["author", `Về ${author}`],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setActiveTab(id)} className={`border-b-2 pb-3 transition ${activeTab === id ? "border-amber-400 text-amber-600" : "border-transparent text-stone-500 hover:text-stone-900"}`}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === "synopsis" && (
            <div className="space-y-5 text-sm leading-7 text-stone-600">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Khám phá cuốn sách tuyệt vời tiếp theo.</h2>
              <p>{book.description}</p>
              <div className="border-l-4 border-amber-400 bg-amber-50/60 p-5 font-serif text-base italic text-stone-800">
                Mỗi cuốn sách mở ra một cánh cửa khác nhau. Hãy tìm câu chuyện ở lại cùng bạn.
              </div>
            </div>
          )}
          {activeTab === "author" && (
            <div className="space-y-3 text-sm leading-7 text-stone-600">
              <h2 className="font-serif text-2xl font-bold text-stone-900">{author}</h2>
              <p>Khám phá thêm về tác giả và các tác phẩm của họ trong danh mục sách của chúng tôi.</p>
              <Link to={`/books?search=${encodeURIComponent(author)}`} className="inline-block font-semibold text-amber-600 underline underline-offset-4">Xem sách của tác giả này</Link>
            </div>
          )}
        </section>
      </main>

      {isLookInsideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4" role="dialog" aria-modal="true" aria-label={`Xem trước ${book.title}`}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 p-5">
              <h2 className="font-serif text-xl font-bold">Xem bên trong: {book.title}</h2>
              <button type="button" onClick={() => setIsLookInsideOpen(false)} className="text-2xl text-stone-400 hover:text-stone-900" aria-label="Đóng bản xem trước">×</button>
            </div>
            <div className="space-y-5 p-6 text-sm leading-7 text-stone-600">
              <p className="font-serif text-2xl font-bold text-stone-900">{book.title}</p>
              <p>{book.description}</p>
              <p className="italic">Tiếp tục đọc sách bằng cách thêm sách vào giỏ hàng.</p>
            </div>
            <div className="flex items-center justify-between border-t border-stone-100 bg-amber-50/60 px-6 py-4">
              <span className="text-xs text-stone-500">ISBN: {book.isbn || "Chưa cập nhật"}</span>
              <button type="button" onClick={() => { setIsLookInsideOpen(false); addBookToCart(false); }} className="rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950">Thêm vào giỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Spec = ({ label, value }) => (
  <div>
    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}</span>
    <span className="font-semibold text-stone-900">{value}</span>
  </div>
);

Spec.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const Trust = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2">
    <Icon className="text-amber-500" />
    <span>{label}</span>
  </div>
);

Trust.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

export default SingleBook;
