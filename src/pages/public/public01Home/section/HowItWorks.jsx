import {
  CalendarCheck2,
  ChartColumnDecreasing,
  Computer,
  FileCheckCorner,
  Timer,
} from 'lucide-react';
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Computer />,
      title: 'Sign Up & Browse Events',
      description: 'Create an account and explore upcoming sports events.',
    },
    {
      icon: <CalendarCheck2 />,
      title: 'Secure Payments',
      description: 'Pay online via PayPal or local bank, with automatic service fee.',
    },
    {
      icon: <ChartColumnDecreasing />,
      title: 'Organizer Dashboard',
      description: 'Manage registrations, promo codes, and event capacity easily.',
    },
    {
      icon: <Timer />,
      title: 'Participant List',
      description: 'Download participant lists for timing or other purposes.',
    },
  ];

  return (
    <section className="bg-slate-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-4 text-2xl text-gray-900 md:text-3xl lg:text-5xl">
            How It <span className="text-green-500">Works</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Explain the process for participants and organizers
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-400 text-white">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-xl">{step.title}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
