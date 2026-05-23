import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

const FaqView = () => {
  const [openIndex, setOpenIndex] = useState(2); // Third item open by default
  const [formData, setFormData] = useState({ email: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: 'How do I register for an event?',
      answer:
        'Browse our events page, select the event you want to join, and click "Register Now". Fill in your details and complete the payment to secure your spot.',
    },
    {
      question: 'What payment methods are available?',
      answer:
        'We accept PayPal and major credit cards. Organizers can also provide promo codes for offline payment options.',
    },
    {
      question: 'Can I register without a credit card?',
      answer:
        'Yes. You can pay offline, and the organizer can provide you with a promo code to complete your registration.',
    },
    {
      question: 'What is a promo code and how does it work?',
      answer:
        'A promo code is a unique code provided by event organizers that can be used for discounts or to complete offline registrations.',
    },
    {
      question: 'How do I know if an event is full?',
      answer:
        'Each event page displays the current capacity and available spots. When an event reaches capacity, registration will be closed.',
    },
    {
      question: 'Can organizers manage their own events?',
      answer:
        'Yes. Event organizers have access to a dashboard where they can manage registrations, track capacity, generate promo codes, and export participant data.',
    },
    {
      question: 'Can I track my registration?',
      answer:
        'Yes. After registering, you will receive a confirmation email with your registration details and can track your status through your account.',
    },
    {
      question: 'Can organizers export participant data?',
      answer:
        'Yes. Organizers can export participant lists in various formats for timing companies or event management purposes.',
    },
    {
      question: 'Is my payment secure?',
      answer:
        'Absolutely. All payments are processed through secure payment gateways with industry-standard encryption to protect your information.',
    },
    {
      question: 'Who should I contact for support?',
      answer:
        'For any questions or issues, please contact our support team at support@enduraevents.com or use the contact form on our website.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.details.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await request({
        method: 'POST',
        url: ENDPOINT.PUBLIC.CONTACT,
        data: {
          email: formData.email,
          description: formData.details,
        },
      });
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ email: '', details: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white px-4 py-14 md:py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          {/* Help Center Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2">
            <HelpCircle className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Help Center</span>
          </div>

          {/* Title */}
          <h1 className="mb-3 text-2xl text-gray-900 md:text-3xl lg:text-5xl">
            Frequently Asked <span className="text-green-500">Questions</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 md:text-base lg:text-lg">
            Find answers to common questions about events, registrations, payments, and more.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-sm"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-base font-medium text-gray-800 sm:text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-600" />
                )}
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 rounded-2xl border border-gray-300 bg-white px-8 py-10 text-center sm:px-12">
          {/* Heading */}
          <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            Still have questions?
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-sm text-gray-600 sm:text-base">
            If you couldn't find your answer, feel free to contact us anytime.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            {/* Email Input */}
            <div className="mb-4 text-left">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              />
            </div>

            {/* Details Textarea */}
            <div className="mb-4 text-left">
              <label
                htmlFor="details"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Tell us what you need help with..."
                rows="4"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 resize-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Contact Us'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FaqView;