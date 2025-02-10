import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  autoComplete?: string;
}

export default function AuthInput({
  id,
  label,
  type: initialType,
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  required = true,
  pattern,
  autoComplete,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const type = initialType === 'password' ? (showPassword ? 'text' : 'password') : initialType;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          pattern={pattern}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`
            block w-full rounded-md sm:text-sm
            ${Icon ? 'pr-10' : 'pr-3'}
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
        />
        {initialType === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-0 pl-3 flex items-center"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
