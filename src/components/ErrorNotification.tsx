import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ErrorNotificationProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  duration?: number;
}

const NotificationContainer = styled.div<{ type: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  background-color: ${props => {
    switch (props.type) {
      case 'error':
        return '#ff4444';
      case 'warning':
        return '#ffbb33';
      case 'info':
        return '#33b5e5';
      default:
        return '#ff4444';
    }
  }};
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 99999999;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
  word-wrap: break-word;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  type = 'error',
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <NotificationContainer type={type}>
      {message}
    </NotificationContainer>
  );
}; 