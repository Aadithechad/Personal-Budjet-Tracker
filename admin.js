// Admin Module

class AdminManager {
    constructor() {
        this.users = [];
    }

    // Check if current user is admin
    isAdmin() {
        return authManager.getUserRole() === 'admin';
    }

    // Get all registered users
    async getAllUsers() {
        try {
            const users = await authManager.getAllUsers();
            this.users = users;
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    }

    // Format date for display
    formatDate(date) {
        if (!date) return '-';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Create global admin manager instance
const adminManager = new AdminManager();
