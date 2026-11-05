import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = `shop_cart_${user?.id || user?._id || "guest"}`;
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem(key) || "[]"),
  );
  useEffect(
    () => setItems(JSON.parse(localStorage.getItem(key) || "[]")),
    [key],
  );
  useEffect(
    () => localStorage.setItem(key, JSON.stringify(items)),
    [key, items],
  );
  const add = (product, quantity = 1) =>
    setItems((current) => {
      const stock = product.quantity || 0;
      const existing = current.find((item) => item._id === product._id);
      if (existing)
        return current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, stock),
                stock,
              }
            : item,
        );
      return [
        ...current,
        { ...product, stock, quantity: Math.min(quantity, stock) },
      ];
    });
  const update = (id, quantity) =>
    setItems((current) =>
      current.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock || quantity)),
            }
          : item,
      ),
    );
  const remove = (id) =>
    setItems((current) => current.filter((item) => item._id !== id));
  const value = useMemo(
    () => ({
      items,
      add,
      update,
      remove,
      clear: () => setItems([]),
      count: items.reduce((total, item) => total + item.quantity, 0),
    }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
