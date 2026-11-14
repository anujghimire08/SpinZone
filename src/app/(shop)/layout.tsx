import Link from "next/link";

interface ShopLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ShopLayout = ({ children, modal }: ShopLayoutProps) => {
  return (
    <>
      <div className="bg-violet-600 px-4 py-2 text-center text-xs font-medium text-white">
        Elevate your game. Discover premium table tennis equipment.
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950 text-white">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-black tracking-tight">
            <img src="/logo.png" alt="logo" width={100} height={20} />
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-300 md:flex">
            <Link href="/" className="transition hover:text-violet-400">
              Home
            </Link>
            <Link href="/products" className="transition hover:text-violet-400">
              Shop
            </Link>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link href="/account" className="transition hover:text-violet-400">
              Account
            </Link>
            <Link
              href="/cart"
              className="rounded-full bg-violet-600 px-5 py-2.5 font-semibold transition hover:bg-violet-500"
            >
              Cart
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-zinc-950 text-white">{children}</main>

      {modal}

      <footer className="border-t border-white/10 bg-zinc-950 px-6 py-10 text-center text-sm text-zinc-400">
        <p className="font-bold tracking-wide text-white">SPINZONE</p>
        <p className="mt-2">Built for players. Driven by performance.</p>
        <p className="mt-4">
          &copy; {new Date().getFullYear()} SpinZone. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default ShopLayout;
