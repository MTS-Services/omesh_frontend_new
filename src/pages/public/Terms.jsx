import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const termsData = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using Endura Events ("Platform", "Website", "we", "our", or "us"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.',
  },
  {
    title: 'About the Platform',
    body: 'Endura Events is an online event discovery and registration platform that allows users to discover sporting and fitness events, register for events hosted by third-party organizers, access training plans and athlete-related content, and purchase products or services offered through the platform. We act primarily as a technology and registration platform.',
  },
  {
    title: 'Event Organizers',
    body: 'Event organizers are independently responsible for event planning and execution, event safety and logistics, accuracy of event information, merchandise sales and fulfillment, prize distribution, refunds where applicable, and compliance with local laws and regulations. Endura Events is not the organizer of every event listed on the platform unless explicitly stated.',
  },
  {
    title: 'Merchandise Disclaimer',
    body: 'Any merchandise sold by event organizers, sponsors, vendors, or third parties through or alongside events listed on the platform remains the sole responsibility of the respective seller. Endura Events and Endura Sports Limited are not responsible for product quality, sizing, delivery delays, defects, exchanges, refunds, or disputes between buyers and sellers.',
  },
  {
    title: 'Payments',
    body: 'By making a payment through the platform, users agree that registration fees may be processed through third-party payment providers, some fees may be non-refundable unless stated otherwise by the organizer, and processing fees may apply.',
  },
  {
    title: 'User Accounts',
    body: 'Users are responsible for maintaining the confidentiality of their account, providing accurate information, and ensuring login credentials remain secure.',
  },
  {
    title: 'Assumption of Risk',
    body: 'Participation in sporting and fitness activities carries inherent risks, including injury, illness, or death. Participants acknowledge and accept these risks voluntarily.',
  },
  {
    title: 'Intellectual Property',
    body: 'All platform branding, logos, graphics, website content, and software remain the property of Endura Sports Limited unless otherwise stated.',
  },
  {
    title: 'Third-Party Links and Services',
    body: 'The platform may contain links to third-party websites, vendors, sponsors, or services. Endura Events is not responsible for third-party content, websites, or policies.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the maximum extent permitted by law, Endura Sports Limited and Endura Events shall not be liable for event cancellations, injuries, merchandise disputes, technical interruptions, or losses arising from use of the platform.',
  },
  {
    title: 'Changes to Terms',
    body: 'We may update these Terms & Conditions at any time without prior notice. Continued use of the platform after updates constitutes acceptance of the revised terms.',
  },
  {
    title: 'Governing Law',
    body: 'These Terms shall be governed by the laws of Trinidad and Tobago.',
  },
  {
    title: 'Contact',
    body: null,
    isContact: true,
  },
];

const privacyData = [
  {
    title: 'Introduction',
    body: 'This Privacy Policy explains how Endura Events and Endura Sports Limited collect, use, and protect your personal information when using the platform.',
  },
  {
    title: 'Information We Collect',
    body: 'We may collect names, email addresses, phone numbers, emergency contacts, payment-related information, registration details, training preferences, browser information, IP addresses, and analytics data.',
  },
  {
    title: 'How We Use Your Information',
    body: 'Collected information may be used to process registrations, communicate event updates, send confirmation emails, improve platform functionality, provide customer support, and prevent fraud.',
  },
  {
    title: 'Sharing Information with Organizers',
    body: 'Relevant registration information may be shared with event organizers for operational purposes. Organizers are independently responsible for their handling of participant data.',
  },
  {
    title: 'Payments',
    body: 'Payments are processed through secure third-party providers. We do not store full payment card details on our servers.',
  },
  {
    title: 'Cookies and Analytics',
    body: 'We may use cookies and analytics tools to improve user experience, understand website traffic, monitor performance, and personalize content.',
  },
  {
    title: 'Data Security',
    body: 'We implement reasonable safeguards to protect user information. However, no online platform can guarantee absolute security.',
  },
  {
    title: 'Third-Party Services',
    body: 'The platform may integrate with payment gateways, email providers, analytics platforms, and other third-party services that maintain their own privacy policies.',
  },
  {
    title: 'User Rights',
    body: 'Users may request access to, correction of, or deletion of their personal information where applicable.',
  },
  {
    title: "Children's Privacy",
    body: 'The platform is not intended for children under 13 without parental or guardian supervision.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy periodically. Continued use of the platform after updates constitutes acceptance of the revised policy.',
  },
  {
    title: 'Contact',
    body: null,
    isContact: true,
  },
];

const PolicyItem = ({ index, title, body, isContact }) => (
  <div className="flex gap-2 md:gap-4 py-5 border-b border-gray-100 last:border-b-0 items-start">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base  font-semibold text-green-700 mt-0.5">
      {index}
    </div>
    <div>
      <p className="text-base md:text-lg font- text-gray-800 mb-1">{title}</p>
      {isContact ? (
        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
          For inquiries, contact{' '}
          <a href="mailto:support@enduraevents.com" className="text-green-600 font-medium hover:underline">
            support@enduraevents.com
          </a>{' '}
          or visit{' '}
          <a href="https://www.enduraevents.com" className="text-green-600 font-medium hover:underline">
            www.enduraevents.com
          </a>
          .
        </p>
      ) : (
        <p className="text-sm md:text-base text-gray-500 leading-relaxed">{body}</p>
      )}
    </div>
  </div>
);

const Terms = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto w-full max-w-7xl">

        {/* Hero */}
        <div
          className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a6b3a 0%, #2d9d5c 60%, #3dbd72 100%)' }}
        >
          {/* Decorative circles */}
          <div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              top: -50,
              right: -50,
              background: 'rgba(255,255,255,0.07)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              bottom: -30,
              left: '35%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />

          <div className="relative">
            <p className="text-sm font-semibold  text-green-200 uppercase mb-2">
              Endura Sports Limited
            </p>
            <h1
              className="text-white mb-1"
              style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', lineHeight: 1.1 }}
            >
              Terms &amp; Privacy
            </h1>
            <p className="text-sm text-green-200 mt-1">Last updated: May 20, 2026</p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-white/85 px-4 py-2 rounded-full border border-white/25 hover:bg-white/10 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Notice banner */}
        {/* <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl px-4 py-3 mb-6 text-sm text-green-800 leading-relaxed">
          By using the Endura Events platform, you agree to both the Terms &amp; Conditions and Privacy Policy outlined below.
        </div> */}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['terms', 'privacy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-base md:text-lg font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-green-700 border-b-2 border-green-600 bg-green-50/60'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="px-4 md:px-6 py-2">
            {activeTab === 'terms'
              ? termsData.map((item, i) => (
                  <PolicyItem key={i} index={i + 1} {...item} />
                ))
              : privacyData.map((item, i) => (
                  <PolicyItem key={i} index={i + 1} {...item} />
                ))}
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 py-4 border-t border-gray-100 text-center text-sm text-gray-400">
            © Endura Sports Limited — All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;