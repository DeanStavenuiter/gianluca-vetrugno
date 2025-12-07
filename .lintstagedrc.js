module.exports = {
  // Run form submit test only
  'app/lib/__tests__/send-contact-form.test.ts': ['jest --bail --passWithNoTests'],
  
  // Run linting on TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
}
