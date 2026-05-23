import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

const FAQsection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I register for an event?',
      answer:
        'Browse our events page, select the event you want to participate in, and click the "Register" button. Fill in your details and complete the payment process to confirm your registration.',
    },
    {
      question: 'Can I pay cash?',
      answer:
        'Yes, cash can be paid to the respective organizer, which you can then receive a promo code, or the organizer can then add you manually to the registration.',
    },
    {
      question: 'How do I get a promo code?',
      answer:
        'Promo codes are provided by event organizers and may be shared through their social media, newsletters, or partner promotions. Contact the event organizer directly for available promotional offers.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 text-center md:mb-10">
          <h2 className="mb-2 text-2xl text-gray-900 md:text-3xl lg:text-5xl">FAQ</h2>
          <p className="mt-2 text-sm text-gray-500 md:text-base">Answer common questions</p>
        </div>

        {/* FAQ Items */}
        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300 pb-0">
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="group flex w-full items-center justify-between py-4 text-left focus:outline-none"
              >
                <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700 md:text-2xl">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer with smooth transition */}
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="pb-4 text-xs leading-relaxed text-gray-600 md:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQsection;
