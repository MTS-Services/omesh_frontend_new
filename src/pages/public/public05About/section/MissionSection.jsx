const MissionSection = () => {
  return (
    <section className="bg-white px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 md:gap-32 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-0 md:space-y-5">
            <h2 className="mb-2 text-2xl text-gray-900 md:text-3xl lg:text-5xl">
              Our <span className="text-green-500">Mission</span>
            </h2>
            <p className="text-sm text-gray-500 md:text-base">
              Endura Events is the trading name of Endura Sports Limited, a Trinidad and Tobago
              registered company dedicated to supporting the growth of sports, fitness, and
              community events.
            </p>

            <p className="text-sm text-gray-500 md:text-base">
              Our platform was created to simplify the event experience for both participants and
              organizers. Athletes can discover and register for events with ease, while organizers
              gain access to tools that help manage registrations, promotions, and participant
              engagement.
            </p>

            <p className="text-sm text-gray-500 md:text-base">
              In addition to event registration services, Endura Events offers access to event
              support solutions, including bib production, medal sourcing, and event infrastructure
              services.
            </p>

            <p className="text-sm text-gray-500 md:text-base">
              Powered by Powerhouse, our community-focused initiative, we are committed to
              encouraging active lifestyles, strengthening the endurance sports community, and
              helping organizers deliver memorable events.
            </p>

            <p className="text-sm text-gray-500 md:text-base">
              Whether you're taking part in your first event or organizing your next one, Endura
              Events is here to support your journey every step of the way.
            </p>
          </div>

          {/* Right Image Collage */}
          <div className="relative h-[400px]">
            {/* Top Left Image */}
            <div className="absolute top-0 left-0 z-10 h-[55%] w-[45%] overflow-hidden rounded-lg shadow ring ring-gray-100">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/p-1.jpg"
                  alt="Sports event 1"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Top Right Image */}
            <div className="bg-accent absolute top-0 right-0 z-30 h-[55%] w-[45%] overflow-hidden rounded-lg shadow ring ring-gray-100">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/p-2.jpg"
                  alt="Sports event 2"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Bottom Center Image (Overlapping) */}
            <div className="bg-accent absolute bottom-0 left-1/2 z-20 h-[55%] w-[80%] -translate-x-1/2 overflow-hidden rounded-lg shadow ring ring-gray-100 md:w-[55%]">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/p-3.jpg"
                  alt="Sports event 3"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

<section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">
    <div className="grid grid-cols-1 items-center justify-between gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left Side - Text Content */}
      <div className="order-2 lg:order-1">
        <h2 className="mb-6 text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl">
          Our Mission
        </h2>
        <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
          Our mission is to make sports event participation simple, accessible, and enjoyable for
          everyone. We aim to connect athletes, organizers, and communities through a powerful and
          user-friendly platform.
        </p>
      </div>

      {/* Right Side - Images */}
      <div className="order-1 lg:order-2">
        <div className="relative">
          {/* Top Image - Team huddle */}
          <div className="relative z-10 overflow-hidden">
            <img
              src="/img/home/mission2.jpg"
              alt="Sports team huddle"
              className="h-64 w-64 object-cover"
            />
          </div>

          {/* Bottom Image - Strategy planning */}
          <div className="absolute right-0 bottom-0 z-20 w-3/5 translate-y-8 overflow-hidden lg:translate-y-12">
            <img
              src="/img/home/mission1.jpg"
              alt="Strategy planning"
              className="h-44 w-44 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>;
