/**
 * @jest-environment node
 */
import sendContactForm from '../send-contact-form';
import { transporter } from '../transporter';

// Mock the transporter
jest.mock('../transporter', () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

const mockTransporter = transporter as jest.Mocked<typeof transporter>;

describe('sendContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up environment variables
    process.env.EMAIL_FROM = 'noreply@example.com';
    process.env.EMAIL_TO = 'contact@example.com';
  });

  const createFormData = (data: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  describe('Validation', () => {
    it('should accept valid form data', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should reject form with invalid email', async () => {
      const formData = createFormData({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
      expect(result.fieldErrors?.email).toBeDefined();
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should reject form with short name', async () => {
      const formData = createFormData({
        name: 'J',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
      expect(result.fieldErrors?.name).toBe('Name must be at least 2 characters');
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should reject form with short subject', async () => {
      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hi',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
      expect(result.fieldErrors?.subject).toBe('Subject must be at least 3 characters');
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should reject form with short message', async () => {
      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Short',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
      expect(result.fieldErrors?.message).toBe('Message must be at least 10 characters');
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should return multiple field errors when multiple fields are invalid', async () => {
      const formData = createFormData({
        name: 'J',
        email: 'invalid-email',
        subject: 'Hi',
        message: 'Short',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
      expect(result.fieldErrors?.name).toBeDefined();
      expect(result.fieldErrors?.email).toBeDefined();
      expect(result.fieldErrors?.subject).toBeDefined();
      expect(result.fieldErrors?.message).toBeDefined();
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
  });

  describe('Honeypot Protection', () => {
    it('should reject form when honeypot field is filled', async () => {
      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: 'spam',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Invalid form submission');
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should accept form when honeypot field is empty', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });

  describe('Email Sending', () => {
    it('should send email with correct parameters', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      await sendContactForm(formData);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Gianluca Vetrugno <noreply@example.com>',
          to: 'contact@example.com',
          subject: 'Contact Form: Test Subject',
          html: expect.stringContaining('John Doe'),
          text: expect.stringContaining('John Doe'),
        })
      );
    });

    it('should include all form data in the email', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Business Inquiry',
        message: 'I would like to discuss a project with you.',
        honey: '',
      });

      await sendContactForm(formData);

      const emailCall = mockTransporter.sendMail.mock.calls[0][0];
      
      expect(emailCall.html).toContain('John Doe');
      expect(emailCall.html).toContain('john@example.com');
      expect(emailCall.html).toContain('Business Inquiry');
      expect(emailCall.html).toContain('I would like to discuss a project with you.');
      
      expect(emailCall.text).toContain('John Doe');
      expect(emailCall.text).toContain('john@example.com');
      expect(emailCall.text).toContain('Business Inquiry');
      expect(emailCall.text).toContain('I would like to discuss a project with you.');
    });

    it('should handle newlines in message correctly', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Line 1\nLine 2\nLine 3',
        honey: '',
      });

      await sendContactForm(formData);

      const emailCall = mockTransporter.sendMail.mock.calls[0][0];
      
      // HTML should have <br> tags
      expect(emailCall.html).toContain('Line 1<br>Line 2<br>Line 3');
      
      // Text should preserve newlines
      expect(emailCall.text).toContain('Line 1\nLine 2\nLine 3');
    });

    it('should return error when email sending fails', async () => {
      mockTransporter.sendMail.mockRejectedValueOnce(new Error('SMTP error'));

      const formData = createFormData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters',
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Failed to send message. Please try again later.');
      expect(result.fieldErrors).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing form fields', async () => {
      const formData = new FormData();

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
      expect(result.fieldErrors).toBeDefined();
    });

    it('should handle null values in form data', async () => {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('email', '');
      formData.append('subject', '');
      formData.append('message', '');
      formData.append('honey', '');

      const result = await sendContactForm(formData);

      expect(result.error).toBe('Validation failed');
    });

    it('should accept exactly minimum valid lengths', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'Jo', // exactly 2 characters
        email: 'test@example.com',
        subject: 'Hey', // exactly 3 characters
        message: '1234567890', // exactly 10 characters
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should accept maximum valid lengths', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as unknown as ReturnType<typeof mockTransporter.sendMail>);

      const formData = createFormData({
        name: 'A'.repeat(100), // exactly 100 characters
        email: 'test@example.com',
        subject: 'B'.repeat(200), // exactly 200 characters
        message: 'C'.repeat(2000), // exactly 2000 characters
        honey: '',
      });

      const result = await sendContactForm(formData);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });
});
