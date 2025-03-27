import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({
  value: '',
  onValueChange: () => {}
});

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className = '', children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className} role="tablist">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  return (
    <div className={`flex space-x-1 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className = '', children, onClick }) => {
  const context = React.useContext(TabsContext);
  
  const isActive = context.value === value;
  
  const handleClick = () => {
    context.onValueChange(value);
    if (onClick) onClick();
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`py-2 px-4 text-sm font-medium 
        ${isActive 
          ? 'text-yellow-600 border-b-2 border-yellow-600' 
          : 'text-gray-500 hover:text-gray-700'
        } ${className}`}
      aria-selected={isActive}
      role="tab"
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className = '', children }) => {
  const context = React.useContext(TabsContext);
  
  if (context.value !== value) {
    return null;
  }
  
  return (
    <div
      className={`mt-2 ${className}`}
      role="tabpanel"
    >
      {children}
    </div>
  );
}; 