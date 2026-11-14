import Link from "next/link";
import type { ReactNode } from "react";

interface ProductDetailsModalProps {
  children: ReactNode;
}

const ProductDetailsModal = ({ children }: ProductDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 pt-16 shadow-2xl sm:p-8 sm:pt-16"
      >
        <Link
          href="/products"
          aria-label="Close product details"
          className="absolute right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-xl text-white transition hover:bg-violet-600"
        >
          &times;
        </Link>
        {children}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
