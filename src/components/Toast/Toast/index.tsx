import React, { useEffect } from 'react';

import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';
import { Container } from './styles';

import { ToastMessage, useToast } from '../../../hooks/toastContext';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

export const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  const icons = {
    info: <FiInfo size={24} />,
    success: <FiCheckCircle size={24} />,
    error: <FiAlertCircle size={24} />,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      style={style}
      type={message.type}
      hasDescription={Number(!!message.description)}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};
