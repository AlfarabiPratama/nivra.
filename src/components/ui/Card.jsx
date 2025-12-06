import clsx from 'clsx';

export const Card = ({ 
  children, 
  variant = 'solid', 
  className = '',
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-(--card-color) p-4 md:p-6',
        variant === 'dashed' ? 'dashed-border' : 'solid-border',
        'border-(--border-color)',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
