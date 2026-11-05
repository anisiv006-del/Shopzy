import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products";
import { apiError } from "../../api/client";
import { useCart } from "../../context/CartContext";
import { currency } from "../../utils/format";
import Button from "../ui/Button";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const stock = product.quantity || 0;
  const addToCart = () => {
    add(product);
    toast.success("Added to cart");
  };
  const wishlist = async () => {
    try {
      const { data } = await productsApi.toggleWishlist(product._id);
      toast.success(data.message);
    } catch (error) {
      toast.error(apiError(error));
    }
  };
  return (
    <article className="card group overflow-hidden">
      <div className="relative flex h-56 items-center justify-center bg-slate-100 p-6 dark:bg-slate-900">
        <Link to={`/product/${product.id}`} className="h-full w-full">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/500x500/e2e8f0/64748b?text=Shopzy";
            }}
          />
        </Link>
        <button
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 rounded-full bg-white p-2 text-coral shadow-sm"
          onClick={wishlist}
        >
          <Heart size={17} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-primary">
            {product.category}
          </span>
          <span>
            {stock
              ? stock < 6
                ? `Only ${stock} left`
                : "In stock"
              : "Out of stock"}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-3 line-clamp-2 min-h-12 font-bold">
            {product.title}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <strong className="text-lg tabular-nums">
            {currency(product.price)}
          </strong>
          <span className="flex items-center gap-1 text-sm text-amber-500">
            <Star size={15} fill="currentColor" />
            {product.rating?.rate || "—"}
          </span>
        </div>
        <Button className="mt-4 w-full" disabled={!stock} onClick={addToCart}>
          Add to cart
        </Button>
      </div>
    </article>
  );
}
