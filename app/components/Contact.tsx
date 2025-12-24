"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { toast } from "sonner";
import sendContactForm from "../lib/send-contact-form";
import { contactFormSchema } from "../lib/validation";

gsap.registerPlugin(ScrollTrigger, SplitText);

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const Contact = () => {
  // Add styles to override autofill
  useEffect(() => {
    const style = document.createElement("style");
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
    if (!headingRef.current) return;

    const titleElement = headingRef.current;
    let title: SplitText | null = null;

    const ctx = gsap.context(() => {
      title = new SplitText(titleElement, { type: "chars" });

      // Set initial state (hidden)
      gsap.set(title.chars, {
        opacity: 0,
        y: -50,
      });

      // Create scroll-triggered animation (also runs on load if already in view)
      gsap.to(title.chars, {
        opacity: 1,
        y: 0,
        ease: "back.out(1.7)",
        stagger: {
          from: "center",
          each: 0.06,
        },
        scrollTrigger: {
          trigger: titleElement,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => {
      title?.revert();
      ctx.revert();
    };
  }, []);

  // Animate form fields and labels
  useEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      const formEl = formRef.current;
      if (!formEl) return;

      const fields = formEl.querySelectorAll("input, textarea, button");
      const labels = formEl.querySelectorAll("label");

      // Non-scrub "enter" animations so they work on page load (e.g. /contact)
      gsap.fromTo(
        labels,
        {
          x: -30,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formEl,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

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
            trigger: formEl,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
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
      const result = await sendContactForm(
        new FormData(formRef.current as HTMLFormElement)
      );

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
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          honey: "",
        });
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
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-[clamp(2.5rem,8vw,4rem)] leading-[0.9] font-avantt-heavy uppercase text-(--header-text-color) mb-16 tracking-[0.12em]"
        >
          Let&apos;s talk
        </h2>

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
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
            <label
              htmlFor="name"
              className="block text-[clamp(0.875rem,1.5vw,1rem)] font-avantt-medium text-(--primary-text-color)/70 uppercase tracking-wider mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.name ? "border-[#f84f3e]" : "border-[#fee9ce]/30"
              } py-4 font-avantt-medium text-(--primary-text-color)  placeholder:text-(--primary-text-color)/40 focus:border-(--header-text-color) focus:outline-none transition-colors duration-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.name && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-[clamp(0.875rem,1.5vw,1rem)] font-avantt-medium text-(--primary-text-color)/70 uppercase tracking-wider mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.email ? "border-[#f84f3e]" : "border-[#fee9ce]/30"
              } py-4 font-avantt-medium text-(--primary-text-color)  placeholder:text-(--primary-text-color)/40 focus:border-(--header-text-color) focus:outline-none transition-colors duration-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.email && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div className="relative">
            <label
              htmlFor="subject"
              className="block text-[clamp(0.875rem,1.5vw,1rem)] font-avantt-medium text-(--primary-text-color)/70 uppercase tracking-wider mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.subject ? "border-[#f84f3e]" : "border-[#fee9ce]/30"
              } py-4 font-avantt-medium text-(--primary-text-color)  placeholder:text-(--primary-text-color)/40 focus:border-(--header-text-color) focus:outline-none transition-colors duration-300 [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
            />
            {fieldErrors.subject && (
              <p className="text-[clamp(1rem,1.5vw,1.2rem)] font-avantt-medium text-[#f84f3e] mt-2">
                {fieldErrors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="relative">
            <label
              htmlFor="message"
              className="block text-[clamp(0.875rem,1.5vw,1rem)] font-avantt-medium text-(--primary-text-color)/70 uppercase tracking-wider mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={3}
              className={`w-full bg-transparent border-b-2 ${
                fieldErrors.message ? "border-[#f84f3e]" : "border-[#fee9ce]/30"
              } py-4 font-avantt-medium text-(--primary-text-color)  placeholder:text-(--primary-text-color)/40 focus:border-(--header-text-color) focus:outline-none transition-colors duration-300 resize-none [&:-webkit-autofill]:[-webkit-text-fill-color:#fee9ce] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_500px_transparent_inset] [&:-webkit-autofill]:bg-transparent`}
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
              className="group relative px-5 py-3 bg-(--header-text-color) hover:rounded-lg text-[#0a0a0a] text-[clamp(1.5rem,2.5vw,2rem)] font-avantt-heavy uppercase tracking-tight overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-[border-radius,background-color,transform,box-shadow] duration-500 ease-out hover:bg-[#b08d5e] hover:text-[#0a0a0a] hover:-translate-y-px hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
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
