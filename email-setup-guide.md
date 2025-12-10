# Email Setup Guide - EmailJS Integration

This guide will help you set up email notifications for appointment bookings using EmailJS.

## What is EmailJS?

EmailJS is a free service that allows you to send emails directly from JavaScript without needing a backend server. It's perfect for client-side applications like this booking system.

## Setup Instructions

### Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add an Email Service

1. After logging in, go to the **Email Services** section
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Copy the **Service ID** (you'll need this later)

### Step 3: Create an Email Template

1. Go to the **Email Templates** section
2. Click **Create New Template**
3. Use this template structure:

**Subject:**
```
Appointment Confirmation - Booking #{{booking_id}}
```

**Content:**
```
Hello {{to_name}},

Thank you for booking an appointment with BookEasy!

Your appointment has been confirmed with the following details:

📅 Date: {{appointment_date}}
⏰ Time: {{appointment_time}}
👥 Number of People: {{number_of_people}}
📞 Phone: {{phone}}

📝 Appointment Details:
{{appointment_details}}

Booking ID: #{{booking_id}}

If you need to make any changes or cancel your appointment, please contact us.

Thank you for choosing BookEasy!

Best regards,
BookEasy Team
```

4. Save the template and copy the **Template ID**

### Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (also called API Key)
3. Copy this key

### Step 5: Update the Configuration

Open `script.js` and replace these values at the top of the file:

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID
```

**Example:**
```javascript
const EMAILJS_PUBLIC_KEY = 'abc123xyz789';
const EMAILJS_SERVICE_ID = 'service_gmail123';
const EMAILJS_TEMPLATE_ID = 'template_booking456';
```

### Step 6: Test the Email Functionality

1. Open `booking.html` in your browser
2. Fill out the booking form with a valid email address
3. Submit the form
4. Check your email inbox for the confirmation email

## Email Template Variables

The following variables are automatically sent to your email template:

- `{{to_email}}` - Customer's email address
- `{{to_name}}` - Customer's full name
- `{{appointment_date}}` - Formatted appointment date (e.g., "Monday, January 15, 2024")
- `{{appointment_time}}` - Formatted time (e.g., "02:00 PM")
- `{{number_of_people}}` - Number of people attending
- `{{appointment_details}}` - Appointment description/notes
- `{{phone}}` - Customer's phone number
- `{{booking_id}}` - Unique booking ID

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- 2 email services
- 2 email templates
- Basic support

For higher volume, consider upgrading to a paid plan.

## Troubleshooting

### Emails not sending?

1. Check browser console for errors (F12 → Console tab)
2. Verify all three IDs are correct in `script.js`
3. Make sure your EmailJS account is verified
4. Check your email service connection in EmailJS dashboard
5. Ensure you're not exceeding the free tier limit

### Emails going to spam?

1. Add your sending email to your contacts
2. Check spam folder and mark as "Not Spam"
3. Consider using a custom domain email (paid EmailJS feature)

## Alternative Email Solutions

If you prefer a different solution:

1. **Backend Integration** - Use Node.js with Nodemailer
2. **Formspree** - Another form-to-email service
3. **SendGrid** - Professional email API
4. **Mailgun** - Transactional email service

## Security Note

The EmailJS public key is safe to expose in client-side code. However, for production applications, consider:
- Rate limiting on the EmailJS dashboard
- CAPTCHA to prevent spam
- Backend validation for sensitive operations

## Support

For more help:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
