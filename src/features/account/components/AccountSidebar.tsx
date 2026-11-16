"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    title: "ACCOUNT",
    items: [
      {
        label: "Overview",
        href: "/account",
      },
      {
        label: "Profile",
        href: "/account/profile",
      },
    ],
  },
  {
    title: "SECURITY",
    items: [
      {
        label: "Sessions",
        href: "/account/sessions",
      },
      {
        label: "Password",
        href: "/account/password",
      },
    ],
  },
];

type AccountSidebarProps = {
  isAdmin: boolean;
};

const AccountSidebar = ({ isAdmin }: AccountSidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="mb-8 border-b border-zinc-200 pb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Settings
        </p>

        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          Account Settings
        </h2>

        <p className="mt-1 text-sm leading-6 text-zinc-500">
          Manage your account and security preferences.
        </p>
      </div>

      <nav aria-label="Account navigation" className="flex flex-col gap-7">
        {navigation.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="px-3 text-xs font-semibold tracking-[0.15em] text-zinc-400">
              {section.title}
            </h3>

            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-violet-700 bg-violet-50 text-violet-800"
                        : "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div className="flex flex-col gap-2">
            <h3 className="px-3 text-xs font-semibold tracking-[0.15em] text-zinc-400">
              ADMINISTRATION
            </h3>

            <Link
              href="/admin"
              aria-current={pathname.startsWith("/admin") ? "page" : undefined}
              className={`border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "border-violet-700 bg-violet-50 text-violet-800"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default AccountSidebar;
