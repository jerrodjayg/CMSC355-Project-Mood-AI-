// Mood AI Application Logic

// Local database to store user accounts
let userDatabase = [];

// Page elements
let currentPage = null;
const pages = {
    splash: document.getElementById('splash-screen'),
    login: document.getElementById('login-page'),
    createAccount: document.getElementById('create-account-page'),
    loginForm: document.getElementById('login-form-page'),
    moodSelection: document.getElementById('mood-selection-page'),
    noteEntry: document.getElementById('note-entry-page'),
    timeSelection: document.getElementById('time-selection-page')
};

// Store mood data
let moodData = {
    mood: null,
    note: null,
    reminderTime: { hour: 8, minute: 0, period: 'AM' }
};

// Utility functions
function showPage(pageName) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) page.classList.add('hidden');
    });
    
    // Show the requested page
    if (pages[pageName]) {
        pages[pageName].classList.remove('hidden');
        currentPage = pageName;
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validation functions
function validateEmail(email) {
    // Check for @ character and . after @
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return false;
    
    const afterAt = email.substring(atIndex + 1);
    return afterAt.includes('.');
}

function validatePassword(password) {
    const validations = {
        hasCapital: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&]/.test(password),
        correctLength: password.length >= 8 && password.length <= 64
    };
    
    return {
        isValid: validations.hasCapital && validations.hasNumber && validations.hasSpecialChar && validations.correctLength,
        details: validations
    };
}

// User management functions
function saveUser(userData) {
    userDatabase.push(userData);
    console.log('User saved:', userData);
    console.log('Current database:', userDatabase);
}

