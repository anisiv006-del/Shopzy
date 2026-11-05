import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { client, apiError } from "../../api/client";
import { currency, shortDate } from "../../utils/format";
import CustomerLayout from "../../components/layout/CustomerLayout";
export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    client
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((error) => toast.error(apiError(error)));
  }, [id]);
  if (!order)
    return (
      <CustomerLayout>
        <div className="page-wrap">Loading order...</div>
      </CustomerLayout>
    );
  return (
    <CustomerLayout>
      <div className="page-wrap max-w-3xl">
        <Link className="font-bold text-primary" to="/orders">
          ← Back to orders
        </Link>
        <div className="card mt-6 p-7">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Order #{String(order._id).slice(-8)}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold">
                {order.orderStatus}
              </h1>
            </div>
            <p className="font-bold">{shortDate(order.createdAt)}</p>
          </div>
          <div className="mt-8 space-y-3">
            {order.items?.map((item) => (
              <div
                className="flex justify-between border-b border-slate-200 pb-3 text-sm dark:border-slate-700"
                key={`${item.productId}-${item.title}`}
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <b>{currency(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-xl font-extrabold">
            <span>Total</span>
            <span>{currency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
