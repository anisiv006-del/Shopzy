import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products";
import { paymentsApi } from "../../api/payments";
import { apiError } from "../../api/client";
import { useCheckout } from "../../context/CheckoutContext";
import { useCart } from "../../context/CartContext";
import { currency } from "../../utils/format";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Button from "../../components/ui/Button";

export default function Checkout() {
  const { checkout, setCheckout, clear } = useCheckout();
  const { remove } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (checkout) return;
    const id = params.get("buy");
    if (!id) return navigate("/shop");
    productsApi.list().then(({ data }) => {
      const product = data.find((item) => item._id === id);
      if (product)
        setCheckout({
          items: [{ ...product, quantity: 1 }],
          fromCart: false,
          step: 1,
        });
      else navigate("/shop");
    });
  }, [checkout, navigate, params, setCheckout]);
  if (!checkout)
    return (
      <CustomerLayout>
        <div className="page-wrap text-center">Preparing checkout...</div>
      </CustomerLayout>
    );
  const step = checkout.step || 1;
  const next = () => setCheckout({ ...checkout, step: step + 1 });
  const request = async () => {
    setBusy(true);
    try {
      const { data } = await paymentsApi.requestOtp(
        checkout.items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      );
      setPayment(data);
      setCheckout({ ...checkout, step: 5 });
      toast.success("Payment OTP sent");
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setBusy(false);
    }
  };
  const verify = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await paymentsApi.verifyOtp(payment.paymentId, otp);
      if (checkout.fromCart) checkout.items.forEach((item) => remove(item._id));
      setCheckout({ ...checkout, step: 6, result: data });
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <CustomerLayout>
      <div className="page-wrap max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-bold text-primary">SECURE CHECKOUT</p>
            <h1 className="mt-2 text-4xl font-extrabold">
              Complete your order
            </h1>
          </div>
          <button
            className="text-sm font-bold text-slate-500"
            onClick={() => {
              clear();
              navigate("/cart");
            }}
          >
            Cancel
          </button>
        </div>
        <div className="mb-8 grid grid-cols-5 gap-2 text-center text-xs font-bold text-slate-400">
          {["Review", "Address", "Payment", "Verify", "Done"].map(
            (label, index) => (
              <span
                className={step >= index + 1 ? "text-primary" : ""}
                key={label}
              >
                {index + 1}. {label}
              </span>
            ),
          )}
        </div>
        {step === 1 && (
          <section className="card p-7">
            <h2 className="text-xl font-bold">Review items</h2>
            {checkout.items.map((item) => (
              <div
                className="mt-4 flex justify-between border-b border-slate-200 pb-3 text-sm dark:border-slate-700"
                key={item._id}
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <b>{currency(item.price * item.quantity)}</b>
              </div>
            ))}
            <Button className="mt-6" onClick={next}>
              Next
            </Button>
          </section>
        )}
        {step === 2 && (
          <section className="card p-7">
            <h2 className="text-xl font-bold">Delivery details</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Full name", "Phone", "Address line", "City", "Pincode"].map(
                (label) => (
                  <input
                    className="field"
                    placeholder={label}
                    required
                    key={label}
                  />
                ),
              )}
            </div>
            <Button className="mt-6" onClick={next}>
              Next
            </Button>
          </section>
        )}
        {step === 3 && (
          <section className="card p-7">
            <h2 className="text-xl font-bold">Payment method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["UPI", "Card", "Cash on Delivery"].map((method) => (
                <button
                  className="rounded-xl border border-slate-200 p-4 text-left font-semibold hover:border-primary dark:border-slate-700"
                  key={method}
                  onClick={next}
                >
                  {method}
                </button>
              ))}
            </div>
          </section>
        )}
        {step === 4 && (
          <section className="card p-7">
            <h2 className="text-xl font-bold">Confirm payment</h2>
            <p className="mt-3 text-slate-500">
              The server calculates the final amount using current stock and
              prices.
            </p>
            <Button className="mt-6" disabled={busy} onClick={request}>
              {busy ? "Sending OTP..." : "Pay & send OTP"}
            </Button>
          </section>
        )}
        {step === 5 && (
          <form className="card p-7 text-center" onSubmit={verify}>
            <h2 className="text-xl font-bold">Verify payment</h2>
            <p className="mt-2 text-slate-500">
              Enter the six-digit OTP sent to your email.
            </p>
            <input
              className="field mt-6 text-center text-3xl tracking-[.6em]"
              required
              maxLength="6"
              inputMode="numeric"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            <Button className="mt-6 w-full" disabled={busy || otp.length !== 6}>
              {busy ? "Verifying..." : "Verify & place order"}
            </Button>
          </form>
        )}
        {step === 6 && (
          <section className="card p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>
            <h2 className="mt-5 text-3xl font-extrabold">Order placed</h2>
            <p className="mt-2 text-slate-500">
              #{String(checkout.result?.orderId || "").slice(-8)} ·{" "}
              {currency(checkout.result?.amount)}
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link className="btn btn-secondary" to="/orders" onClick={clear}>
                View orders
              </Link>
              <Link className="btn btn-primary" to="/shop" onClick={clear}>
                Continue shopping
              </Link>
            </div>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}
