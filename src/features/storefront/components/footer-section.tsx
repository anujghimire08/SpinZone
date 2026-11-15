import Image from "@/features/admin/components/Image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-[#f7f7f5] text-zinc-950">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-20 lg:py-20">
          <div>
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

            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-600">
              A table tennis equipment store based in Nepal. Find the equipment
              you need for your next game.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex border-b border-violet-700 pb-2 text-sm font-semibold text-zinc-900 transition-colors hover:text-violet-700"
            >
              Shop all products
            </Link>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
              Shop
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-zinc-600 transition-colors hover:text-violet-700"
                >
                  All products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-zinc-600 transition-colors hover:text-violet-700"
                >
                  Shopping cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900">
              Your account
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/account"
                  className="text-sm text-zinc-600 transition-colors hover:text-violet-700"
                >
                  My account
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-sm text-zinc-600 transition-colors hover:text-violet-700"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-zinc-600 transition-colors hover:text-violet-700"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-200 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} SpinZone. All rights reserved.
          </p>

          <p className="text-xs text-zinc-500">Made for table tennis.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
