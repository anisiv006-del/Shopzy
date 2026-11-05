import { Link } from "react-router-dom";
import {
  CircleUserRound,
  LogOut,
  Moon,
  Search,
  ShoppingCart,
  Sun,
} from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
        <Link to="/shop">
          <Logo />
        </Link>
        <div className="hidden flex-1 md:block">
          <label className="mx-auto flex max-w-md items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-400 dark:bg-slate-900">
            <Search size={17} />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search products..."
              onChange={(event) =>
                window.dispatchEvent(
                  new CustomEvent("product-search", {
                    detail: event.target.value,
                  }),
                )
              }
            />
          </label>
        </div>
        <nav className="ml-auto flex items-center gap-1 text-sm font-semibold">
          <Link
            className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 sm:block dark:hover:bg-slate-900"
            to="/orders"
          >
            Orders
          </Link>
          <Link
            className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 sm:block dark:hover:bg-slate-900"
            to="/wishlist"
          >
            Wishlist
          </Link>
          <Link
            className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            to="/cart"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <b className="absolute -right-1 -top-1 rounded-full bg-coral px-1.5 text-[10px] text-white">
                {count}
              </b>
            )}
          </Link>
          <Link
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            to="/profile"
          >
            <CircleUserRound size={20} />
          </Link>
          <button className="rounded-lg p-2" onClick={toggle}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="rounded-lg p-2 text-slate-500" onClick={logout}>
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
