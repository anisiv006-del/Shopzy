import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products";
import { apiError } from "../../api/client";
import CustomerLayout from "../../components/layout/CustomerLayout";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/ui/EmptyState";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([productsApi.list(), productsApi.categories()])
      .then(([productsResponse, categoriesResponse]) => {
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data.categories || []);
      })
      .catch((error) => toast.error(apiError(error)))
      .finally(() => setLoading(false));
    const listener = (event) => setQuery(event.detail);
    window.addEventListener("product-search", listener);
    return () => window.removeEventListener("product-search", listener);
  }, []);
  const visible = useMemo(
    () =>
      products
        .filter(
          (product) =>
            (category === "All" || product.category === category) &&
            product.title.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : (b.rating?.rate || 0) - (a.rating?.rate || 0),
        ),
    [products, category, query, sort],
  );
  return (
    <CustomerLayout>
      <div className="page-wrap">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Curated for you
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              Everyday essentials
            </h1>
          </div>
          <select
            className="field w-auto"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="">Sort products</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <div className="mb-8 flex gap-2 overflow-auto pb-2">
          <button
            className={`chip ${category === "All" ? "chip-active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              className={`chip ${category === item ? "chip-active" : ""}`}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                className="card h-96 animate-pulse bg-slate-200 dark:bg-slate-900"
                key={index}
              />
            ))}
          </div>
        ) : visible.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing found"
            message="Try a different search or category."
          />
        )}
      </div>
    </CustomerLayout>
  );
}
