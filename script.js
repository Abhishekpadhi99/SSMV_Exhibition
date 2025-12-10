// Database Management System
class BookingDatabase {
    constructor() {
        this.storageKey = 'ssmv_bookings_database';
        this.init();
    }

    init() {
        // Initialize database if it doesn't exist
        if (!localStorage.getItem(this.storageKey)) {
            this.saveToStorage([]);
        }
    }

    // Get all bookings from storage
    getAllBookings() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading bookings from storage:', error);
            return [];
        }
    }

    // Save bookings to storage
    saveToStorage(bookings) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(bookings));
            return true;
        } catch (error) {
            console.error('Error saving bookings to storage:', error);
            return false;
        }
    }

    // Add a new booking
    addBooking(bookingData) {
        try {
            const bookings = this.getAllBookings();
            const newBooking = {
                id: Date.now() + Math.random(), // More unique ID
                ...bookingData,
                bookedAt: new Date().toISOString(),
                status: 'confirmed'
            };
            bookings.push(newBooking);
            this.saveToStorage(bookings);
            console.log('Booking added successfully:', newBooking);
            return newBooking;
        } catch (error) {
            console.error('Error adding booking:', error);
            return null;
        }
    }

    // Delete a booking by ID
    deleteBooking(id) {
        try {
            const bookings = this.getAllBookings();
            const filteredBookings = bookings.filter(booking => booking.id != id);
            this.saveToStorage(filteredBookings);
            console.log('Booking deleted successfully:', id);
            return true;
        } catch (error) {
            console.error('Error deleting booking:', error);
            return false;
        }
    }

    // Clear all bookings
    clearAllBookings() {
        try {
            this.saveToStorage([]);
            console.log('All bookings cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing bookings:', error);
            return false;
        }
    }

    // Search bookings by email or phone
    searchBookings(email, phone) {
        try {
            const bookings = this.getAllBookings();
            return bookings.filter(booking => {
                const emailMatch = email && booking.email.toLowerCase() === email.toLowerCase();
                const phoneMatch = phone && booking.phone.includes(phone);
                return emailMatch || phoneMatch;
            });
        } catch (error) {
            console.error('Error searching bookings:', error);
            return [];
        }
    }

    // Get booking statistics
    getStats() {
        try {
            const bookings = this.getAllBookings();
            const today = new Date().toISOString().split('T')[0];

            return {
                total: bookings.length,
                today: bookings.filter(b => b.date === today).length,
                totalPeople: bookings.reduce((sum, b) => sum + parseInt(b.numberOfPeople || 0), 0)
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            return { total: 0, today: 0, totalPeople: 0 };
        }
    }
}

// Initialize the database
const bookingDB = new BookingDatabase();

// Initialize bookings from database (for backward compatibility)
let bookings = bookingDB.getAllBookings();

// Admin credentials (in production, this should be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'kshatriya302',
    password: '0978'
};

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Login function
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        console.log('Login attempt:', { username, password }); // Debug log

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Successful login
            localStorage.setItem('adminLoggedIn', 'true');
            if (rememberMe) {
                localStorage.setItem('rememberAdmin', 'true');
            }
            console.log('Login successful, redirecting...'); // Debug log
            window.location.href = 'admin.html';
        } else {
            // Failed login
            console.log('Login failed - incorrect credentials'); // Debug log
            showError('Invalid username or password. Please check your credentials.');
        }
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');

    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 3000);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Date picker - show day of week
const dateInput = document.getElementById('appointmentDate');
if (dateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    dateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value + 'T00:00:00');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[selectedDate.getDay()];
        document.getElementById('dayOfWeek').textContent = `Selected day: ${dayOfWeek}`;
    });
}

// EmailJS Configuration
// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your EmailJS public key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Send confirmation email
function sendConfirmationEmail(data) {
    // Format date and time for email
    const dateObj = new Date(data.date + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    const timeFormatted = formatTime(data.time);

    // Email template parameters
    const templateParams = {
        to_email: data.email,
        to_name: data.name,
        appointment_date: formattedDate,
        appointment_time: timeFormatted,
        number_of_people: data.numberOfPeople,
        appointment_details: data.details,
        phone: data.phone,
        booking_id: data.id
    };

    // Send email using EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log('Email sent successfully!', response.status, response.text);
            }, function (error) {
                console.log('Failed to send email:', error);
            });
    }
}

