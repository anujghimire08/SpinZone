import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#f7f7f5] text-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(24,24,27,0.045) 1px, transparent 1px)",
          backgroundSize: "90px 100%",
          maskImage: "linear-gradient(to bottom, black, transparent 95%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[580px] max-w-7xl items-center px-5 py-2 sm:px-6 lg:min-h-[610px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 ">
          <h1 className="mt-7 max-w-2xl text-[clamp(3.5rem,7vw,6.5rem)]  font-bold leading-[0.91] tracking-[-0.04em] text-zinc-950">
            Elevate Your
            <span className="block text-violet-700">Table Tennis</span>
            <span className="block">Game.</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-zinc-600 sm:text-base">
            Find table tennis equipment that fits your game. Explore rackets,
            rubbers, and more at SpinZone.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="/products"
              className="group inline-flex items-center gap-4 bg-violet-700 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
            >
              Shop collection
            </Link>

            <span className="text-xs font-medium text-zinc-500">
              Equipment for table tennis players
            </span>
          </div>

          <div className="mt-12 hidden items-center gap-7 border-t border-zinc-200 pt-6 sm:flex">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-zinc-900">
                SPINZONE
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                Table tennis equipment
              </p>
            </div>

            <span className="h-8 w-px bg-zinc-300" />

            <p className="max-w-[190px] text-[11px] leading-5 text-zinc-500">
              Rackets, rubbers, and playing essentials.
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[340px] items-center justify-center sm:min-h-[460px] lg:min-h-[540px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-300/70"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-700/15"
          />

          <div className="relative h-[340px] w-full sm:h-[460px] lg:h-[540px]">
            <Image
              src="/hero-racket.png"
              alt="Table tennis racket"
              fill
              priority
              draggable={false}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain drop-shadow-[0_25px_25px_rgba(24,24,27,0.16)]"
            />
          </div>

          <div className="absolute bottom-4 right-2 hidden border-l border-violet-700 pl-4 sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              The game starts here
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">SpinZone</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
