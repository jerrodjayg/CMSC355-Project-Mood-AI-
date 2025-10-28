// Mood AI Application Logic

// Local database to store user accounts
let userDatabase = [];

// Page elements
let currentPage = null;
const pages = {
    splash: document.getElementById('splash-screen'),
    login: document.getElementById('login-page'),
    createAccount: document.getElementById('create-account-page'),
    loginForm: document.getElementById('login-form-page')
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
            alert(`Account created successfully! Welcome ${formData.firstName} ${formData.lastName}!`);
            
            // Reset form and go back to main login page
            createAccountForm.reset();
            showPage('login');
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
                alert(`Welcome back, ${user.firstName}!`);
                loginForm.reset();
                // Here you would typically redirect to the main app
                console.log('Login successful for:', user);
            } else {
                showError('login-error', 'Invalid email or password. Please check your credentials.');
            }
        });
    }
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