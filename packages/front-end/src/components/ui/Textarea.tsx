import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { hasError, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors duration-150 placeholder:text-slate-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:bg-slate-100 disabled:text-slate-400',
        hasError
          ? 'border-red-400 focus-visible:ring-red-500'
          : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus-visible:ring-primary-500',
        className,
      )}
      {...props}
    />
  );
});

export default Textarea;
