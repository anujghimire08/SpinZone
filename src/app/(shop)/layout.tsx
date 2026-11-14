import Image from "next/image";
import Footer from "@/features/storefront/components/footer-section";
import Link from "next/link";

interface ShopLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ShopLayout = ({ children, modal }: ShopLayoutProps) => {
  return (
    <>
      <div className="relative overflow-hidden border-b border-violet-400/20 bg-violet-600 px-4 py-2.5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:text-xs sm:tracking-[0.2em]">
          Elevate your game.
          <span className="mx-2 text-violet-200/70">/</span>
          Discover premium table tennis equipment.
        </p>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-zinc-950 text-white">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-6 lg:h-20">
          <Link
            href="/"
            aria-label="SpinZone home"
            className="shrink-0 transition-opacity duration-200 hover:opacity-80"
          >
            <Image
              src="/nav-logo.png"
              alt="SpinZone"
              width={120}
              height={40}
              priority
              className="h-auto w-[90px] object-contain sm:w-[110px]"
            />
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-violet-400"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-violet-400"
            >
              Shop
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/account"
              aria-label="My account"
              className="group flex items-center gap-2 text-zinc-400 transition-colors duration-200 hover:text-violet-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </svg>

              <span className="hidden text-sm font-medium sm:inline">
                Account
              </span>
            </Link>

            <Link
              href="/cart"
              className="group inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-950/30 transition-all duration-200 hover:border-violet-300/40 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-950/40 sm:px-5 sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              <span>Cart</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-zinc-950 text-white">{children}</main>

      {modal}

      <Footer />
    </>
  );
};

export default ShopLayout;
