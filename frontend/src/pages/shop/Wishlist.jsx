import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products";
import { apiError } from "../../api/client";
import CustomerLayout from "../../components/layout/CustomerLayout";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
export default function Wishlist() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    productsApi
      .wishlist()
      .then(({ data }) => setProducts(data))
      .catch((error) => toast.error(apiError(error)));
  }, []);
  return (
    <CustomerLayout>
      <div className="page-wrap">
        <p className="font-bold text-primary">SAVED FOR LATER</p>
        <h1 className="mt-2 text-4xl font-extrabold">Wishlist</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {!products.length && (
          <EmptyState
            title="Your wishlist is empty"
            message="Save pieces you love and find them here."
          />
        )}
      </div>
    </CustomerLayout>
  );
}
