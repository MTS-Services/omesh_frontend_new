const HeroSection = () => {
  return (
    <section
      className="relative h-[400px] w-full bg-cover bg-center bg-no-repeat px-4 py-14 text-white sm:h-[450px] md:py-24 lg:h-[500px]"
      style={{
        backgroundImage: `url('/img/home/a-hero.jpg')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold text-white sm:text-5xl md:text-4xl lg:text-6xl">
          About Our Sports Platform
        </h1>
        <p className="max-w-3xl text-base text-white/90 sm:text-lg lg:text-xl">
          Connecting athletes, organizers, and communities through seamless sports event management.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
