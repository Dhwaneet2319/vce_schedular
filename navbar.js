// Minimal Navbar Interactivity for VCE AI Study Planner

document.addEventListener('DOMContentLoaded', () => {
    // Handle profile button click
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            console.log('Profile clicked');
            
            // Example animation for feedback
            gsap.fromTo(profileBtn, 
                { scale: 0.9 }, 
                { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
            
            // In a real implementation, you'd toggle a profile dropdown menu here
        });
    }
    
    // Navbar scroll behavior - adjust shadow when scrolling
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.app-header');
        if (!header) return;
        
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 20) {
            // When scrolled down, enhance shadow
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        } else {
            // When at top, reduce shadow
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        }
    }, { passive: true });
});
