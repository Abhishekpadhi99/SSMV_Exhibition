// Initialize bookings from localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

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
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Successful login
            localStorage.setItem('adminLoggedIn', 'true');
            if (rememberMe) {
                localStorage.setItem('rememberAdmin', 'true');
            }
            window.location.href = 'admin.html';
        } else {
            // Failed login
            showError('Invalid username or password');
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

    dateInput.addEventListener('change', function() {
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
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
            }, function(error) {
                console.log('Failed to send email:', error);
            });
    }
}

// Handle booking form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            id: Date.now(),
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            numberOfPeople: document.getElementById('numberOfPeople').value,
            details: document.getElementById('appointmentDetails').value,
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            bookedAt: new Date().toISOString()
        };

        // Save to localStorage
        bookings.push(formData);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Send confirmation email
        sendConfirmationEmail(formData);

        // Show confirmation modal
        showConfirmation(formData);
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
        loadAdminDashboard();
    }
}

function loadAdminDashboard() {
    updateStats();
    displayBookings();
}

function updateStats() {
    const totalBookings = bookings.length;
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today).length;
    const totalPeople = bookings.reduce((sum, b) => sum + parseInt(b.numberOfPeople), 0);

    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('todayBookings').textContent = todayBookings;
    document.getElementById('totalPeople').textContent = totalPeople;
}

function displayBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
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
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadAdminDashboard();
    }
}

function clearAllBookings() {
    if (confirm('Are you sure you want to delete ALL bookings? This action cannot be undone.')) {
        bookings = [];
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadAdminDashboard();
    }
}
