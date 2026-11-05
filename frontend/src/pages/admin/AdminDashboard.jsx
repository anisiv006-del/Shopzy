import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products";
import { ordersApi } from "../../api/orders";
import { usersApi } from "../../api/users";
import { apiError } from "../../api/client";
import { currency } from "../../utils/format";
import AdminLayout from "../../components/layout/AdminLayout";
export default function AdminDashboard() {
  const [data, setData] = useState({ products: [], orders: [], users: [] });
  useEffect(() => {
    Promise.all([productsApi.list(), ordersApi.all(), usersApi.list()])
      .then(([products, orders, users]) =>
        setData({
          products: products.data,
          orders: orders.data,
          users: users.data,
        }),
      )
      .catch((error) => toast.error(apiError(error)));
  }, []);
  const revenue = data.orders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce((total, order) => total + order.totalAmount, 0);
  return (
    <AdminLayout>
      <div className="page-wrap">
        <p className="font-bold text-primary">OVERVIEW</p>
        <h1 className="mt-2 text-4xl font-extrabold">Dashboard</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Products", data.products.length],
            ["Orders", data.orders.length],
            ["Revenue", currency(revenue)],
            ["Users", data.users.length],
          ].map(([label, value]) => (
            <div className="card p-6" key={label}>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>
        <section className="card mt-6 p-6">
          <h2 className="font-bold">Recent orders</h2>
          {data.orders.slice(0, 8).map((order) => (
            <div
              className="mt-4 flex justify-between border-b border-slate-200 pb-3 text-sm dark:border-slate-700"
              key={order._id}
            >
              <span>#{String(order._id).slice(-8)}</span>
              <span>
                {currency(order.totalAmount)} · {order.orderStatus}
              </span>
            </div>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
}
