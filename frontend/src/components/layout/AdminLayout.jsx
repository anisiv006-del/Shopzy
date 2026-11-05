import { Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";
import Navbar from "./Navbar";
import Logo from "../ui/Logo";
export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <aside className="fixed bottom-0 left-0 top-[73px] hidden w-64 bg-slate-950 p-5 text-slate-300 md:block">
        <Link to="/admin" className="mb-8 block text-white">
          <Logo admin />
        </Link>
        <nav className="space-y-2">
          {[
            [LayoutDashboard, "Dashboard", "/admin"],
            [Package, "Products", "/admin/products"],
            [ShoppingCart, "Orders", "/admin/orders"],
            [Users, "Users", "/admin/users"],
          ].map(([Icon, label, href]) => (
            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-800 hover:text-white"
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
    </>
  );
}
