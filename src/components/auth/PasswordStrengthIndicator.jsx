import React from 'react';
import { calculatePasswordStrength, getPasswordRequirements } from '../../utils/registerValidation';

/**
 * PasswordStrengthIndicator Component
 * Displays visual feedback for password strength
 */
const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const { strength, label, color } = calculatePasswordStrength(password);
  const requirements = getPasswordRequirements(password);

  const getTextColor = () => {
    if (strength >= 4) return 'text-green-600';
    if (strength >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mt-2">
      {/* Strength Label and Bar */}
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-gray-600">Strength:</span>
        <span className={`text-xs font-medium ${getTextColor()}`}>{label}</span>
      </div>

      {/* Strength Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Requirements Checklist */}
      <div className="mt-2 gap-2 space-y-0.5 text-xs text-gray-500 md:flex">
        <RequirementItem label="Lowercase letter" isMet={requirements.hasLowerCase} />
        <RequirementItem label="Uppercase letter" isMet={requirements.hasUpperCase} />
        <RequirementItem label="Number" isMet={requirements.hasNumber} />
        <RequirementItem label="Special character" isMet={requirements.hasSpecialChar} />
        <RequirementItem label="At least 8 characters" isMet={requirements.hasMinLength} />
      </div>
    </div>
  );
};

/**
 * RequirementItem Component
 * Individual requirement with check indicator
 */
const RequirementItem = ({ label, isMet }) => {
  return (
    <div className="flex items-center gap-1">
      {isMet ? (
        <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="h-3 w-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span className={isMet ? 'text-green-600' : ''}>{label}</span>
    </div>
  );
};

export default PasswordStrengthIndicator;
