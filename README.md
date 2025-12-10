# BookEasy - Online Appointment Booking System

A modern, responsive website for booking online appointments with a clean and professional design.

## Features

✅ **Homepage** - Welcoming landing page with "Book Appointment" button
✅ **Booking Form** - Complete appointment scheduling with:
  - Date picker with calendar
  - Time slot selection (dropdown)
  - Automatic day of week display
  - Number of people input
  - Appointment details textarea
  - Contact information (name, email, phone)

✅ **Confirmation Modal** - Shows all booking details after submission
✅ **Admin Login** - Secure login system with:
  - Username and password authentication
  - Remember me functionality
  - Password visibility toggle
  - Session management

✅ **Admin Dashboard** - View and manage all appointments with:
  - Statistics cards (total bookings, today's appointments, total people)
  - Complete bookings table
  - Delete individual bookings
  - Clear all bookings option
  - Logout functionality

✅ **Responsive Design** - Mobile-friendly using Tailwind CSS
✅ **Local Storage** - All bookings saved in browser localStorage
✅ **Email Confirmation Simulation** - Thank you message displayed

## How to Use

### For Customers:
1. Open `index.html` in your web browser
2. Click "Book Appointment" button
3. Fill in the booking form with your details
4. Submit to see confirmation
5. Check your email for confirmation message

### For Admins:
1. Click "Admin" in the navigation menu
2. Login with credentials:
   - **Username:** kshatriya302
   - **Password:** 0978
3. View and manage all bookings
4. Click "Logout" when done

### Email Setup:
1. Follow the instructions in `email-setup-guide.md`
2. Create a free EmailJS account
3. Configure your email service and template
4. Update the credentials in `script.js`

## File Structure

```
├── index.html              # Homepage
├── booking.html            # Booking form page
├── login.html              # Admin login page
├── admin.html              # Admin dashboard
├── script.js               # JavaScript functionality
├── styles.css              # Custom CSS styles
├── README.md               # Documentation
└── email-setup-guide.md    # Email configuration guide
```

## Admin Credentials

**Default Login:**
- Username: `kshatriya302`
- Password: `0978`

**Note:** In a production environment, credentials should be stored securely on a server with proper encryption and authentication mechanisms.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS (CDN)
- Font Awesome Icons (CDN)
- LocalStorage API
- EmailJS (Email notifications)

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Email Notifications

✅ **Automatic email confirmations** are sent to customers after booking
- Includes all appointment details
- Professional email template
- Powered by EmailJS (free tier: 200 emails/month)

**Setup Required:** See `email-setup-guide.md` for complete instructions

## Future Enhancements

- Backend integration (Node.js/PHP)
- Database storage (MySQL/MongoDB)
- SMS reminders
- Payment integration
- User authentication
- Booking cancellation/rescheduling
- Calendar sync (Google Calendar, Outlook)

## License

Free to use and modify for personal or commercial projects.
