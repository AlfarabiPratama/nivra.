import { useEffect, useState } from 'react';

export const AnimatedPage = ({ children, className = '' }) => {
  return (
    <div className={`page-enter-blur ${className}`}>
      {children}
    </div>
  );
};

export const AnimatedCard = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`fade-slide-up ${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export const SkeletonLoader = ({ className = '', width = '100%', height = '20px' }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height }}
    />
  );
};
