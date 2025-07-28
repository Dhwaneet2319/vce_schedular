// ============================================
// VCE AI Study Planner - Authentication System
// Supports both Google Sign-In and Manual Auth
// ============================================

// ===== AUTH MANAGER =====
class AuthManager {
    constructor(profileManager, subscriptionManager) {
        this.profileManager = profileManager;
        this.subscriptionManager = subscriptionManager;
        this.isSignedIn = false;
        this.userData = null;
        this.authMethod = null; // 'google' or 'manual'
        
        // Initialize Auth
        this.init();
    }

    init() {
        // Check if user is already signed in (from any method)
        this.checkExistingAuth();
        
        // Check if we need to redirect to the auth page
        this.checkAuthRedirect();
    }
    
    checkExistingAuth() {
        // Try to get auth from different sources
        const googleUserData = localStorage.getItem('googleUserData');
        const manualUserData = localStorage.getItem('manualUserData');
        
        if (googleUserData) {
            try {
                this.userData = JSON.parse(googleUserData);
                this.isSignedIn = true;
                this.authMethod = 'google';
                console.log('🔑 User signed in via Google:', this.userData.name);
                this.updateUIForSignedInUser();
            } catch (e) {
                console.error('Error parsing Google user data:', e);
                localStorage.removeItem('googleUserData');
            }
        } else if (manualUserData) {
            try {
                this.userData = JSON.parse(manualUserData);
                this.isSignedIn = true;
                this.authMethod = 'manual';
                console.log('🔑 User signed in manually:', this.userData.name);
                this.updateUIForSignedInUser();
            } catch (e) {
                console.error('Error parsing manual user data:', e);
                localStorage.removeItem('manualUserData');
            }
        }
    }
    
    checkAuthRedirect() {
        // Check if we should redirect to auth page
        const shouldRedirectToAuth = localStorage.getItem('redirectToAuth');
        if (shouldRedirectToAuth === 'true' && !this.isSignedIn) {
            localStorage.removeItem('redirectToAuth');
            window.location.href = 'debug.html';
        }
        
        // Check if we need to trigger Google Auth
        const triggerGoogleAuth = localStorage.getItem('triggerGoogleAuth');
        if (triggerGoogleAuth === 'true') {
            localStorage.removeItem('triggerGoogleAuth');
            // If GoogleAuthManager exists, trigger sign in
            if (window.googleAuthManager) {
                window.googleAuthManager.signIn();
            }
        }
    }
    
