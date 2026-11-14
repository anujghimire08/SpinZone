import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        {/* Hero content */}
        <div className="relative z-10">
          <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Built for the game
          </span>

          <h1 className="mt-8 max-w-xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Elevate Your
            <span className="block text-violet-500">Table Tennis</span>
            Game.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-zinc-400 sm:text-lg">
            Discover quality table tennis equipment designed for precision,
            power, and performance.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-violet-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              Explore Collection
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-white/15 px-8 py-4 text-sm font-bold text-white transition hover:border-violet-500 hover:text-violet-400"
            >
              Shop Products
            </Link>
          </div>

          <div className="mt-14 flex gap-10">
            <div>
              <p className="text-2xl font-black">100%</p>
              <p className="mt-1 text-xs text-zinc-500">Game Focused</p>
            </div>

            <div>
              <p className="text-2xl font-black">Premium</p>
              <p className="mt-1 text-xs text-zinc-500">Equipment</p>
            </div>
          </div>
        </div>

        {/* Visual area */}
        <div className="relative flex min-h-[380px] items-center justify-center lg:min-h-[480px]">
          <div className="absolute h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative flex aspect-square w-full max-w-[460px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-zinc-800 via-zinc-900 to-violet-950/60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.22),transparent_55%)]" />

            <div className="relative text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-400">
                SpinZone
              </p>

              <p className="mt-5 text-6xl font-black tracking-tighter text-white/10 sm:text-8xl">
                SPIN
              </p>

              <p className="mt-2 text-sm font-medium tracking-[0.3em] text-zinc-400">
                PERFORMANCE SERIES
              </p>
            </div>

            <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full border border-violet-400/20" />
            <div className="absolute left-8 top-8 h-16 w-16 rounded-full border border-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
