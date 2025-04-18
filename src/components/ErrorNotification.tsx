import React from 'react';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  background-color: #ff4444;
  color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

interface ErrorNotificationProps {
  message: string;
  type?: 'error';
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  return (
    <NotificationContainer>
      {message}
    </NotificationContainer>
  );
}; 