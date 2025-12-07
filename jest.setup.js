// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock GSAP for tests
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  fromTo: jest.fn(),
}))

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    getAll: jest.fn(() => []),
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null,
}))
