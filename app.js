// Main Application Module

document.addEventListener('DOMContentLoaded', () => {
    setupAuthEventListeners();
    setupAppEventListeners();
});

// ==================== AUTH EVENT LISTENERS ====================

function setupAuthEventListeners() {
    // Switch to register
    document.getElementById('switchToRegister').addEventListener('click', () => {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('registerPage').classList.add('active');
    });

    // Switch to login
    document.getElementById('switchToLogin').addEventListener('click', () => {
        document.getElementById('registerPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validate
        if (!name || !email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        const result = await authManager.register(email, password, name);
        
        if (result.success) {
            // Give Firebase time to update, then it should trigger onAuthStateChanged
            setTimeout(() => {
                showAppUI();
            }, 1000);
        } else {
            document.getElementById('registerError').textContent = result.error;
        }
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        const result = await authManager.login(email, password);
        
        if (result.success) {
            // Give Firebase time to update, then it should trigger onAuthStateChanged
            setTimeout(() => {
                showAppUI();
            }, 1000);
        } else {
            document.getElementById('loginError').textContent = result.error;
        }
    });

    // Clear error messages when user starts typing
    document.getElementById('loginEmail').addEventListener('input', () => {
        document.getElementById('loginError').textContent = '';
    });

    document.getElementById('loginPassword').addEventListener('input', () => {
        document.getElementById('loginError').textContent = '';
    });

    document.getElementById('registerEmail').addEventListener('input', () => {
        document.getElementById('registerError').textContent = '';
    });

    document.getElementById('registerPassword').addEventListener('input', () => {
        document.getElementById('registerError').textContent = '';
    });
}

// ==================== APP EVENT LISTENERS ====================

function setupAppEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const result = await authManager.logout();
        if (result.success) {
            showAuthUI();
        }
    });

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.getAttribute('data-page');
            switchPage(page);
        });
    });

    // Transaction modal
    document.getElementById('addTransactionBtn').addEventListener('click', () => {
        openTransactionModal();
    });

    // Close transaction modal
    document.querySelector('#transactionModal .close-btn').addEventListener('click', closeTransactionModal);
    document.querySelector('#transactionModal .cancel-btn').addEventListener('click', closeTransactionModal);

    // Transaction type change
    document.getElementById('transactionType').addEventListener('change', (e) => {
        updateCategoryOptions(e.target.value);
    });

    // Submit transaction form
    document.getElementById('transactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const type = document.getElementById('transactionType').value;
        const category = document.getElementById('transactionCategory').value;
        const amount = document.getElementById('transactionAmount').value;
        const date = document.getElementById('transactionDate').value;
        const notes = document.getElementById('transactionNotes').value;

        if (!category || !amount || !date) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        showLoading();
        let result;

        if (currentEditingTransactionId) {
            // Update
            result = await transactionManager.updateTransaction(
                currentEditingTransactionId,
                type,
                category,
                amount,
                date,
                notes
            );
        } else {
            // Add new
            result = await transactionManager.addTransaction(
                type,
                category,
                amount,
                date,
                notes
            );
        }

        hideLoading();

        if (result.success) {
            closeTransactionModal();
            await loadDashboardData();
            renderTransactionsList();
        }
    });

    // Delete modal
    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        await deleteTransaction();
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

    // Month navigation
    document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
    document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);

    // Chart toggle
    document.querySelectorAll('.chart-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-toggle').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            chartManager.switchChartType(e.target.getAttribute('data-chart-type'));
        });
    });

    // Filters
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('dateFromFilter').addEventListener('change', applyFilters);
    document.getElementById('dateToFilter').addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Delete account modal
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const deleteAccountConfirmInput = document.getElementById('deleteAccountConfirmInput');
    const confirmAccountDeleteBtn = document.getElementById('confirmAccountDeleteBtn');
    const cancelAccountDeleteBtn = document.getElementById('cancelAccountDeleteBtn');

    // Enable/disable delete button based on input
    if (deleteAccountConfirmInput) {
        deleteAccountConfirmInput.addEventListener('input', (e) => {
            confirmAccountDeleteBtn.disabled = e.target.value !== 'DELETE';
        });
    }

    // Confirm delete account
    if (confirmAccountDeleteBtn) {
        confirmAccountDeleteBtn.addEventListener('click', deleteUserAccount);
    }

    // Cancel delete account
    if (cancelAccountDeleteBtn) {
        cancelAccountDeleteBtn.addEventListener('click', () => {
            deleteAccountModal.classList.remove('active');
            deleteAccountConfirmInput.value = '';
            confirmAccountDeleteBtn.disabled = true;
        });
    }

    // Close modals on outside click
    document.getElementById('transactionModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeTransactionModal();
        }
    });

    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeDeleteModal();
        }
    });

    if (deleteAccountModal) {
        deleteAccountModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                deleteAccountModal.classList.remove('active');
                deleteAccountConfirmInput.value = '';
                confirmAccountDeleteBtn.disabled = true;
            }
        });
    }
}

// Show default page when app loads
window.addEventListener('load', () => {
    const user = authManager.getCurrentUser();
    if (user) {
        switchPage('dashboard');
    }
});
