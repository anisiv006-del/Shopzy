import axios from "axios";
import toast from "react-hot-toast";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

let onUnauthorized;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

client.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem("shop_session") || "null");
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
      toast.error("Your session has expired. Please sign in again.");
    }
    return Promise.reject(error);
  },
);

export const apiError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";
