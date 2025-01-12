// auth.js - Authentication and User Management System

// User class to manage user data
class User {
    constructor(email, fullName, role = 'student') {
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.lastLogin = new Date().toISOString();
        this.activities = [];
    }
}

// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    // Load users from localStorage
    loadUsers() {
        const storedUsers = localStorage.getItem('users');
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Hash password using SHA-256
    async hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Authenticate user
    async authenticate(email, password) {
        const hashedPassword = await this.hashPassword(password);
        const user = this.users.find(u =>
            u.email === email && u.password === hashedPassword
        );

        if (user) {
            this.currentUser = user;
            user.lastLogin = new Date().toISOString();
            this.saveUsers();
            this.saveSession(user);
            return true;
        }
        return false;
    }

    // Save session
    saveSession(user) {
        const sessionData = {
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            lastLogin: user.lastLogin
        };
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return sessionStorage.getItem('currentUser') !== null;
    }

    // Logout
    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    // Get current user
    getCurrentUser() {
        if (!this.currentUser) {
            const sessionUser = sessionStorage.getItem('currentUser');
            if (sessionUser) {
                this.currentUser = JSON.parse(sessionUser);
            }
        }
        return this.currentUser;
    }
}

// Dashboard Manager
class DashboardManager {
    constructor(authManager) {
        this.authManager = authManager;
    }

    // Initialize dashboard
    async initializeDashboard() {
        if (!this.authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        const user = this.authManager.getCurrentUser();
        this.updateWelcomeMessage(user);
        await this.loadActivities(user);
        this.setupLogoutHandler();
    }

    // Update welcome message
    updateWelcomeMessage(user) {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome, ${user.fullName}!`;
        }
    }

    // Load user activities
    async loadActivities(user) {
        const activitiesElement = document.getElementById('activities');
        if (activitiesElement) {
            // Sample activities - replace with actual data source
            const activities = [
                { title: 'Next Quiz', date: '2025-01-10', status: 'Pending' },
                { title: 'Assignment Due', date: '2025-01-15', status: 'In Progress' }
            ];

            const activitiesHTML = activities.map(activity => `
                <div class="activity-card">
                    <h3>${activity.title}</h3>
                    <p>Due: ${activity.date}</p>
                    <span class="status ${activity.status.toLowerCase()}">${activity.status}</span>
                </div>
            `).join('');

            activitiesElement.innerHTML = activitiesHTML;
        }
    }

    // Setup logout handler
    setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authManager.logout();
            });
        }
    }
}

// Initialize the system
const authManager = new AuthManager();
const dashboardManager = new DashboardManager(authManager);

// Event listeners for login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const isAuthenticated = await authManager.authenticate(email, password);
                if (isAuthenticated) {
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Invalid email or password');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard')) {
        dashboardManager.initializeDashboard();
    }
});