import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ordersApi } from "../../api/orders";
import { apiError } from "../../api/client";
import { currency, shortDate } from "../../utils/format";
import AdminLayout from "../../components/layout/AdminLayout";
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    ordersApi
      .all()
      .then(({ data }) => setOrders(data))
      .catch((error) => toast.error(apiError(error)));
  }, []);
  const update = async (order, status) => {
    const previous = orders;
    setOrders(
      orders.map((item) =>
        item._id === order._id ? { ...item, orderStatus: status } : item,
      ),
    );
    try {
      await ordersApi.updateStatus(order._id, status);
    } catch (error) {
      setOrders(previous);
      toast.error(apiError(error));
    }
  };
  return (
    <AdminLayout>
      <div className="page-wrap">
        <h1 className="text-4xl font-extrabold">Orders</h1>
        <div className="card mt-8 overflow-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                {["Order", "Customer", "Date", "Total", "Status"].map(
                  (heading) => (
                    <th className="p-4" key={heading}>
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  className="border-b border-slate-100 dark:border-slate-800"
                  key={order._id}
                >
                  <td className="p-4">#{String(order._id).slice(-8)}</td>
                  <td className="p-4">
                    {order.userId?.username || "Customer"}
                  </td>
                  <td className="p-4">{shortDate(order.createdAt)}</td>
                  <td className="p-4">{currency(order.totalAmount)}</td>
                  <td className="p-4">
                    <select
                      className="field py-2"
                      value={order.orderStatus}
                      onChange={(event) => update(order, event.target.value)}
                    >
                      {[
                        "Placed",
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                      ].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
