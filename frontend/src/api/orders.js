import { client } from "./client";
export const ordersApi = {
  mine: () => client.get("/orders/my-orders"),
  all: () => client.get("/orders"),
  updateStatus: (id, orderStatus) =>
    client.patch(`/orders/${id}/status`, { orderStatus }),
};
