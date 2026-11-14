import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                SPIN<span className="text-violet-500 ml-1">ZONE</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
              Elevate your game with premium table tennis equipment. Built for
              players who value precision, performance, and passion.
            </p>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Play. Improve. Dominate.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Explore
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Account
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/account"
                  className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Our Philosophy
            </h3>

            <p className="mt-6 text-sm leading-7 text-zinc-400">
              Every point matters. Every detail counts. Find the equipment that
              helps you play your best game.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
            >
              Discover the collection
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.08] py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} SpinZone. All rights reserved.
          </p>

          <p className="text-xs font-medium tracking-wide text-zinc-500">
            MADE FOR THE LOVE OF THE GAME
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
