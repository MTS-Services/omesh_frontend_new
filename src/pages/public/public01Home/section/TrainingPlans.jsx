import React from 'react';
import { Link } from 'react-router-dom';

const plans = [
  {
    id: 1,
    title: 'Swimming Training Program',
    description: 'Build muscle and improve strength with guided workouts.',
    image: '/img/hero.jpg',
    featured: false,
    gradient: 'from-sky-300/90 to-sky-500/90',
  },
  {
    id: 2,
    title: 'Running Training Plan',
    description: 'Improve endurance with our expert-approved schedule.',
    image: '/img/hero.jpg',
    featured: true,
    gradient: 'from-orange-400 to-orange-400',
  },
  {
    id: 3,
    title: 'Cycling Endurance Plan',
    description: 'Boost your cycling stamina with structured training sessions.',
    image: '/img/hero.jpg',
    featured: false,
    gradient: 'from-gray-500/90 to-gray-700/90',
  },
];

const TrainingPlans = () => {
  return (
    <section className="bg-white px-4 pb-10 sm:px-6 md:pb-20 lg:px-8">
      {/* Heading */}
      <div className="mb-6 text-center md:mb-12">
        <h2 className="text-2xl text-gray-900 md:text-3xl lg:text-5xl">
          Training <span className="text-green-500">Plans</span>
        </h2>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Highlight training resources or plans for participants
        </p>
      </div>

      {/* Fan layout — mobile: stacked, desktop: side-by-side bottom-aligned */}
      <div className="">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 md:flex-row md:items-center md:justify-center md:gap-8">
          {/* first card */}
          {/* <div className="relative h-[45vh] flex-1 overflow-hidden rounded-xl shadow md:h-[60vh] md:flex-[0.4]">
            <img src="img/home/t-1.jpg" className="h-full w-full object-cover" />

            <div className="absolute bottom-0 flex h-[28%] w-full flex-col justify-start gap-2 bg-white/20 p-3 backdrop-blur-md md:h-[35%] md:gap-3 md:p-4">
              <div>
                <h2 className="text-lg font-semibold text-white md:text-2xl">Starter Plan</h2>
                <p className="mt-1 text-sm text-white/80 md:mt-2 md:text-lg">
                  Build your base endurance step by step.
                </p>
              </div>
              <Link
                to="/training-plans"
                className="rounded-lg bg-green-500 py-2 text-center text-sm font-medium text-white hover:bg-green-600 md:text-base"
              >
                View Plan
              </Link>
            </div>
          </div> */}

          {/* second card */}
          <div className="relative h-[10vh] flex-1 overflow-hidden rounded-xl shadow md:h-95 md:flex-[0.6] md:scale-105">
            <img src="img/home/t-2.jpg" className="h-full w-full " />

            <div className="absolute bottom-0 flex h-[10 vh] w-full flex-col justify-start  bg-white/20 p-2 backdrop-blur-md sm:h-[20vh] md:h-[24vh]  md:p-4 lg:h-[20vh]">
              <h2 className="text-lg font-semibold text-white md:text-2xl md:leading-snug">
                Running Training Plan
              </h2>
              <p className="mt-1 text-sm text-white/80 md:mt-2 md:text-lg">
                Improve endurance with our expert-approved schedule.
              </p>

              <Link
                to="/training-plans"
                className="rounded-lg bg-green-500 py-2.5 pb-2 text-center text-sm font-medium text-white mt-2 hover:bg-green-600 md:text-base"
              >
                View Plan
              </Link>
            </div>
          </div>

          {/* third card */}
          {/* <div className="relative h-[40vh] flex-1 overflow-hidden rounded-xl shadow md:h-[60vh] md:flex-[0.4]">
            <img src="img/home/t-3.jpg" className="h-full w-full object-cover" />

            <div className="absolute bottom-0 flex h-[25%] w-full flex-col justify-start gap-2 bg-white/20 p-3 backdrop-blur-md md:h-[35%] md:gap-3 md:p-4">
              <div>
                <h2 className="text-lg font-semibold text-white md:text-2xl">Pro Plan</h2>
                <p className="mt-1 text-sm text-white/80 md:mt-2 md:text-lg">
                  Push limits with advanced cycling routines.
                </p>
              </div>
              <Link
                to="/training-plans"
                className="rounded-lg bg-green-500 py-2 text-center text-sm font-medium text-white hover:bg-green-600 md:text-base"
              >
                View Plan
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default TrainingPlans;
