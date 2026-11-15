import Link from "next/link";
import Footer from "@/features/storefront/components/footer-section";
import Image from "@/features/admin/components/Image";

interface ShopLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ShopLayout = ({ children, modal }: ShopLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      {/* <div className="bg-violet-700 px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
        Equipment for the game you love
      </div> */}

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

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/account"
              className="group inline-flex items-center gap-3 border border-violet-700 px-5 py-3 text-sm font-semibold text-violet-700 transition-colors hover:border-violet-800 sm:px-6"
            >
              Account
            </Link>

            <Link
              href="/cart"
              className="group inline-flex items-center gap-3 bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800 sm:px-6"
            >
              Cart
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
