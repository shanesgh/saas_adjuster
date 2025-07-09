import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-secondary-700"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "block w-full rounded-md border border-secondary-300 shadow-sm pl-3 pr-10 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50",
            error && "border-error-500 focus:border-error-500 focus:ring-error-500",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';