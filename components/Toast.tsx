import React, { useEffect } from 'react';
import { SuccessRateIcon, ErrorIcon } from './icons/Icons';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

const toastConfig = {
  success: {
    icon: SuccessRateIcon,
    iconColor: 'text-sentinel-green',
    borderColor: 'border-sentinel-green',
  },
  error: {
    icon: ErrorIcon,
    iconColor: 'text-sentinel-red',
    borderColor: 'border-sentinel-red',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`fixed top-5 right-5 z-50 flex items-center p-4 w-full max-w-xs text-sentinel-text-primary bg-sentinel-card rounded-lg shadow-2xl border-l-4 ${config.borderColor} animate-fade-in-right`}
    >
      <div className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 ${config.iconColor} bg-sentinel-main rounded-lg`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-sentinel-card text-sentinel-text-secondary hover:text-sentinel-text-primary rounded-lg focus:ring-2 focus:ring-sentinel-border p-1.5 hover:bg-sentinel-main inline-flex h-8 w-8"
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Toast;
