# Testing Setup

This project includes comprehensive tests for the contact form functionality that run automatically on every commit.

## Test Structure

### Test Files

- **`app/lib/__tests__/validation.test.ts`** - Tests for Zod validation schema
  - Name field validation (min/max length)
  - Email format validation
  - Subject field validation
  - Message field validation
  - Honeypot field validation (bot protection)
  - Multiple validation errors

- **`app/components/__tests__/Contact.test.tsx`** - Tests for Contact component
  - Component rendering
  - Form interaction
  - Client-side validation
  - Form submission (success and error cases)
  - Server-side error handling
  - Honeypot protection

- **`app/lib/__tests__/send-contact-form.test.ts`** - Tests for server action
  - Server-side validation
  - Honeypot protection
  - Email sending functionality
  - Error handling
  - Edge cases

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Pre-commit Hooks

Tests are automatically run on every commit via Husky and lint-staged:

- **Husky** - Git hooks manager
- **lint-staged** - Runs tests only on staged files

### Configuration

- `.husky/pre-commit` - Pre-commit hook configuration
- `.lintstagedrc.js` - Lint-staged configuration

The pre-commit hook will:
1. Run Jest tests on changed files
2. Run ESLint on TypeScript/JavaScript files
3. Prevent commit if tests fail or linting errors exist

## Test Coverage

Current test coverage includes:
- ✅ 51 passing tests
- ✅ Validation schema tests (21 tests)
- ✅ Contact component tests (14 tests)  
- ✅ Server action tests (16 tests)

## Technologies Used

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **Husky** - Git hooks
- **lint-staged** - Run commands on staged files

## Mocking

The following are mocked in tests:

- GSAP animations
- Next.js navigation hooks
- Sonner toast notifications
- AWS SES email transporter

## Adding New Tests

1. Create test file in `__tests__` directory next to the file being tested
2. Follow existing naming convention: `filename.test.ts` or `filename.test.tsx`
3. Import and mock necessary dependencies
4. Write descriptive test cases using `describe` and `it` blocks
5. Tests will automatically run on commit

## Continuous Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Run linter
  run: npm run lint
```

## Troubleshooting

If tests fail to run:

1. Check that all dependencies are installed: `npm install`
2. Clear Jest cache: `npx jest --clearCache`
3. Ensure Node.js version is compatible (Node 18+)
4. Check for TypeScript errors: `npx tsc --noEmit`

If pre-commit hook doesn't run:

1. Reinstall Husky: `npm run prepare`
2. Check `.husky/pre-commit` has execute permissions
3. Ensure Git hooks are enabled: `git config core.hooksPath .husky`
