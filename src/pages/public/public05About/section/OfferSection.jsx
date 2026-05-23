import { Calendar, Grid, CreditCard, Share2 } from 'lucide-react';

const OfferSection = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Event Registration',
      description: 'Browse and register for sports events quickly and easily.',
    },
    {
      icon: Grid,
      title: 'Organizer Dashboard',
      description: 'Manage events, track registrations, and monitor capacity in real-time.',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Pay online via PayPal or use promo codes for offline payments.',
    },
    {
      icon: Share2,
      title: 'Data Export',
      description: 'Export participant lists easily for timing companies or event management.',
    },
  ];

  return (
    <section className="bg-gray-50 px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h2 className="mb-8 text-center text-2xl text-gray-900 md:mb-12 md:text-3xl lg:text-4xl">
          What We <span className="text-green-500">Offer</span>
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center transition-shadow hover:shadow-md md:p-8"
              >
                {/* Icon Container */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-300 bg-white">
                  <Icon className="h-8 w-8 text-gray-700" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-base font-semibold text-gray-800 md:text-lg">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