    updateUIForSignedInUser() {
        if (!this.userData) return;

        // Update profile display
        const profileName = document.querySelector('.profile-name');
        const profileDetailName = document.querySelector('.profile-details h3');
        const profileAvatar = document.querySelector('.profile-avatar');
        const profileAvatarLarge = document.querySelector('.profile-avatar-large');

        // Update name display
        if (profileName) {
            profileName.textContent = this.userData.name.split(' ')[0]; // First name only
        }

        if (profileDetailName) {
            profileDetailName.textContent = this.userData.name;
        }

        // Update avatar - use picture URL if available (Google), or create initials avatar
        if (profileAvatar) {
            if (this.userData.picture) {
                profileAvatar.innerHTML = `<img src="${this.userData.picture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                // Create avatar with initials
                const initials = this.getInitials(this.userData.name);
                profileAvatar.innerHTML = `
                    <div class="avatar-initials">${initials}</div>
                `;
                
                // Add styles if needed
                if (!document.querySelector('.avatar-initials-style')) {
                    const style = document.createElement('style');
                    style.className = 'avatar-initials-style';
                    style.textContent = `
                        .avatar-initials {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: var(--color-primary);
                            color: white;
                            font-weight: 600;
                            font-size: 0.8em;
                            border-radius: 50%;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }

        // Update large avatar too
        if (profileAvatarLarge) {
            if (this.userData.picture) {
                profileAvatarLarge.innerHTML = `<img src="${this.userData.picture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                const initials = this.getInitials(this.userData.name);
                profileAvatarLarge.innerHTML = `
                    <div class="avatar-initials-large">${initials}</div>
                `;
                
                // Add styles if needed
                if (!document.querySelector('.avatar-initials-large-style')) {
                    const style = document.createElement('style');
                    style.className = 'avatar-initials-large-style';
                    style.textContent = `
                        .avatar-initials-large {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: var(--color-primary);
                            color: white;
                            font-weight: 600;
                            font-size: 1.2em;
                            border-radius: 50%;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }

        // Update the sign in/out button
        this.updateAuthButton();
    }
    
    getInitials(name) {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }
    
    updateAuthButton() {
        // Find the sign in/out button
        const signOutBtn = document.getElementById('sign-out');
        const googleSignInBtn = document.getElementById('google-sign-in');
        
        if (!signOutBtn) return;
        
        if (this.isSignedIn) {
            // If signed in, show sign out button
            if (googleSignInBtn) {
                googleSignInBtn.style.display = 'none';
            }
            
            signOutBtn.innerHTML = `
                <i data-lucide="log-out" class="item-icon"></i>
                <span>Sign Out</span>
                ${this.authMethod === 'google' ? '<div class="google-icon">G</div>' : ''}
            `;
            
            // Update sign out button functionality
            signOutBtn.removeEventListener('click', this.subscriptionManager.signOut);
            signOutBtn.addEventListener('click', () => this.signOut());
        } else {
            // If not signed in, show sign in button
            signOutBtn.innerHTML = `
                <i data-lucide="log-in" class="item-icon"></i>
                <span>Sign In / Sign Up</span>
            `;
            
            // Redirect to auth page on click
            signOutBtn.addEventListener('click', () => {
                window.location.href = 'debug.html';
            });
        }
        
        // Initialize lucide icons
        lucide.createIcons();
    }
    
    signOut() {
        // Close the profile dropdown
        this.profileManager.closeDropdown();

        // Clear stored user data based on auth method
        if (this.authMethod === 'google') {
            localStorage.removeItem('googleUserData');
        } else {
            localStorage.removeItem('manualUserData');
        }

        // Reset user state
        this.userData = null;
        this.isSignedIn = false;
        this.authMethod = null;

        // Show success message
        this.profileManager.showSuccessMessage('👋 Signed out successfully!');

        // Reset subscription if needed
        this.subscriptionManager.signOut();

        // Refresh the page to reset the UI completely
        setTimeout(() => location.reload(), 1000);
    }
}

// When the DOM is loaded, check if we need to update the ProfileManager
document.addEventListener('DOMContentLoaded', () => {
    // Wait for a brief moment to ensure the app has initialized
    setTimeout(() => {
        // Update the ProfileManager's bindEvents method to support Auth
        if (window.profileManager) {
            const signOutBtn = document.getElementById('sign-out');
            
            if (signOutBtn) {
                // Remove existing listeners (if any)
                const oldSignOut = signOutBtn.cloneNode(true);
                signOutBtn.parentNode.replaceChild(oldSignOut, signOutBtn);
                
                // Add new event listener
                oldSignOut.addEventListener('click', () => {
                    if (window.profileManager) window.profileManager.closeDropdown();
                    
                    // Check if user is signed in
                    if (window.authManager && window.authManager.isSignedIn) {
                        window.authManager.signOut();
                    } else if (window.googleAuthManager && window.googleAuthManager.isSignedIn) {
                        window.googleAuthManager.signOut();
                    } else {
                        // Not signed in, redirect to auth page
                        localStorage.setItem('redirectToAuth', 'true');
                        window.location.href = 'debug.html';
                    }
                });
                
                // Update button text based on auth status
                const isSignedIn = 
                    (window.authManager && window.authManager.isSignedIn) || 
                    (window.googleAuthManager && window.googleAuthManager.isSignedIn);
                    
                if (isSignedIn) {
                    oldSignOut.innerHTML = `
                        <i data-lucide="log-out" class="item-icon"></i>
                        <span>Sign Out</span>
                    `;
                } else {
                    oldSignOut.innerHTML = `
                        <i data-lucide="log-in" class="item-icon"></i>
                        <span>Sign In / Sign Up</span>
                    `;
                }
                
                // Re-initialize icons
                lucide.createIcons();
            }
        }
    }, 500);
});
