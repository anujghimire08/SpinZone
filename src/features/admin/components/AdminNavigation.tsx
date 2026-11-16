"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Inventory", href: "/admin/inventory" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
];

const AdminNavigation = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="border-b border-zinc-200">
      <div className="flex gap-7 overflow-x-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-violet-700 text-violet-700"
                  : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-950"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminNavigation;
