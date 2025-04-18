import { createRoot } from 'react-dom/client';
import React from 'react';

class NotificationService {
  private static instance: NotificationService;
  private container: HTMLDivElement | null = null;
  private root: any = null;

  private constructor() {
    this.initializeContainer();
  }

  private initializeContainer(): void {
    if (typeof document !== 'undefined') {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public showError(message: string): void {
    if (this.root) {
      const errorElement = React.createElement('div', {
        style: {
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px',
          backgroundColor: '#ff4444',
          color: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          zIndex: '1000'
        }
      }, message);
      this.root.render(errorElement);
    }
  }
}

export const notificationService = NotificationService.getInstance(); 