// Handle booking form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            numberOfPeople: document.getElementById('numberOfPeople').value,
            details: document.getElementById('appointmentDetails').value,
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        // Save to database
        const newBooking = bookingDB.addBooking(formData);

        if (newBooking) {
            // Update local bookings array
            bookings = bookingDB.getAllBookings();

            // Send confirmation email
            sendConfirmationEmail(newBooking);

            // Show confirmation modal
            showConfirmation(newBooking);

            console.log('Booking saved successfully:', newBooking);
        } else {
            alert('Error saving booking. Please try again.');
        }
    });
}

// Show confirmation modal
function showConfirmation(data) {
    const modal = document.getElementById('confirmationModal');
    const detailsDiv = document.getElementById('confirmationDetails');

    // Format date
    const dateObj = new Date(data.date + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${days[dateObj.getDay()]}, ${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

    // Format time
    const timeFormatted = formatTime(data.time);

    detailsDiv.innerHTML = `
        <div class="flex items-center mb-3">
            <i class="fas fa-user text-indigo-600 w-6"></i>
            <span class="font-semibold text-gray-700 w-32">Name:</span>
            <span class="text-gray-900">${data.name}</span>
        </div>
        <div class="flex items-center mb-3">
            <i class="fas fa-calendar text-indigo-600 w-6"></i>
            <span class="font-semibold text-gray-700 w-32">Date:</span>
            <span class="text-gray-900">${formattedDate}</span>
        </div>
        <div class="flex items-center mb-3">
            <i class="fas fa-clock text-indigo-600 w-6"></i>
            <span class="font-semibold text-gray-700 w-32">Time:</span>
            <span class="text-gray-900">${timeFormatted}</span>
        </div>
        <div class="flex items-center mb-3">
            <i class="fas fa-users text-indigo-600 w-6"></i>
            <span class="font-semibold text-gray-700 w-32">People:</span>
            <span class="text-gray-900">${data.numberOfPeople}</span>
        </div>
        <div class="flex items-center mb-3">
            <i class="fas fa-envelope text-indigo-600 w-6"></i>
            <span class="font-semibold text-gray-700 w-32">Email:</span>
            <span class="text-gray-900">${data.email}</span>
        </div>
        <div class="flex items-center mb-3">
            <i class="fas fa-phone text-indigo-600 w-6"></i>
            <span class="font-semibold text-gray-700 w-32">Phone:</span>
            <span class="text-gray-900">${data.phone}</span>
        </div>
        <div class="flex items-start">
            <i class="fas fa-file-alt text-indigo-600 w-6 mt-1"></i>
            <span class="font-semibold text-gray-700 w-32">Details:</span>
            <span class="text-gray-900 flex-1">${data.details}</span>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Format time helper
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Admin Dashboard Functions
if (window.location.pathname.includes('admin.html')) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    } else {
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            loadAdminDashboard();
        }, 100);
    }
}

// Auto-refresh admin dashboard every 30 seconds to show new bookings
if (window.location.pathname.includes('admin.html') && isLoggedIn()) {
    setInterval(() => {
        loadAdminDashboard();
        console.log('Admin dashboard refreshed automatically');
    }, 30000); // Refresh every 30 seconds
}

function loadAdminDashboard() {
    // Refresh bookings from database
    bookings = bookingDB.getAllBookings();
    updateStats();
    displayBookings();
    displayMobileBookings();
}

function updateStats() {
    // Get fresh stats from database
    const stats = bookingDB.getStats();

    const totalBookingsElement = document.getElementById('totalBookings');
    const todayBookingsElement = document.getElementById('todayBookings');
    const totalPeopleElement = document.getElementById('totalPeople');

    if (totalBookingsElement) totalBookingsElement.textContent = stats.total;
    if (todayBookingsElement) todayBookingsElement.textContent = stats.today;
    if (totalPeopleElement) totalPeopleElement.textContent = stats.totalPeople;
}

function displayBookings() {
    const tbody = document.getElementById('bookingsTableBody');

    // Debug logging
    console.log('displayBookings called');
    console.log('tbody element:', tbody);
    console.log('bookings array:', bookings);
    console.log('bookings length:', bookings.length);

    if (!tbody) {
        console.error('bookingsTableBody element not found!');
        return;
    }

    if (bookings.length === 0) {
        console.log('No bookings found, showing empty message');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-2"></i>
                    <p>No bookings yet</p>
                </td>
            </tr>
        `;
        return;
    }

    // Sort bookings by date and time (newest first)
    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });

    tbody.innerHTML = sortedBookings.map((booking, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${booking.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatDate(booking.date)}<br>
                <span class="text-indigo-600 font-semibold">${formatTime(booking.time)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.numberOfPeople}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${booking.email}<br>
                <span class="text-gray-600">${booking.phone}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${booking.details}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="deleteBooking(${booking.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        if (bookingDB.deleteBooking(id)) {
            // Refresh bookings from database
            bookings = bookingDB.getAllBookings();
            loadAdminDashboard();
        } else {
            alert('Error deleting booking. Please try again.');
        }
    }
}

