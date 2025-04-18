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