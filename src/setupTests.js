import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// A universal proxy-based mock for chained function calls (like D3)
const createChainableMock = () => {
  // The function that will be proxied.
  const func = () => {};

  const proxy = new Proxy(func, {
    get: (target, prop) => {
      // When any property is accessed, return the proxy itself.
      // This allows for infinite chaining.
      return proxy;
    },
    apply: (target, thisArg, argumentsList) => {
      // When the proxy is called as a function, return the proxy itself.
      // This allows for chains like .call().another()
      return proxy;
    },
  });

  return proxy;
};

// Mock D3 with the universal chainable mock
jest.mock('d3', () => createChainableMock());

// Mock for Chart.js
// This creates a global Chart object that Jest can use.
global.Chart = class {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.update = jest.fn();
    this.destroy = jest.fn();
  }
  // Mock static methods like register, which is used by Chart.js
  static register = jest.fn();
};