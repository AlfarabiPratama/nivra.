import clsx from 'clsx';

export const Button = ({ 
  children, 
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseStyles = 'font-mono text-xs uppercase tracking-widest transition-all duration-300 px-4 md:px-6 py-2 md:py-3 ripple haptic-feedback relative overflow-hidden';
  
  const variants = {
    primary: 'border border-(--text-main) bg-transparent text-(--text-main) hover:bg-(--text-main) hover:text-(--bg-color)',
    accent: 'border border-(--accent) bg-transparent text-(--accent) hover:bg-(--accent) hover:text-(--bg-color)',
    ghost: 'border border-transparent text-(--text-muted) hover:text-(--text-main) hover:border-(--text-main)',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      className={clsx(
        baseStyles, 
        variants[variant], 
        disabled && disabledStyles,
        'flex items-center justify-center gap-2',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin-slow">⏳</span>
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};
