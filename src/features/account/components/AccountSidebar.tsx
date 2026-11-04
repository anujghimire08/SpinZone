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
    ],
  },
];

const AccountSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-60">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      <nav className="flex flex-col gap-6">
        {navigation.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="px-3 text-xs font-semibold tracking-wider text-muted-foreground">
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
                    className={`rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AccountSidebar;
