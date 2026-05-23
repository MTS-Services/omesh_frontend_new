import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* CTA Box */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center sm:px-12 md:py-12">
          {/* Heading */}
          <p className="mb-8 text-lg font-medium text-[#42444A] sm:text-2xl">
            Join our platform today and be part of exciting sports events and challenges.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/events"
              className="rounded-md bg-green-500 px-12 py-3 font-semibold text-white transition-colors hover:bg-green-600"
            >
              Explore Events
            </Link>
            <Link
              to="/events"
              className="rounded-md border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Goes to Events Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
