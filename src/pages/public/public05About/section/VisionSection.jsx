const VisionSection = () => {
  return (
    <section className="bg-gray-50 px-4 py-14 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="mb-4 text-2xl text-gray-900 md:mb-6 md:text-3xl lg:text-4xl">
              Our <span className="text-green-500">Vision</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base lg:text-lg">
              We envision becoming a leading sports event platform that empowers communities to stay
              active, compete, and grow together through technology.
            </p>
          </div>

          {/* Right Side - Image with Decorative Elements */}
          <div className="relative">
            {/* Image */}
            <img
              src="/img/home/vission.png"
              alt="Sports competition"
              className="h-auto w-[450px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
