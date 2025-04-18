import { ErrorNotification } from './../components/ErrorNotification';
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
      const errorElement = React.createElement(ErrorNotification, {
        message,
        type: 'error'
      });
      this.root.render(errorElement);
    }
  }
}

export const notificationService = NotificationService.getInstance(); 