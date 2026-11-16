import Link from "next/link";
import Image from "@/features/admin/components/Image";
import { getCart } from "@/features/cart/queries/get-cart";
import CartItemActions from "@/features/storefront/components/CartItemActions";

const CartPage = async () => {
  const result = await getCart();

  if (!result.success) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-950">
            Unable to load cart
          </h1>

          <p className="mt-3 text-sm text-zinc-500">{result.error}</p>

          <Link
            href="/products"
            className="mt-6 inline-flex bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const { items, totalItems, subtotal, cart_id } = result.data;

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-6 py-16">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border border-violet-700/20 bg-violet-700/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-violet-700"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-zinc-950">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Your next table tennis upgrade is waiting. Explore our collection
            and find the right equipment for your game.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center justify-center bg-violet-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
          >
            Explore products
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
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-zinc-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-700 sm:text-xs">
            Your selection
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-zinc-950 sm:text-4xl">
            Shopping cart
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-violet-700 hover:decoration-violet-700"
        >
          Continue shopping
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
                className="relative border border-zinc-200 bg-white p-4 pt-14 sm:p-5 sm:pt-14"
              >
                <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
                  <CartItemActions
                    cart_id={String(cart_id)}
                    productId={item.productId}
                    productName={item.name}
                    quantity={item.quantity}
                    availableStock={item.availableStock}
                  />
                </div>

                <div className="flex flex-col gap-5 sm:flex-row">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#f0f0ed] sm:h-36 sm:w-36"
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
                        className="text-lg font-semibold tracking-tight text-zinc-950 transition-colors hover:text-violet-700"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-sm text-zinc-500">
                        {item.price < item.originalPrice && (
                          <span className="mr-2 line-through">
                            Rs. {item.originalPrice.toFixed(2)}
                          </span>
                        )}

                        <span className="font-semibold text-zinc-900">
                          Rs. {item.price.toFixed(2)}
                        </span>

                        <span className="ml-1">/ unit</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500">Quantity:</span>

                        <span className="border border-zinc-200 bg-[#f7f7f5] px-4 py-2 text-sm font-medium text-zinc-900">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Item subtotal</p>

                        <p className="mt-1 font-semibold text-zinc-950">
                          Rs. {item.itemSubtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isUnavailable && (
                  <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
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

        <aside className="border border-zinc-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">
            Order summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Items ({totalItems})</span>

              <span className="font-medium text-zinc-900">
                Rs. {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-zinc-500">Shipping</span>

              <span className="text-right text-zinc-500">
                Calculated at checkout
              </span>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-zinc-950">Subtotal</span>

                <span className="text-xl font-bold text-violet-700">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {hasUnavailableItems && (
            <p className="mt-5 text-sm leading-6 text-red-700">
              Please review unavailable items before proceeding to checkout.
            </p>
          )}

          <button
            type="button"
            disabled={hasUnavailableItems}
            className="mt-7 w-full bg-violet-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Proceed to checkout
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
