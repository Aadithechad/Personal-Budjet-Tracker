// Authentication Module

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentUserRole = null;
    }

    // Register new user
    async register(email, password, name) {
        try {
            showLoading();
            
            // Create user in Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            // Create user document in Firestore
            await db.collection('users').doc(uid).set({
                uid: uid,
                email: email,
                name: name,
                role: 'user',
                createdAt: new Date()
            });

            hideLoading();
            showMessage('Registration successful! Logging you in...', 'success');
            
            // Log the user in
            this.currentUser = userCredential.user;
            this.currentUserRole = 'user';
            
            return { success: true, user: userCredential.user };
        } catch (error) {
            hideLoading();
            showMessage(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            showLoading();
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            // Fetch user role from Firestore
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                this.currentUserRole = userDoc.data().role;
            } else {
                this.currentUserRole = 'user';
            }

            this.currentUser = userCredential.user;
            hideLoading();
            
            return { success: true, user: userCredential.user };
        } catch (error) {
            hideLoading();
            showMessage(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Logout user
    async logout() {
        try {
            await auth.signOut();
            this.currentUser = null;
            this.currentUserRole = null;
            return { success: true };
        } catch (error) {
            showMessage(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Delete user account
    async deleteAccount() {
        try {
            showLoading();
            const uid = this.currentUser.uid;

            // Delete all transactions
            const transactionsSnapshot = await db.collection('transactions')
                .where('userId', '==', uid)
                .get();
            
            const batch = db.batch();
            transactionsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // Delete user document
            await db.collection('users').doc(uid).delete();

            // Delete user from Firebase Auth
            await this.currentUser.delete();

            this.currentUser = null;
            this.currentUserRole = null;
            hideLoading();
            
            showMessage('Account deleted successfully', 'success');
            return { success: true };
        } catch (error) {
            hideLoading();
            showMessage(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get current user role
    getUserRole() {
        return this.currentUserRole;
    }

    // Get user by ID
    async getUserData(uid) {
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }

    // Get all users (admin only)
    async getAllUsers() {
        try {
            const usersSnapshot = await db.collection('users').get();
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push({ ...doc.data(), docId: doc.id });
            });
            return users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            return [];
        }
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Setup auth listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is logged in
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            authManager.currentUser = user;
            authManager.currentUserRole = userDoc.data().role;
            
            // Show app container, hide auth container
            showAppUI();
        }
    } else {
        // User is logged out
        authManager.currentUser = null;
        authManager.currentUserRole = null;
        
        // Show auth container, hide app container
        showAuthUI();
    }
});
