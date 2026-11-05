import { client } from "./client";
export const productsApi = {
  list: () => client.get("/products"),
  get: (id) => client.get(`/products/${id}`),
  categories: () => client.get("/categories"),
  reviews: (id) => client.get(`/products/${id}/reviews`),
  addReview: (id, payload) => client.post(`/products/${id}/reviews`, payload),
  wishlist: () => client.get("/users/me/wishlist"),
  toggleWishlist: (id) => client.post(`/users/me/wishlist/${id}`),
};