function findUser(email, password) {
    return userDatabase.find(user => 
        user.email === email && user.password === password
    );
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Show splash screen for 2 seconds, then transition to main login page
    setTimeout(() => {
        pages.splash.classList.add('fade-out');
        
        setTimeout(() => {
            showPage('login');
        }, 500);
        
    }, 2000);

    // Main login page button handlers
    const createAccountBtn = document.getElementById('create-account-btn');
    const loginBtn = document.getElementById('login-btn');

    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', function() {
            showPage('createAccount');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showPage('loginForm');
        });
    }

    // Back to main page button handlers
    const createBackBtn = document.getElementById('create-back-btn');
    const loginBackBtn = document.getElementById('login-back-btn');

    if (createBackBtn) {
        createBackBtn.addEventListener('click', function() {
            showPage('login');
        });
    }

    if (loginBackBtn) {
        loginBackBtn.addEventListener('click', function() {
            showPage('login');
        });
    }

    // Create Account form handler
    const createAccountForm = document.getElementById('create-account-form');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearError('create-error');

            // Get form data
            const formData = {
                firstName: document.getElementById('first-name').value.trim(),
                lastName: document.getElementById('last-name').value.trim(),
                email: document.getElementById('create-email').value.trim(),
                password: document.getElementById('create-password').value,
                confirmPassword: document.getElementById('confirm-password').value
            };

            // Validate all fields are filled
            if (!formData.firstName || !formData.lastName || !formData.email || 
                !formData.password || !formData.confirmPassword) {
                showError('create-error', 'Please fill in all fields.');
                return;
            }

            // Validate email format
            if (!validateEmail(formData.email)) {
                showError('create-error', 'Email must contain an "@" character and a "." after the "@".');
                return;
            }

            // Check if email already exists
            if (userDatabase.some(user => user.email === formData.email)) {
                showError('create-error', 'An account with this email already exists.');
                return;
            }

            // Validate password
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                let errorMsg = 'Password does not meet requirements: ';
                if (!passwordValidation.details.hasCapital) errorMsg += 'Missing capital letter. ';
                if (!passwordValidation.details.hasNumber) errorMsg += 'Missing number. ';
                if (!passwordValidation.details.hasSpecialChar) errorMsg += 'Missing special character (!@#$%^&). ';
                if (!passwordValidation.details.correctLength) errorMsg += 'Must be 8-64 characters. ';
                
                showError('create-error', errorMsg.trim());
                return;
            }

            // Validate password confirmation
            if (formData.password !== formData.confirmPassword) {
                showError('create-error', 'Passwords do not match.');
                return;
            }

            // Save user and show success
            const newUser = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            };

            saveUser(newUser);
            
            // Reset form and navigate to mood selection screen
            createAccountForm.reset();
            showPage('moodSelection');
        });
    }

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearError('login-error');

            // Get form data
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // Validate fields are filled
            if (!email || !password) {
                showError('login-error', 'Please fill in all fields.');
                return;
            }

            // Validate email format
            if (!validateEmail(email)) {
                showError('login-error', 'Please enter a valid email address.');
                return;
            }

            // Check credentials against database
            const user = findUser(email, password);
            if (user) {
                loginForm.reset();
                // Navigate to mood selection screen
                showPage('moodSelection');
            } else {
                showError('login-error', 'Invalid email or password. Please check your credentials.');
            }
        });
    }

    // Mood Selection Page Handlers
    const moodButtons = document.querySelectorAll('.mood-button');
    const customMoodInput = document.getElementById('custom-mood-input');
    const moodNextBtn = document.getElementById('mood-next-btn');

    // Handle mood button clicks
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            // Store the selected mood
            moodData.mood = this.getAttribute('data-mood');
            // Clear custom mood input
            customMoodInput.value = '';
            clearError('mood-error');
        });
    });

    // Handle custom mood input
    if (customMoodInput) {
        customMoodInput.addEventListener('input', function() {
            if (this.value.trim()) {
                // Clear selected button when custom mood is entered
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                moodData.mood = this.value.trim();
                clearError('mood-error');
            } else {
                moodData.mood = null;
            }
        });
    }

    // Handle Next button on mood selection
    if (moodNextBtn) {
        moodNextBtn.addEventListener('click', function() {
            // Validate that either a button is selected or custom mood is filled
            if (!moodData.mood) {
                showError('mood-error', 'Please state your current mood');
                return;
            }
            // Move to note entry page
            showPage('noteEntry');
        });
    }

    // Note Entry Page Handlers
    const moodNoteInput = document.getElementById('mood-note-input');
    const noteNextBtn = document.getElementById('note-next-btn');

    // Handle Next button on note entry
    if (noteNextBtn) {
        noteNextBtn.addEventListener('click', function() {
            const note = moodNoteInput ? moodNoteInput.value.trim() : '';
            if (!note) {
                showError('note-error', 'Please enter in a note');
                return;
            }
            // Store the note
            moodData.note = note;
            // Move to time selection page
            showPage('timeSelection');
        });
    }

    // Time Selection Page Handlers
    const hourDisplay = document.getElementById('hour-display');
    const minuteDisplay = document.getElementById('minute-display');
    const timePeriod = document.getElementById('time-period');
    const hourUpBtn = document.getElementById('hour-up');
    const hourDownBtn = document.getElementById('hour-down');
    const minuteUpBtn = document.getElementById('minute-up');
    const minuteDownBtn = document.getElementById('minute-down');
    const timeConfirmBtn = document.getElementById('time-confirm-btn');

    // Initialize time display (8:00 AM)
    function updateTimeDisplay() {
        if (hourDisplay) {
            hourDisplay.textContent = moodData.reminderTime.hour.toString().padStart(2, '0');
        }
        if (minuteDisplay) {
            minuteDisplay.textContent = moodData.reminderTime.minute.toString().padStart(2, '0');
        }
        if (timePeriod) {
            timePeriod.textContent = moodData.reminderTime.period;
        }
    }

    // Handle hour increment
    if (hourUpBtn) {
        hourUpBtn.addEventListener('click', function() {
            moodData.reminderTime.hour++;
            if (moodData.reminderTime.hour > 12) {
                moodData.reminderTime.hour = 1;
                // Toggle period when wrapping from 12 to 1
                moodData.reminderTime.period = moodData.reminderTime.period === 'AM' ? 'PM' : 'AM';
            }
            updateTimeDisplay();
        });
    }

    // Handle hour decrement
    if (hourDownBtn) {
        hourDownBtn.addEventListener('click', function() {
            moodData.reminderTime.hour--;
            if (moodData.reminderTime.hour < 1) {
                moodData.reminderTime.hour = 12;
                // Toggle period when wrapping from 1 to 12
                moodData.reminderTime.period = moodData.reminderTime.period === 'AM' ? 'PM' : 'AM';
            }
            updateTimeDisplay();
        });
    }

    // Handle minute increment (by 15: 0, 15, 30, 45, then back to 0)
    if (minuteUpBtn) {
        minuteUpBtn.addEventListener('click', function() {
            moodData.reminderTime.minute += 15;
            if (moodData.reminderTime.minute >= 60) {
                moodData.reminderTime.minute = 0;
            }
            updateTimeDisplay();
        });
    }

    // Handle minute decrement (by 15: 45, 30, 15, 0, then back to 45)
    if (minuteDownBtn) {
        minuteDownBtn.addEventListener('click', function() {
            moodData.reminderTime.minute -= 15;
            if (moodData.reminderTime.minute < 0) {
                moodData.reminderTime.minute = 45;
            }
            updateTimeDisplay();
        });
    }

    // Handle Confirm button
    if (timeConfirmBtn) {
        timeConfirmBtn.addEventListener('click', function() {
            alert('End of Sprint 2');
        });
    }

    // Initialize time display on load
    updateTimeDisplay();
});

// Optional: Skip splash screen on any key press
document.addEventListener('keydown', function(event) {
    if (currentPage === null && pages.splash && !pages.splash.classList.contains('fade-out')) {
        pages.splash.classList.add('fade-out');
        setTimeout(() => {
            showPage('login');
        }, 500);
    }
});

// Debug function to view current database (for development)
function viewDatabase() {
    console.log('Current user database:', userDatabase);
    return userDatabase;
}