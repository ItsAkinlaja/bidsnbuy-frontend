import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface BreadcrumbContextType {
  customTitle: string;
  setCustomTitle: (title: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customTitle, setCustomTitle] = useState('');

  return (
    <BreadcrumbContext.Provider value={{ customTitle, setCustomTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};
