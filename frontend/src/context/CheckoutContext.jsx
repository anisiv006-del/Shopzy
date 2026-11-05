import { createContext, useContext, useState } from "react";
const CheckoutContext = createContext(null);
export function CheckoutProvider({ children }) {
  const [checkout, setCheckout] = useState(null);
  return (
    <CheckoutContext.Provider
      value={{ checkout, setCheckout, clear: () => setCheckout(null) }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
export const useCheckout = () => useContext(CheckoutContext);
