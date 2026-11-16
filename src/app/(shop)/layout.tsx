import Link from "next/link";
import { UserRound, ShoppingCart } from "lucide-react";
import Footer from "@/features/storefront/components/footer-section";
import Image from "@/features/admin/components/Image";
import { db } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-guard";

interface ShopLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ShopLayout = async ({ children, modal }: ShopLayoutProps) => {
  const session = await getCurrentSession();
  const user_id = session?.user.id;
  const customer = await db.customer.findUnique({
    where: {
      user_id,
    },
    select: {
      id: true,
    },
  });

  const customer_id = customer?.id;
  const res = await db.cartItem.aggregate({
    where: {
      cart: {
        customer_id,
      },
    },
    _sum: {
      quantity: true,
    },
  });

  const items = res._sum.quantity ?? 0;
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-[#f7f7f5]">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="shrink-0">
            <Image
              src="https://ik.imagekit.io/webdevanuj/spinzone/Brand/navlogolight.png"
              alt="SpinZone"
              width={150}
              height={50}
              priority
              className="h-auto w-32 object-contain sm:w-36"
            />
          </Link>

          <div className="flex items-center gap-5 sm:gap-6">
            <Link
              href="/account"
              aria-label="Account"
              className="text-zinc-700 transition-colors hover:text-violet-700"
            >
              <UserRound size={22} strokeWidth={1.8} />
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative text-zinc-700 transition-colors hover:text-violet-700"
            >
              <ShoppingCart size={22} strokeWidth={1.8} />
              <sup className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-semibold leading-none text-white">
                {items}
              </sup>
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-[60vh]">
        {children}
        {modal}
      </main>

      <Footer />
    </div>
  );
};

export default ShopLayout;
