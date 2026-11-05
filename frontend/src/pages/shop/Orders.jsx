import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ordersApi } from "../../api/orders";
import { apiError } from "../../api/client";
import { currency, shortDate } from "../../utils/format";
import CustomerLayout from "../../components/layout/CustomerLayout";
import EmptyState from "../../components/ui/EmptyState";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    ordersApi
      .mine()
      .then(({ data }) => setOrders(data))
      .catch((error) => toast.error(apiError(error)));
  }, []);
  return (
    <CustomerLayout>
      <div className="page-wrap">
        <p className="font-bold text-primary">YOUR HISTORY</p>
        <h1 className="mt-2 text-4xl font-extrabold">My orders</h1>
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              className="card block p-6 transition hover:-translate-y-0.5"
              to={`/orders/${order._id}`}
              key={order._id}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <b>Order #{String(order._id).slice(-8)}</b>
                  <p className="mt-1 text-sm text-slate-500">
                    {shortDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <b>{currency(order.totalAmount)}</b>
                  <p className="mt-1 text-sm font-bold text-primary">
                    {order.orderStatus}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                {order.items
                  ?.map((item) => `${item.title} × ${item.quantity}`)
                  .join(" · ")}
              </p>
            </Link>
          ))}
          {!orders.length && (
            <EmptyState
              title="No orders yet"
              message="Your next favourite thing is waiting in the shop."
            />
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
