import { client } from "./client";
export const usersApi = {
  profile: () => client.get("/users/me"),
  update: (payload) => client.patch("/users/me", payload),
  addresses: () => client.get("/users/me/addresses"),
  addAddress: (payload) => client.post("/users/me/addresses", payload),
  deleteAddress: (id) => client.delete(`/users/me/addresses/${id}`),
  list: () => client.get("/users"),
  delete: (id) => client.delete(`/users/${id}`),
};
