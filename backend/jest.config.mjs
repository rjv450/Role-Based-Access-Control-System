export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/models/', // Ignore the 'models' directory
    '<rootDir>/lib/',    // Ignore the 'lib' directory
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'text'],
};
