import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type IconButtonVariant = 'default' | 'destructive';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name - there's no visible text on an icon-only button. */
  label: string;
  variant?: IconButtonVariant;
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  default: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  destructive: 'text-red-600 hover:bg-red-50 hover:text-red-700',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'default', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={clsx(
        // 44x44 minimum touch target (WCAG/Apple HIG guidance), even though the icon itself is
        // smaller. `shrink-0` matters here specifically: in a flex row inside a narrow table
        // column (e.g. the Actions column at a tablet-width viewport), a flex child shrinks
        // below its own fixed width by default unless told not to - which would silently
        // compress this back under the touch-target minimum.
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
});

export default IconButton;
