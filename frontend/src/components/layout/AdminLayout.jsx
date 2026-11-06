import { Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";
import Navbar from "./Navbar";
import Logo from "../ui/Logo";

export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg)]">
        <aside className="fixed bottom-0 left-0 top-[73px] hidden w-64 border-r border-[var(--line)] bg-white p-5 md:block">
          <Link to="/admin" className="mb-8 block">
            <Logo admin />
          </Link>

          <div className="mb-6 rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] p-3 text-sm text-slate-700">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Admin profile
            </p>
            <p className="mt-2 font-semibold">Store operations</p>
          </div>

          <nav className="space-y-1">
            {[
              [LayoutDashboard, "Dashboard", "/admin"],
              [Package, "Products", "/admin/products"],
              [ShoppingCart, "Orders", "/admin/orders"],
              [Users, "Users", "/admin/users"],
            ].map(([Icon, label, href]) => (
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition hover:bg-[var(--primary-soft)] hover:text-primary"
                to={href}
                key={href}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="md:ml-64">{children}</main>
      </div>
    </>
  );
}
