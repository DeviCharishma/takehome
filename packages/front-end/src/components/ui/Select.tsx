import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className={clsx('relative', className)}>
      <select
        ref={ref}
        className="w-full appearance-none rounded-md border border-slate-300 bg-white py-3 pl-3 pr-8 text-sm text-slate-900 shadow-sm transition-colors duration-150 hover:border-slate-400 focus:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
});

export default Select;
