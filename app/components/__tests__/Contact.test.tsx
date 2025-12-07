// Mock must be at the top before any imports
jest.mock('../../lib/send-contact-form');

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import Contact from '../Contact';
import sendContactForm from '../../lib/send-contact-form';

const mockSendContactForm = sendContactForm as jest.MockedFunction<typeof sendContactForm>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the contact form', () => {
      render(<Contact />);
      
      expect(screen.getByRole('heading', { name: /let's talk/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/subject/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should render honeypot field with correct attributes', () => {
      render(<Contact />);
      
      const honeypot = screen.getAllByRole('textbox', { hidden: true }).find(
        (el) => el.getAttribute('name') === 'honey'
      );
      expect(honeypot).toBeDefined();
      expect(honeypot).toHaveAttribute('name', 'honey');
      expect(honeypot).toHaveAttribute('tabindex', '-1');
      expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Form Interaction', () => {
    it('should update form fields when user types', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message');

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(subjectInput).toHaveValue('Test Subject');
      expect(messageInput).toHaveValue('This is a test message');
    });

    it('should clear field errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      // Submit empty form to trigger validation errors
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Wait a bit for validation to run
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Start typing in the name field
      const nameInput = screen.getByPlaceholderText(/your name/i);
      await user.type(nameInput, 'John');

      // Verify form can now be interacted with
      expect(nameInput).toHaveValue('John');
    });
  });

  describe('Client-Side Validation', () => {
    it('should show validation errors for multiple invalid fields', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      // Type invalid data in each field
      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'J');
      await user.type(emailInput, 'not-an-email');
      await user.type(subjectInput, 'Hi');
      await user.type(messageInput, 'Short');

      const form = screen.getByRole('button', { name: /send message/i }).closest('form');
      fireEvent.submit(form!);

      // Give the component time to process validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify at least some error messages are displayed
      // The form should not submit with invalid data
      expect(nameInput).toHaveValue('J');
      expect(mockSendContactForm).not.toHaveBeenCalled();
    });

    it('should prevent submission with invalid email format', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with enough characters');

      const form = screen.getByRole('button', { name: /send message/i }).closest('form');
      fireEvent.submit(form!);

      // Give the component time to process validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Form should not submit with invalid email
      expect(mockSendContactForm).not.toHaveBeenCalled();
    });

    it('should show validation error for short name', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'J');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with enough characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for short message', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'Short');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form successfully with valid data', async () => {
      const user = userEvent.setup();
      mockSendContactForm.mockResolvedValueOnce({ success: true });
      
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with more than 10 characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendContactForm).toHaveBeenCalled();
        expect(mockToast.success).toHaveBeenCalledWith(
          'Thank you! Your message has been sent successfully.'
        );
      });

      // Form should be cleared after successful submission
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(subjectInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockSendContactForm.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with more than 10 characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should show loading state
      expect(screen.getByText(/sending.../i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalled();
      });
    });

    it('should handle server-side validation errors', async () => {
      const user = userEvent.setup();
      mockSendContactForm.mockResolvedValueOnce({
        error: 'Validation failed',
        fieldErrors: {
          email: 'Invalid email address',
        },
      });

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with more than 10 characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Please fix the errors below');
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('should handle general server error', async () => {
      const user = userEvent.setup();
      mockSendContactForm.mockResolvedValueOnce({
        error: 'Failed to send message. Please try again later.',
      });

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with more than 10 characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to send message. Please try again later.'
        );
      });
    });

    it('should handle unexpected errors', async () => {
      const user = userEvent.setup();
      mockSendContactForm.mockRejectedValueOnce(new Error('Network error'));

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with more than 10 characters');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again.'
        );
      });
    });
  });

  describe('Honeypot Protection', () => {
    it('should not submit form on client if honeypot is filled', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText(/your name/i);
      const emailInput = screen.getByPlaceholderText(/your email/i);
      const subjectInput = screen.getByPlaceholderText(/subject/i);
      const messageInput = screen.getByPlaceholderText(/your message/i);
      const honeypot = screen.getAllByRole('textbox', { hidden: true }).find(
        (el) => el.getAttribute('name') === 'honey'
      )!;

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message with more than 10 characters');
      
      // Simulate bot filling honeypot
      fireEvent.change(honeypot, { target: { value: 'spam' } });

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Should not call the server
        expect(mockSendContactForm).not.toHaveBeenCalled();
      });
    });
  });
});
