import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { productsApi } from "../../api/products";
import { apiError } from "../../api/client";
import { useCart } from "../../context/CartContext";
import { currency } from "../../utils/format";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Button from "../../components/ui/Button";

export default function ProductDetails({ reviews = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewList, setReviewList] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  useEffect(() => {
    productsApi
      .get(id)
      .then((response) => {
        setProduct(response.data);
        return productsApi.reviews(response.data._id);
      })
      .then((response) => setReviewList(response.data))
      .catch((error) => toast.error(apiError(error)));
  }, [id]);
  if (!product)
    return (
      <CustomerLayout>
        <div className="page-wrap text-center">Loading product...</div>
      </CustomerLayout>
    );
  const submitReview = async (event) => {
    event.preventDefault();
    try {
      await productsApi.addReview(product._id, { rating, comment });
      setComment("");
      toast.success("Review added");
      const response = await productsApi.reviews(product._id);
      setReviewList(response.data);
    } catch (error) {
      toast.error(apiError(error));
    }
  };
  return (
    <CustomerLayout>
      <div className="page-wrap">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500"
          to="/shop"
        >
          <ArrowLeft size={16} /> Back to shop
        </Link>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="card flex min-h-[480px] items-center justify-center bg-slate-100 p-10 dark:bg-slate-900">
            <img
              className="max-h-[440px] max-w-full object-contain"
              src={product.image}
              alt={product.title}
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="chip chip-active w-fit">{product.category}</span>
            <h1 className="mt-5 text-4xl font-extrabold">{product.title}</h1>
            <div className="mt-4 flex items-center gap-2 text-amber-500">
              <Star size={18} fill="currentColor" />{" "}
              {product.rating?.rate || "—"}{" "}
              <span className="text-sm text-slate-400">
                ({product.rating?.count || 0} reviews)
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold">{currency(product.price)}</p>
            <p className="mt-5 leading-7 text-slate-500">
              {product.description}
            </p>
            <div className="mt-8 flex gap-3">
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  className="p-3"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  className="p-3"
                  onClick={() =>
                    setQuantity(Math.min(product.quantity, quantity + 1))
                  }
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                className="flex-1"
                disabled={!product.quantity}
                onClick={() => {
                  add(product, quantity);
                  toast.success("Added to cart");
                }}
              >
                Add to cart
              </Button>
            </div>
            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={() => navigate(`/checkout?buy=${product._id}`)}
            >
              Buy now
            </Button>
          </div>
        </div>
        {reviews && (
          <section className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-2xl font-extrabold">Reviews</h2>
            <form className="card mt-5 space-y-3 p-6" onSubmit={submitReview}>
              <select
                className="field"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
              <textarea
                className="field min-h-24"
                required
                placeholder="Share your experience"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <Button>Post review</Button>
            </form>
            <div className="mt-5 space-y-3">
              {reviewList.map((review) => (
                <article className="card p-5" key={review._id}>
                  <div className="flex justify-between font-bold">
                    {review.userId?.username || "Customer"}
                    <span className="text-amber-500">
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-500">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}
