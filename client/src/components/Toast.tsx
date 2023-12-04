import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  showToast: boolean;
  setShowToast: any;
}

const Toast: React.FC<ToastProps> = ({ message, showToast, setShowToast }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast();
      }, 3000); 
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md transition-opacity ${
        showToast ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Toast;
