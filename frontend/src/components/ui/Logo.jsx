import { ShoppingBag } from "lucide-react";
export default function Logo({ admin = false }) {
  return (
    <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet text-white shadow-lg shadow-indigo-200">
        <ShoppingBag size={18} />
      </span>
      {admin ? "Shopzy Admin" : "Shopzy"}
    </span>
  );
}
