import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const FooterTemplate = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Organizer Toolkit', href: '/organizer-toolkit' },
    { name: 'Training Plans', href: '/training-plans' },
    { name: 'About Us', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-[#42444A]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            {/* <div className="mb-4">
              <h2 className="text-4xl text-white">
                Endura <span className="text-[#4ade80]">Events</span>
              </h2>
            </div> */}

            <div className="mb-4">
              <Link to="/">
                <h1 className="text-4xl text-white">
                  Endura <span className="text-green-500">Events</span>
                </h1>
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-gray-300">
              Endura Events is a trading name of Endura Sports Limited
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Quick links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-[#4ade80]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Contact info</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                Email :{' '}
                <a
                  href="mailto:enduraevent@gmail.com"
                  className="text-gray-300 transition-colors hover:text-[#4ade80]"
                >
                  enduraevent@gmail.com{' '}
                </a>
              </li>
              <li></li>
              <li className="pt-1">Contact: +1868 4722526</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white text-white transition-colors hover:border-[#4ade80] hover:text-[#4ade80]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1FB356] py-3">
        <p className="text-center text-sm font-medium text-white">
          © 2026 Endura Events Platform. All rights reserved. 
        </p>
      </div>
    </footer>
  );
};

export default FooterTemplate;
