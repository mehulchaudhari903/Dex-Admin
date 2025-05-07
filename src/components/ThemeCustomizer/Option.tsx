import React from 'react';

interface OptionProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

const Option: React.FC<OptionProps> = ({ icon, label, active, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        p-3 rounded-lg cursor-pointer
        border-2
        ${active ? 'border-blue-500' : 'border-transparent'}
        ${className}
        transition-all duration-200
        hover:scale-105
      `}
    >
      <div className="text-2xl mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium">
        {label}
      </span>
    </div>
  );
};

export default Option; 