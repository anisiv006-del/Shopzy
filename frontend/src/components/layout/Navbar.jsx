import { Link } from "react-router-dom";
import { CircleUserRound, LogOut, Search, ShoppingCart } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to={user?.role === "admin" ? "/admin" : "/shop"} className="shrink-0">
          <Logo admin={user?.role === "admin"} />
        </Link>

        <div className="hidden flex-1 md:block">
          <label className="mx-auto flex max-w-md items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-slate-400">
            <Search size={17} />
            <input
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
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

        <nav className="ml-auto flex items-center gap-1 text-sm font-semibold text-slate-700">
          <Link className="hidden rounded-md px-3 py-2 hover:bg-[var(--primary-soft)] sm:block" to="/orders">
            Orders
          </Link>
          <Link className="hidden rounded-md px-3 py-2 hover:bg-[var(--primary-soft)] sm:block" to="/wishlist">
            Wishlist
          </Link>
          <Link className="relative rounded-md p-2 hover:bg-[var(--primary-soft)]" to="/cart">
            <ShoppingCart size={20} />
            {count > 0 && (
              <b className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] text-white">
                {count}
              </b>
            )}
          </Link>
          <Link className="rounded-md p-2 hover:bg-[var(--primary-soft)]" to="/profile">
            <CircleUserRound size={20} />
          </Link>
          <button
            className="rounded-md p-2 text-slate-500 transition hover:bg-[var(--primary-soft)] hover:text-primary"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