function clearAllBookings() {
    if (confirm('Are you sure you want to delete ALL bookings? This action cannot be undone.')) {
        if (bookingDB.clearAllBookings()) {
            // Refresh bookings from database
            bookings = bookingDB.getAllBookings();
            loadAdminDashboard();
        } else {
            alert('Error clearing bookings. Please try again.');
        }
    }
}

// Mobile menu toggle function
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Display mobile bookings cards
function displayMobileBookings() {
    const container = document.getElementById('mobileBookingsContainer');

    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-inbox text-4xl mb-2"></i>
                <p>No bookings yet</p>
            </div>
        `;
        return;
    }

    // Sort bookings by date and time (newest first)
    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });

    container.innerHTML = sortedBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-card-header">
                <div class="flex items-center">
                    <i class="fas fa-user text-indigo-600 mr-2"></i>
                    <span class="font-semibold text-gray-900">${booking.name}</span>
                </div>
                <button onclick="deleteBooking(${booking.id})" class="text-red-600 hover:text-red-800 p-2">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="booking-card-content">
                <div class="booking-field">
                    <span class="booking-field-label">ID:</span>
                    <span class="booking-field-value">#${booking.id}</span>
                </div>
                <div class="booking-field">
                    <span class="booking-field-label">Date:</span>
                    <span class="booking-field-value">${formatDate(booking.date)}</span>
                </div>
                <div class="booking-field">
                    <span class="booking-field-label">Time:</span>
                    <span class="booking-field-value text-indigo-600 font-semibold">${formatTime(booking.time)}</span>
                </div>
                <div class="booking-field">
                    <span class="booking-field-label">People:</span>
                    <span class="booking-field-value">${booking.numberOfPeople}</span>
                </div>
                <div class="booking-field">
                    <span class="booking-field-label">Email:</span>
                    <span class="booking-field-value">${booking.email}</span>
                </div>
                <div class="booking-field">
                    <span class="booking-field-label">Phone:</span>
                    <span class="booking-field-value">${booking.phone}</span>
                </div>
                <div class="booking-field">
                    <span class="booking-field-label">Details:</span>
                    <span class="booking-field-value">${booking.details}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Search bookings by email or phone
function searchBookings() {
    const email = document.getElementById('searchEmail').value.trim();
    const phone = document.getElementById('searchPhone').value.trim();

    if (!email && !phone) {
        alert('Please enter either an email address or phone number to search.');
        return;
    }

    // Use database search function
    const userBookings = bookingDB.searchBookings(email, phone);

    displayUserBookings(userBookings);
}

// Display user bookings
function displayUserBookings(userBookings) {
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const initialState = document.getElementById('initialState');
    const tableBody = document.getElementById('userBookingsTable');
    const cardsContainer = document.getElementById('userBookingsCards');

    // Hide initial state
    initialState.classList.add('hidden');

    if (userBookings.length === 0) {
        searchResults.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    // Show results
    noResults.classList.add('hidden');
    searchResults.classList.remove('hidden');

    // Sort bookings by date and time (newest first)
    const sortedBookings = [...userBookings].sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });

    // Populate desktop table
    tableBody.innerHTML = sortedBookings.map(booking => {
        const bookingDate = new Date(booking.date + 'T' + booking.time);
        const now = new Date();
        const isPast = bookingDate < now;
        const status = isPast ? 'Completed' : 'Upcoming';
        const statusClass = isPast ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${booking.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${formatDate(booking.date)}<br>
                    <span class="text-indigo-600 font-semibold">${formatTime(booking.time)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.numberOfPeople}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${booking.details}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                        ${status}
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    // Populate mobile cards
    cardsContainer.innerHTML = sortedBookings.map(booking => {
        const bookingDate = new Date(booking.date + 'T' + booking.time);
        const now = new Date();
        const isPast = bookingDate < now;
        const status = isPast ? 'Completed' : 'Upcoming';
        const statusClass = isPast ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';

        return `
            <div class="booking-card">
                <div class="booking-card-header">
                    <div class="flex items-center">
                        <i class="fas fa-calendar text-indigo-600 mr-2"></i>
                        <span class="font-semibold text-gray-900">Booking #${booking.id}</span>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                        ${status}
                    </span>
                </div>
                <div class="booking-card-content">
                    <div class="booking-field">
                        <span class="booking-field-label">Name:</span>
                        <span class="booking-field-value">${booking.name}</span>
                    </div>
                    <div class="booking-field">
                        <span class="booking-field-label">Date:</span>
                        <span class="booking-field-value">${formatDate(booking.date)}</span>
                    </div>
                    <div class="booking-field">
                        <span class="booking-field-label">Time:</span>
                        <span class="booking-field-value text-indigo-600 font-semibold">${formatTime(booking.time)}</span>
                    </div>
                    <div class="booking-field">
                        <span class="booking-field-label">People:</span>
                        <span class="booking-field-value">${booking.numberOfPeople}</span>
                    </div>
                    <div class="booking-field">
                        <span class="booking-field-label">Email:</span>
                        <span class="booking-field-value">${booking.email}</span>
                    </div>
                    <div class="booking-field">
                        <span class="booking-field-label">Phone:</span>
                        <span class="booking-field-value">${booking.phone}</span>
                    </div>
                    <div class="booking-field">
                        <span class="booking-field-label">Details:</span>
                        <span class="booking-field-value">${booking.details}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function () {
    const searchEmail = document.getElementById('searchEmail');
    const searchPhone = document.getElementById('searchPhone');

    if (searchEmail) {
        searchEmail.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchBookings();
            }
        });
    }

    if (searchPhone) {
        searchPhone.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchBookings();
            }
        });
    }

    // Debug: Log current bookings count on page load
    console.log('Page loaded. Current bookings in database:', bookingDB.getAllBookings().length);

    // Add a global function to check database status (for debugging)
    window.checkBookingDatabase = function () {
        const allBookings = bookingDB.getAllBookings();
        console.log('=== BOOKING DATABASE STATUS ===');
        console.log('Total bookings:', allBookings.length);
        console.log('Storage key:', bookingDB.storageKey);
        console.log('Raw storage data:', localStorage.getItem(bookingDB.storageKey));
        console.log('Parsed bookings:', allBookings);
        console.log('===============================');
        return allBookings;
    };

    // Add a global function to manually refresh admin dashboard (for debugging)
    window.refreshAdminDashboard = function () {
        if (typeof loadAdminDashboard === 'function') {
            loadAdminDashboard();
            console.log('Admin dashboard refreshed manually');
        } else {
            console.log('Admin dashboard function not available on this page');
        }
    };

    // Add a test function to create a sample booking (for debugging)
    window.createTestBooking = function () {
        const testBooking = {
            date: '2024-12-15',
            time: '14:00',
            numberOfPeople: '2',
            details: 'Test booking for debugging',
            name: 'Test User',
            email: 'test@example.com',
            phone: '9926633224'
        };

        const result = bookingDB.addBooking(testBooking);
        console.log('Test booking created:', result);

        // Refresh bookings array
        bookings = bookingDB.getAllBookings();
        console.log('Updated bookings array:', bookings);

        // If on admin page, refresh dashboard
        if (typeof loadAdminDashboard === 'function') {
            loadAdminDashboard();
        }

        return result;
    };

    // Add function to clear test data
    window.clearTestData = function () {
        bookingDB.clearAllBookings();
        bookings = bookingDB.getAllBookings();
        console.log('All bookings cleared');

        if (typeof loadAdminDashboard === 'function') {
            loadAdminDashboard();
        }
    };
});
