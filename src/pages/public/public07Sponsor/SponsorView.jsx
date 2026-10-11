import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  HeartHandshake,
  Building2,
  HandCoins,
  Lock,
  Loader2,
  User,
  Phone,
  Mail,
  Ticket,
} from 'lucide-react';
import { createSponsorRequest } from '../../../features/public/sponsor/sponsorService';

const SUPPORT_TYPES = [
  {
    value: 'SPONSORSHIP',
    title: 'Corporate / Financial Sponsorship',
    description: 'Partner with an event as a sponsor.',
    icon: Building2,
  },
  {
    value: 'DONATION',
    title: 'Donation',
    description: 'Make a one-time donation to support an event.',
    icon: HandCoins,
  },
];

const PRESET_AMOUNTS = [25, 50, 100, 250];

const initialForm = {
  supportType: 'SPONSORSHIP',
  amount: '',
  name: '',
  phone: '',
  email: '',
  eventName: '',
  message: '',
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none';

const SponsorView = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNumber = Number(formData.amount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!(amountNumber > 0)) {
      toast.error('Please enter an amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createSponsorRequest({
        supportType: formData.supportType,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        eventName: formData.eventName.trim(),
        message: formData.message.trim(),
        amount: Number(amountNumber.toFixed(2)),
      });

      const paymentUrl = response?.data?.paymentUrl;
      if (!paymentUrl) {
        throw new Error('Could not start the payment. Please try again.');
      }
      window.location.href = paymentUrl;
    } catch (error) {
      toast.error(error?.message || 'Could not start the payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2">
            <HeartHandshake className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Support Our Events</span>
          </div>
          <h1 className="mb-3 text-2xl text-gray-900 md:text-3xl lg:text-5xl">
            Become a Sponsor /{' '}
            <span className="whitespace-nowrap text-green-500">Make a Donation</span>
          </h1>
          <p className="text-sm text-gray-500 md:text-base lg:text-lg">
            Tell us a little about yourself and how you'd like to support an event.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-8 shadow-sm sm:px-10"
        >
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-gray-800">
              1. How would you like to support? <span className="text-red-500">*</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {SUPPORT_TYPES.map(({ value, title, description, icon }) => {
                const Icon = icon;
                const active = formData.supportType === value;
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      active
                        ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="supportType"
                      value={value}
                      checked={active}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span
                      className={`rounded-lg p-2 ${
                        active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-gray-800">{title}</span>
                      <span className="mt-1 block text-xs text-gray-500">{description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <hr className="my-6 border-gray-100" />

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-800">
                2. Name / Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name or company name"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-800">
                  3. Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 868-XXX-XXXX"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800">
                  4. Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="eventName" className="mb-2 block text-sm font-semibold text-gray-800">
                5. Which event would you like to support?
              </label>
              <div className="relative">
                <Ticket className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Event name, or general support"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-800">
                6. Amount (USD) <span className="text-red-500">*</span>
              </p>
              <div className="mb-3 grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amount) => {
                  const active = amountNumber === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, amount: String(amount) }))}
                      className={`rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-500'
                      }`}
                    >
                      ${amount}
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Other amount"
                  className={`${inputClass} bg-white pl-8`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-800">
                7. Message / Additional Details
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your sponsorship or donation..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1FB356] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#188a47] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting to WiPay...
              </>
            ) : (
              `Continue to Payment${amountNumber > 0 ? ` · $${amountNumber.toFixed(2)}` : ''}`
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Lock className="h-3.5 w-3.5" />
            Secure payment powered by WiPay
          </p>
        </form>
      </div>
    </section>
  );
};

export default SponsorView;
