import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-custom-hover hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white rounded-card shadow-custom transition-all duration-200 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
