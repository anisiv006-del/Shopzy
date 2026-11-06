import { ShoppingBag } from "lucide-react";

export default function Logo({ admin = false }) {
  return (
    <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-sm shadow-green-200">
        <ShoppingBag size={18} />
      </span>
      <span>{admin ? "Shopzy Admin" : "Shopzy"}</span>
    </span>
  );
}
