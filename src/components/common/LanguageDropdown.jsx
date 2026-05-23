// src/components/LanguageDropdown.jsx
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useOutsideClick from '../../hooks/useOutsideClick';
import { Check, ChevronDown } from 'lucide-react';
import getFlagEmoji from './FlagIcon';

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Language configuration
  const languages = [
    { code: 'en', name: 'English', countryCode: 'US', nativeName: 'English' },
    { code: 'es', name: 'Spanish', countryCode: 'ES', nativeName: 'Español' },
    { code: 'it', name: 'Italian', countryCode: 'IT', nativeName: 'Italiano' },
    { code: 'fr', name: 'French', countryCode: 'FR', nativeName: 'Français' },
    { code: 'de', name: 'German', countryCode: 'DE', nativeName: 'Deutsch' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];
  useOutsideClick(dropdownRef, () => setIsOpen(false));
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-all duration-200 hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
      >
        <span className="overflow-hidden rounded shadow-sm">
          {getFlagEmoji(currentLanguage.countryCode)}
        </span>
        <span className="font-medium text-gray-700">{currentLanguage.nativeName}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="animate-fadeIn absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <div className="max-h-96 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-150 hover:bg-gray-50 ${i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} `}
              >
                <span className="overflow-hidden rounded shadow-sm">
                  {getFlagEmoji(language.countryCode)}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {i18n.language === language.code && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
