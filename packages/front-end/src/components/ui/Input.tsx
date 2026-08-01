import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  leadingIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError, leadingIcon, className, ...props },
  ref,
) {
  return (
    // `className` lands here (the wrapper), not the <input> - callers need it for layout
    // (e.g. `flex-1` in a toolbar row), not to override the input's own fixed visual styling.
    // `min-w-0` matters when this sits in a flex row (e.g. next to the sort <select>): without
    // it, a flex child won't shrink below its content's intrinsic width.
    <div className={clsx('relative min-w-0', className)}>
      {leadingIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        className={clsx(
          // `py-3` (not `py-2`) so the field's total height clears the 44px touch-target minimum.
          'w-full rounded-md border bg-white py-3 text-sm text-slate-900 shadow-sm transition-colors duration-150 placeholder:text-slate-400',
          leadingIcon ? 'pl-9 pr-3' : 'px-3',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'disabled:bg-slate-100 disabled:text-slate-400',
          hasError
            ? 'border-red-400 focus-visible:ring-red-500'
            : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus-visible:ring-primary-500',
        )}
        {...props}
      />
    </div>
  );
});

export default Input;
