import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <section className="bg-white px-4 py-0 pt-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-4 text-center md:space-y-6 lg:text-left">
            <h2 className="text-2xl text-gray-900 md:text-3xl lg:text-5xl">About Us</h2>

            {/* <p className="text-sm text-gray-500 md:text-xl">Explain platform vision and benefits</p> */}

            <p className="text-xs leading-relaxed text-gray-400 md:text-lg">
              Our mission is to connect sports enthusiasts, organizers, and communities through
              seamless event management.
            </p>
<Link to={"/events"}>
            <button className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-green-600">
              Learn More
            </button>
            </Link>
          </div>

          {/* Right Image Collage */}
          <div className="relative h-96">
            {/* Top Left Image */}
            <div className="absolute top-0 left-0 z-10 h-[45%] w-[45%] overflow-hidden rounded-lg shadow ring ring-gray-100">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/p-1.jpg"
                  alt="Sports event 1"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Top Right Image */}
            <div className="bg-accent absolute top-0 right-0 z-30 h-[50%] w-[50%] overflow-hidden rounded-lg shadow ring ring-gray-100">
              <div className="absolute inset-0 m-0.5 rounded-lg bg-green-500/30 backdrop-blur-sm">
                <img
                  src="/img/home/p-2.jpg"
                  alt="Sports event 2"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Bottom Center Image (Overlapping) */}
            <div className="bg-accent absolute bottom-10 left-1/2 z-20 h-[50%] w-[80%] -translate-x-1/2 overflow-hidden rounded-lg shadow ring ring-gray-100 md:bottom-0 md:h-[60%] md:w-[50%]">
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

export default AboutUs;
