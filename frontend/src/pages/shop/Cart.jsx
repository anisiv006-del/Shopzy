import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { currency } from "../../utils/format";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

export default function Cart() {
  const { items, update, remove, clear } = useCart();
  const { setCheckout } = useCheckout();
  const navigate = useNavigate();
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const checkout = (selected = items) => {
    setCheckout({ items: selected, fromCart: true, step: 1 });
    navigate("/checkout");
  };
  return (
    <CustomerLayout>
      <div className="page-wrap">
        <div className="mb-8">
          <p className="font-bold text-primary">YOUR SELECTION</p>
          <h1 className="mt-2 text-4xl font-extrabold">Shopping cart</h1>
        </div>
        {!items.length ? (
          <EmptyState
            title="Your cart is waiting"
            message="Add something beautiful to get started."
            action={
              <Link className="btn btn-primary mt-6" to="/shop">
                Continue shopping
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((item) => (
                <div className="card flex gap-4 p-4" key={item._id}>
                  <img
                    className="h-28 w-28 rounded-xl bg-slate-100 object-contain p-2 dark:bg-slate-900"
                    src={item.image}
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold">{item.title}</h2>
                    <p className="mt-1 font-semibold">{currency(item.price)}</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex items-center rounded-lg border">
                        <button
                          className="p-2"
                          onClick={() => update(item._id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="p-2"
                          onClick={() => update(item._id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="text-slate-400"
                        onClick={() => remove(item._id)}
                      >
                        <Trash2 size={17} />
                      </button>
                      <button
                        className="ml-auto text-sm font-bold text-primary"
                        onClick={() => checkout([item])}
                      >
                        Buy this now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="text-sm font-bold text-coral" onClick={clear}>
                Clear cart
              </button>
            </div>
            <aside className="card h-fit p-6">
              <h2 className="font-bold">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{subtotal >= 500 ? "Free" : currency(49)}</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold dark:border-slate-700">
                  <span>Total</span>
                  <span>
                    {currency(subtotal >= 500 ? subtotal : subtotal + 49)}
                  </span>
                </div>
              </div>
              <Button className="mt-6 w-full" onClick={() => checkout()}>
                Proceed to checkout
              </Button>
            </aside>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
