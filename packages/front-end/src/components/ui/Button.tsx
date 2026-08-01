import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 disabled:hover:bg-primary-600',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:hover:bg-white',
  destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:hover:bg-red-600',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:hover:bg-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm gap-1.5',
  // `md`'s vertical padding (12px + 20px line-height + 12px) lands exactly on the 44px
  // minimum touch target - this is the size used for every primary user-facing action.
  md: 'px-4 py-3 text-sm gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-150',
        'active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
});

export default Button;
