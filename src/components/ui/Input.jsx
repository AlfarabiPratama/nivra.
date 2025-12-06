import clsx from 'clsx';

export const Input = ({ 
  className = '',
  type = 'text',
  variant = 'underline',
  ...props 
}) => {
  const baseStyles = 'font-mono text-sm bg-transparent text-(text-main) placeholder:text-(text-muted) focus:outline-none transition-all duration-300';
  
  const variants = {
    underline: 'border-b border-dashed border-(border-color) focus:border-solid focus:border-(accent) pb-2',
    box: 'border border-dashed border-(border-color) focus:border-solid focus:border-(accent) p-3',
  };

  return (
    <input
      type={type}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};

