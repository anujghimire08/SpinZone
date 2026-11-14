import Link from "next/link";
import Image from "@/features/admin/components/Image";
import { getCart } from "@/features/cart/queries/get-cart";

const CartPage = async () => {
  const result = await getCart();

  if (!result.success) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Unable to Load Cart</h1>

          <p className="mt-3 text-sm text-zinc-400">{result.error}</p>

          <a
            href="/products"
            className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
          >
            Continue Shopping →
          </a>
        </div>
      </main>
    );
  }

  const { items, totalItems, subtotal } = result.data;

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-6 py-16">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-violet-400"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>

          <h1 className="mt-7 text-3xl font-bold text-white">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Your next table tennis upgrade is waiting. Explore our collection
            and find the right equipment for your game.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-violet-600 px-7 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  const unavailableItems = items.filter(
    (item) => !item.isActive || item.availableStock < item.quantity,
  );

  const hasUnavailableItems = unavailableItems.length > 0;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Your Selection
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          Continue Shopping →
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const isUnavailable =
              !item.isActive || item.availableStock < item.quantity;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 sm:h-36 sm:w-36"
                  >
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 144px"
                      className="object-contain p-3"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-lg font-semibold text-white transition hover:text-violet-400"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-sm text-zinc-400">
                        {item.price < item.originalPrice && (
                          <span className="mr-2 line-through">
                            Rs. {item.originalPrice.toFixed(2)}
                          </span>
                        )}

                        <span className="font-medium text-zinc-200">
                          Rs. {item.price.toFixed(2)}
                        </span>
                        <span className="ml-1">/ unit</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-400">Quantity:</span>

                        <span className="rounded-lg border border-white/10 bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Item Subtotal</p>

                        <p className="mt-1 font-semibold text-white">
                          Rs. {item.itemSubtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isUnavailable && (
                  <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-sm text-red-400">
                      {!item.isActive
                        ? "This product is currently unavailable."
                        : item.availableStock === 0
                          ? "This product is out of stock."
                          : `Only ${item.availableStock} units are currently available.`}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <aside className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Items ({totalItems})</span>

              <span className="text-zinc-200">Rs. {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Shipping</span>

              <span className="text-zinc-500">Calculated at checkout</span>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Subtotal</span>

                <span className="text-xl font-bold text-violet-400">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {hasUnavailableItems && (
            <p className="mt-5 text-sm leading-6 text-red-400">
              Please review unavailable items before proceeding to checkout.
            </p>
          )}

          <button
            type="button"
            disabled={hasUnavailableItems}
            className="mt-7 w-full rounded-lg bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Proceed to Checkout
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
            Shipping charges and final pricing will be confirmed at checkout.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
