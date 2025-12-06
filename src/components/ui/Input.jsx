import clsx from 'clsx';

export const Input = ({ 
  className = '',
  type = 'text',
  variant = 'underline',
  ...props 
}) => {
  const baseStyles = 'font-mono text-sm bg-transparent text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all duration-300';
  
  const variants = {
    underline: 'border-b border-dashed border-[var(--border-color)] focus:border-solid focus:border-[var(--accent)] pb-2',
    box: 'border border-dashed border-[var(--border-color)] focus:border-solid focus:border-[var(--accent)] p-3',
  };

  return (
    <input
      type={type}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};
