import Link from "next/link";
import type { ReactNode } from "react";

interface ProductDetailsModalProps {
  children: ReactNode;
}

const ProductDetailsModal = ({ children }: ProductDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-3 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
        className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto border border-zinc-200 bg-[#f7f7f5] p-5 pt-5 shadow-2xl sm:p-8 sm:pt-16"
      >
        <Link
          href="/products"
          aria-label="Close product details"
          className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center border border-zinc-300 bg-white text-2xl leading-none text-zinc-700 transition-colors hover:border-violet-700 hover:bg-violet-700 hover:text-white"
        >
          &times;
        </Link>

        {children}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
