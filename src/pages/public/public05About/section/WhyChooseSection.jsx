import { CheckCircle2 } from 'lucide-react';

const WhyChooseSection = () => {
  const benefits = [
    'User-friendly and modern interface',
    'Real-time event tracking',
    'Flexible registration system with promo codes',
    'Designed for both participants and organizers',
    'Secure and reliable payment integration',
  ];

  return (
    <section className="bg-white px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 md:gap-32 lg:grid-cols-2">
          {/* Left Content */}
          <div className="relative h-[400px]">
            {/* Top Left Image */}
            <div className="absolute top-0 left-0 z-10 h-[55%] w-[45%] overflow-hidden rounded-lg shadow ring ring-gray-100">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/bigstock.jpg"
                  alt="Sports event 1"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Top Right Image */}
            <div className="bg-accent absolute top-0 right-0 z-30 h-[55%] w-[45%] overflow-hidden rounded-lg shadow ring ring-gray-100">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/premium.avif"
                  alt="Sports event 2"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Bottom Center Image (Overlapping) */}
            <div className="bg-accent absolute bottom-0 left-1/2 z-20 h-[55%] w-[85%] -translate-x-1/2 overflow-hidden rounded-lg shadow ring ring-gray-100 md:w-[55%]">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/premium_photo.avif"
                  alt="Sports event 3"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Image Collage */}

          <div className="space-y-4">
            <h2 className="mb-8 text-2xl text-gray-900 md:text-3xl lg:text-4xl">
              Why <span className="text-green-500">Choose</span> Our Platform?
            </h2>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
                  <p className="text-sm text-gray-500 md:text-base lg:text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
