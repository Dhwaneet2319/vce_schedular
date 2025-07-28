// Handle the header sign-in/sign-out button in index.html
document.addEventListener('DOMContentLoaded', () => {
    // Find the header sign-in button
    const headerSignInButton = document.getElementById('header-signin-button');
    
    if (headerSignInButton) {
        // Check current auth state
        const googleUserData = localStorage.getItem('googleUserData');
        const manualUserData = localStorage.getItem('manualUserData');
        const isSignedIn = googleUserData || manualUserData;
        
        if (isSignedIn) {
            // User is signed in, show sign-out button
            headerSignInButton.innerHTML = `
                <i data-lucide="log-out" class="auth-icon"></i>
                <span>Sign Out</span>
            `;
            
            // Add sign-out functionality
            headerSignInButton.addEventListener('click', () => {
                // If auth managers exist, let them handle sign out
                if (window.authManager) {
                    window.authManager.signOut();
                } else if (window.googleAuthManager) {
                    window.googleAuthManager.signOut();
                } else {
                    // Fallback: clear auth data and reload
                    localStorage.removeItem('googleUserData');
                    localStorage.removeItem('manualUserData');
                    location.reload();
                }
            });
        } else {
            // User is not signed in, show sign-in button
            headerSignInButton.innerHTML = `
                <i data-lucide="log-in" class="auth-icon"></i>
                <span>Sign In</span>
            `;
            
            // Add sign-in functionality
            headerSignInButton.addEventListener('click', () => {
                // Redirect to auth page
                window.location.href = 'debug.html';
            });
        }
        
        // Initialize icons
        lucide.createIcons();
    }
});
