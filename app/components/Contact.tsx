"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import sendContactForm from "../lib/send-contact-form";
import { contactFormSchema } from "../lib/validation";

gsap.registerPlugin(ScrollTrigger);

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const Contact = () => {
  // Add styles to override autofill
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus,
      textarea:-webkit-autofill:active {
        -webkit-background-clip: text;
        -webkit-text-fill-color: #fee9ce !important;
        transition: background-color 5000s ease-in-out 0s;
        box-shadow: inset 0 0 20px 20px transparent !important;
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Animate heading on scroll
  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }

    // Animate form fields
    if (formRef.current) {
      const fields = formRef.current.querySelectorAll("input, textarea, button");
      gsap.fromTo(
        fields,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 75%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    // Client-side validation with Zod
    const validationResult = contactFormSchema.safeParse(formData);

    if (!validationResult.success) {
      // Show client-side validation errors
      const errors = validationResult.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        subject: errors.subject?.[0],
        message: errors.message?.[0],
      });
      console.log(errors);
      toast.error("Please fix the errors below");
      setIsSubmitting(false);
      return;
    }

    // If client-side validation passes, submit to server
    try {
      const result = await sendContactForm(new FormData(formRef.current as HTMLFormElement));
      
      if (result?.error) {
        // Handle server-side errors
        console.log(result);
        if (result.fieldErrors) {
          // Set field-specific errors from server
          setFieldErrors(result.fieldErrors);
          toast.error("Please fix the errors below");
        } else {
          // Set general error from server
          console.log(result.error);
          toast.error(result.error);
        }
        setIsSubmitting(false);
        return;
      }
      
      if (result?.success) {
        // Success!
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "", honey: "" });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full py-20 px-6 md:px-12 lg:px-24 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-tighter font-avantt-heavy uppercase text-[#f84f3e] mb-16"
        >
          Let&apos;s talk
        </h2>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-8 max-w-4xl"
        >
          {/* Honeypot Field - Hidden from users, visible to bots */}
          <input
            type="text"
            name="honey"
            value={formData.honey}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="nope"
            className="absolute -left-[9999px] opacity-0 pointer-events-none h-0 w-0"
            aria-hidden="true"
          />

          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.name ? 'border-[#f84f3e]' : 'border-[#fee9ce]/30'
              } py-4 text-[clamp(1.5rem,3vw,2.5rem)] font-avantt-medium text-[#fee9ce] placeholder:text-[#fee9ce]/40 focus:border-[#f84f3e] focus:outline-none transition-colors duration-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.name && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.email ? 'border-[#f84f3e]' : 'border-[#fee9ce]/30'
              } py-4 text-[clamp(1.5rem,3vw,2.5rem)] font-avantt-medium text-[#fee9ce] placeholder:text-[#fee9ce]/40 focus:border-[#f84f3e] focus:outline-none transition-colors duration-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.email && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div className="relative">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Subject"
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.subject ? 'border-[#f84f3e]' : 'border-[#fee9ce]/30'
              } py-4 text-[clamp(1.5rem,3vw,2.5rem)] font-avantt-medium text-[#fee9ce] placeholder:text-[#fee9ce]/40 focus:border-[#f84f3e] focus:outline-none transition-colors duration-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.subject && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              rows={6}
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.message ? 'border-[#f84f3e]' : 'border-[#fee9ce]/30'
              } py-4 text-[clamp(1.5rem,3vw,2.5rem)] font-avantt-medium text-[#fee9ce] placeholder:text-[#fee9ce]/40 focus:border-[#f84f3e] focus:outline-none transition-colors duration-300 resize-none [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.message && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-12 py-6 bg-[#f84f3e] text-white text-[clamp(1.5rem,2.5vw,2rem)] font-avantt-heavy uppercase tracking-tight overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-[#fee9ce] hover:text-[#f84f3e]"
            >
              <span className="relative z-10">
                {isSubmitting ? "Sending..." : "Send Message"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;