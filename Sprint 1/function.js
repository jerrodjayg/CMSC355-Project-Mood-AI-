// Mood AI Splash Screen and Navigation Logic

document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const loginPage = document.getElementById('login-page');
    const createAccountBtn = document.getElementById('create-account-btn');
    const loginBtn = document.getElementById('login-btn');

    // Show splash screen for 2 seconds, then transition to login page
    setTimeout(() => {
        // Add fade-out class to splash screen
        splashScreen.classList.add('fade-out');
        
        // After fade-out animation completes, show login page
        setTimeout(() => {
            splashScreen.style.display = 'none';
            loginPage.classList.remove('hidden');
        }, 500); // Wait for fade-out animation to complete
        
    }, 2000); // Show splash for 2 seconds

    // Button event handlers (placeholder functionality)
    createAccountBtn.addEventListener('click', function() {
        console.log('Create Account clicked');
        // Add your create account logic here
        alert('Create Account functionality will be implemented in future sprints');
    });

    loginBtn.addEventListener('click', function() {
        console.log('Log In clicked');
        // Add your login logic here
        alert('Login functionality will be implemented in future sprints');
    });
});

// Optional: Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Skip splash screen on any key press
    if (document.getElementById('splash-screen').style.display !== 'none') {
        const splashScreen = document.getElementById('splash-screen');
        const loginPage = document.getElementById('login-page');
        
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            loginPage.classList.remove('hidden');
        }, 500);
    }
});
