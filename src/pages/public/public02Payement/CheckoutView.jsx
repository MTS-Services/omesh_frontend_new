import React, { useState } from 'react';
import { InputField, SelectField } from '../../../components/ui/forms';
import { Button } from '../../../components/ui/buttons';

const CheckoutView = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    age: '',
    dateOfBirth: '',
    teamClub: '',
    promoCode: '',
  });

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const orderSummary = {
    subtotal: 22.16,
    processingFee: 1.55,
    total: 23.71,
  };

  return (
    <div className=" bg-white py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white  md:p-8 ">
              <h1 className="mb-8  text-2xl text-gray-900 md:text-3xl lg:text-5xl">Payment Details</h1>

              <form className="space-y-6">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="First Name"
                    placeholder=""
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                  />
                  <InputField
                    label="Last Name"
                    placeholder=""
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                  />
                </div>

                {/* Email */}
                <InputField
                  label="Email"
                  type="email"
                  placeholder="enter your email..."
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />

                {/* Phone Number */}
                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="enter your phone number..."
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  required
                />

                {/* Gender & Age */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SelectField
                    label="Gender"
                    options={genderOptions}
                    value={formData.gender}
                    onChange={handleInputChange('gender')}
                    required
                  />
                  <InputField
                    label="Age"
                    type="number"
                    placeholder=""
                    value={formData.age}
                    onChange={handleInputChange('age')}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <InputField
                  label="Date of Birth"
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange('dateOfBirth')}
                  required
                />

                {/* Team / Club */}
                <InputField
                  label="Team / Club (optional)"
                  placeholder=""
                  value={formData.teamClub}
                  onChange={handleInputChange('teamClub')}
                />
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6 md:mt-5.5 rounded-lg  sm:p-6 ">
              {/* Order Summary Box */}
              <div className="space-y-3 sm:space-y-4 border border-gray-300 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between text-sm sm:text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="text-green-500 font-medium">USD{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base text-gray-700">
                  <span>Processing Fee</span>
                  <span className="text-green-500 font-medium">USD{orderSummary.processingFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-900">
                  <span>Total Fee</span>
                  <span className="text-green-500">USD{orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-sm font-medium text-gray-700">Promo Code</label>

                <div className="flex w-full flex-row items-center gap-1 rounded-xl border border-gray-300 bg-white p-0.5">
                  <input
                    type="text"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-500 transition focus:outline-none focus:ring-0 sm:px-4 sm:py-2.5"
                    value={formData.promoCode}
                    onChange={handleInputChange('promoCode')}
                    placeholder="Enter code"
                  />
                  <button className="flex-shrink-0 whitespace-nowrap rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-600 active:bg-green-700 sm:px-6 sm:py-2.5">
                    Apply
                  </button>
                </div>

                {/* Confirm Button */}
                <button className="w-full rounded-lg bg-green-500 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-green-600 active:bg-green-700">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
