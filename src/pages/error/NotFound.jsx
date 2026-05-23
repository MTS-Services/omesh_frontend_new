import React from 'react';
import { Link } from 'react-router-dom'; // or use Next.js Link if using Next.js

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Error Code with Animation */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-gray-800 opacity-40">404</h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">Oops! Page Not Found</h2>

          <p className="text-gray-500">
            It might have been moved, deleted, or perhaps never existed in the first place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex transform items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Back to Homepage
          </Link>

          <button className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
