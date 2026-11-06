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
      <div className="relative h-56 overflow-hidden bg-[var(--panel-soft)]">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/500x500/e2e8f0/64748b?text=Shopzy";
            }}
          />
        </Link>
        <button
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 rounded-full bg-white p-2 text-primary shadow-sm ring-1 ring-[var(--line)]"
          onClick={wishlist}
        >
          <Heart size={17} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 font-semibold text-primary">
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
          <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-bold leading-5">
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
