const auth = {
    getToken: () => localStorage.getItem('techvault_admin_token'),
    
    checkAuth: () => {
        const token = localStorage.getItem('techvault_admin_token');
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    getHeaders: () => {
        const token = localStorage.getItem('techvault_admin_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },

    logout: () => {
        localStorage.removeItem('techvault_admin_token');
        localStorage.removeItem('techvault_admin_email');
        window.location.href = 'login.html';
    }
};

// Auto-check on load if not on login page
if (!window.location.pathname.endsWith('login.html')) {
    auth.checkAuth();
}
