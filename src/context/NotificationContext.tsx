import React, { createContext, useContext, useState, type ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  title?: string;
  message: string;
  type?: NotificationType;
  confirmText?: string;
  onConfirm?: () => void;
}

interface NotificationContextType {
  showNotification: (options: NotificationOptions) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<NotificationOptions | null>(null);

  const showNotification = (newOptions: NotificationOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const hideNotification = () => {
    setIsOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {isOpen && options && (
        <NotificationModal 
          isOpen={isOpen} 
          onClose={hideNotification} 
          {...options} 
        />
      )}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationModalProps extends NotificationOptions {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  onClose, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'Got it',
  onConfirm 
}) => {
  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    info: <Info className="w-12 h-12 text-brand-blue" />,
    warning: <AlertTriangle className="w-12 h-12 text-brand-orange" />
  };

  const colors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    info: 'bg-brand-blue/5',
    warning: 'bg-brand-orange/5'
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-scale-up">
        <div className={`p-10 text-center ${colors[type]}`}>
          <div className="flex justify-center mb-6">
            {icons[type]}
          </div>
          {title && (
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
              {title}
            </h3>
          )}
          <p className="text-gray-600 font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <div className="p-6 bg-white flex justify-center">
          <button 
            onClick={handleConfirm}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 ${
              type === 'error' ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' :
              type === 'success' ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20' :
              'bg-brand-blue hover:bg-brand-dark text-white shadow-brand-blue/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
