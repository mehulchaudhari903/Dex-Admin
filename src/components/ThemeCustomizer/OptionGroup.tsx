import React from 'react';

interface OptionGroupProps {
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
}

const OptionGroup: React.FC<OptionGroupProps> = ({ title, titleClassName = '', children }) => {
  return (
    <div className="mb-6">
      <h3 className={`text-sm font-semibold mb-3 ${titleClassName}`}>
        {title}
      </h3>
      {children}
    </div>
  );
};

export default OptionGroup;