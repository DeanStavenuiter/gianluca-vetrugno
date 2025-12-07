import { contactFormSchema } from '../validation';

describe('contactFormSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message with more than 10 characters',
    honey: '',
  };

  describe('name field validation', () => {
    it('should accept valid name', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject name shorter than 2 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        name: 'J',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain(
          'Name must be at least 2 characters'
        );
      }
    });

    it('should reject name longer than 100 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        name: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain(
          'Name is too long'
        );
      }
    });

    it('should accept name exactly 2 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        name: 'Jo',
      });
      expect(result.success).toBe(true);
    });

    it('should accept name exactly 100 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        name: 'A'.repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email field validation', () => {
    it('should accept valid email', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'no@domain',
        'spaces in@email.com',
      ];

      invalidEmails.forEach((email) => {
        const result = contactFormSchema.safeParse({
          ...validData,
          email,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept various valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
      ];

      validEmails.forEach((email) => {
        const result = contactFormSchema.safeParse({
          ...validData,
          email,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('subject field validation', () => {
    it('should accept valid subject', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject subject shorter than 3 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        subject: 'Hi',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.subject).toContain(
          'Subject must be at least 3 characters'
        );
      }
    });

    it('should reject subject longer than 200 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        subject: 'A'.repeat(201),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.subject).toContain(
          'Subject is too long'
        );
      }
    });

    it('should accept subject exactly 3 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        subject: 'Hey',
      });
      expect(result.success).toBe(true);
    });

    it('should accept subject exactly 200 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        subject: 'A'.repeat(200),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('message field validation', () => {
    it('should accept valid message', () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject message shorter than 10 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'Too short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.message).toContain(
          'Message must be at least 10 characters'
        );
      }
    });

    it('should reject message longer than 2000 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'A'.repeat(2001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.message).toContain(
          'Message is too long'
        );
      }
    });

    it('should accept message exactly 10 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: '1234567890',
      });
      expect(result.success).toBe(true);
    });

    it('should accept message exactly 2000 characters', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        message: 'A'.repeat(2000),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('honeypot field validation', () => {
    it('should accept empty honeypot field', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        honey: '',
      });
      expect(result.success).toBe(true);
    });

    it('should reject filled honeypot field (bot detection)', () => {
      const result = contactFormSchema.safeParse({
        ...validData,
        honey: 'spam',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.honey).toContain(
          'Invalid form submission'
        );
      }
    });
  });

  describe('multiple validation errors', () => {
    it('should return all validation errors when multiple fields are invalid', () => {
      const result = contactFormSchema.safeParse({
        name: 'J',
        email: 'invalid-email',
        subject: 'Hi',
        message: 'Short',
        honey: '',
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.email).toBeDefined();
        expect(errors.subject).toBeDefined();
        expect(errors.message).toBeDefined();
      }
    });
  });
});
