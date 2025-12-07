module.exports = {
  // Run tests for all test files
  '**/__tests__/**/*.[jt]s?(x)': ['jest --bail --findRelatedTests'],
  
  // Run tests when source files change
  'app/**/*.{ts,tsx}': ['jest --bail --findRelatedTests'],
  
  // Run linting on TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
}
