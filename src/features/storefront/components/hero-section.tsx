import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-90px)] items-center overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-10 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:py-8">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Made for the game
          </span>

          <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Elevate Your
            <span className="block text-violet-500">Table Tennis</span>
            Game.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Discover premium table tennis equipment built for players who demand
            control, speed, and performance.
          </p>

          <div className="mt-7">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 rounded-full bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              Explore Collection
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="mt-9 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 sm:text-xs">
            Equipment for every level of play
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[90px]" />

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-zinc-900 via-zinc-950 to-violet-950/30 p-5 sm:p-7">
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">
                Featured equipment
              </span>

              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-violet-400">
                Performance
              </span>
            </div>
            <div className="relative mx-auto mt-3 aspect-[4/3] w-full max-w-[330px] select-none">
              <Image
                draggable={false}
                src="/hero-racket.png"
                alt="Premium table tennis racket"
                fill
                priority
                sizes="(max-width: 768px) 85vw, 400px"
                className="object-contain drop-shadow-[0_20px_30px_rgba(139,92,246,0.18)]"
              />
            </div>
            {/* Product information */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/[0.08] pt-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  SpinZone collection
                </p>
                <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
                  Built for Performance
                </h2>
              </div>

              <Link
                href="/products"
                aria-label="Browse table tennis products"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-violet-500 hover:bg-violet-600"
              >
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
