"use server";

import { transporter } from "./transporter";
import { contactFormSchema, type FormResult } from "./validation";

const sendContactForm = async (formData: FormData): Promise<FormResult> => {

  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const bot_field = formData.get("honey"); // Honeypot field

    // Honeypot check - if filled, it's likely a bot
    if (bot_field) {
      console.log("Honeypot triggered - potential bot submission");
      return { 
        error: "Invalid form submission",
        fieldErrors: null 
      };    
    }

    // Validate form data with Zod
    const validationResult = contactFormSchema.safeParse({
      name,
      email,
      subject,
      message,  
      honey: bot_field || "",
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        error: "Validation failed",
        fieldErrors: {
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
          subject: fieldErrors.subject?.[0],
          message: fieldErrors.message?.[0],
        },
      };
    }

    const validatedData = validationResult.data;

    // Send email
    await transporter.sendMail({
      from: "Gianluca Vetrugno <" + process.env.EMAIL_FROM! + ">",
      to: process.env.EMAIL_TO!,
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #1a1a1a;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0f0f0f; border: 1px solid #fee9ce33;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 48px 40px 32px; background-color: #0f0f0f; border-bottom: 2px solid #f84f3e;">
                      <h1 style="margin: 0; font-size: 42px; font-weight: 900; color: #f84f3e; text-transform: uppercase; letter-spacing: -1px; line-height: 1;">
                        NIEUW BERICHT
                      </h1>
                      <p style="margin: 12px 0 0; font-size: 16px; color: #fee9ce99; font-weight: 500;">
                        Nieuw bericht ontvangen via contact formulier
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      
                      <!-- Name -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 28px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 8px; font-size: 13px; color: #fee9ce99; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                              Naam
                            </p>
                            <p style="margin: 0; font-size: 20px; color: #fee9ce; font-weight: 500; line-height: 1.4;">
                              ${validatedData.name}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Email -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 28px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 8px; font-size: 13px; color: #fee9ce99; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                              E-mail
                            </p>
                            <p style="margin: 0; font-size: 20px; color: #fee9ce; font-weight: 500; line-height: 1.4;">
                              <a href="mailto:${validatedData.email}" style="color: #f84f3e; text-decoration: none;">${validatedData.email}</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Subject -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 28px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 8px; font-size: 13px; color: #fee9ce99; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                              Onderwerp
                            </p>
                            <p style="margin: 0; font-size: 20px; color: #fee9ce; font-weight: 500; line-height: 1.4;">
                              ${validatedData.subject}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td style="border-top: 1px solid #fee9ce33;"></td>
                        </tr>
                      </table>
                      
                      <!-- Message -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td>
                            <p style="margin: 0 0 12px; font-size: 13px; color: #fee9ce99; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                              Bericht
                            </p>
                            <p style="margin: 0; font-size: 18px; color: #fee9ce; line-height: 1.7; font-weight: 400; white-space: pre-wrap;">
                              ${validatedData.message.replace(/\n/g, '<br>')}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background-color: #0a0a0a; border-top: 1px solid #fee9ce33;">
                      <p style="margin: 0; font-size: 14px; color: #fee9ce66; text-align: center; line-height: 1.6;">
                        Dit bericht is verstuurd via het contact formulier<br>
                        <span style="color: #f84f3e; font-weight: 700;">gianlucavetrugno.com</span>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        NIEUW BERICHT - Contact Formulier
        =====================================
        
        NAAM
        ${validatedData.name}
        
        EMAIL
        ${validatedData.email}
        
        ONDERWERP
        ${validatedData.subject}
        
        BERICHT
        ${validatedData.message}
        
        ---
        Dit bericht is verstuurd via het contact formulier op gianluca-vetrugno.com
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { 
      error: "Failed to send message. Please try again later.",
      fieldErrors: null 
    };
  }
};

export default sendContactForm;
