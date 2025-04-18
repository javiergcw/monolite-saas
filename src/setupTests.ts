import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock de ErrorNotification
jest.mock('./components/ErrorNotification', () => ({
  ErrorNotification: jest.fn(() => null)
}));

// Mock de ReactDOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Configuración global de tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 