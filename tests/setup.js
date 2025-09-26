import { jest } from '@jest/globals';

global.jest = jest;

jest.mock('d3', () => {
  const originalD3 = jest.requireActual('d3');
  
  const mockChainedMethods = () => {
    const mock = {
      append: jest.fn().mockReturnThis(),
      attr: jest.fn().mockReturnThis(),
      style: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      data: jest.fn().mockReturnThis(),
      enter: jest.fn().mockReturnThis(),
      exit: jest.fn().mockReturnThis(),
      remove: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      transition: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
      merge: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      call: jest.fn().mockReturnThis(),
      node: jest.fn().mockReturnValue(null),
      getBoundingClientRect: jest.fn().mockReturnValue({ width: 0, height: 0 }),
      path: jest.fn().mockReturnThis(),
      'marker-end': jest.fn().mockReturnThis(),
    };
    return mock;
  };

  return {
    ...originalD3,
    select: jest.fn(mockChainedMethods),
  };
});
