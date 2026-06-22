// UI Module

let currentDisplayMonth = new Date();
let currentEditingTransactionId = null;

// Show app UI
function showAppUI() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    // Update user info
    const user = authManager.getCurrentUser();
    const role = authManager.getUserRole();
    
    document.getElementById('userNameDisplay').textContent = user.email.split('@')[0];
    document.getElementById('userRoleDisplay').textContent = role;
    
    // Show admin nav if admin
    const adminNavBtn = document.getElementById('adminNavBtn');
    if (role === 'admin') {
        adminNavBtn.style.display = 'block';
    } else {
        adminNavBtn.style.display = 'none';
    }

    // Load initial data
    loadDashboardData();
    transactionManager.fetchTransactions();
}

// Show auth UI
function showAuthUI() {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('registerPage').classList.remove('active');
}

// Update dashboard summaries
async function updateDashboardSummaries() {
    const income = transactionManager.calculateTotalIncome();
    const expenses = transactionManager.calculateTotalExpenses();
    const balance = transactionManager.calculateBalance();

    document.getElementById('totalIncome').textContent = income.toFixed(2);
    document.getElementById('totalExpense').textContent = expenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);

    updateMonthlySummary();
}

// Update monthly summary
function updateMonthlySummary() {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();

    const monthlyTotals = transactionManager.calculateMonthlyTotals(year, month);
    
    document.getElementById('monthlyIncome').textContent = monthlyTotals.income.toFixed(2);
    document.getElementById('monthlyExpense').textContent = monthlyTotals.expenses.toFixed(2);
    document.getElementById('monthlyBalance').textContent = monthlyTotals.balance.toFixed(2);

    // Update month display
    const monthName = currentDisplayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('currentMonthDisplay').textContent = monthName;

    // Update category breakdown
    updateCategoryBreakdown(year, month);

    // Update chart
    chartManager.initChart(year, month);
}

// Update category breakdown
function updateCategoryBreakdown(year, month) {
    const categorySpending = transactionManager.getCategoryWiseSpending(year, month);
    const categoryList = document.getElementById('categoryList');

    if (Object.keys(categorySpending).length === 0) {
        categoryList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No expenses recorded for this month</p>';
        return;
    }

    categoryList.innerHTML = '';
    Object.keys(categorySpending).sort((a, b) => categorySpending[b] - categorySpending[a]).forEach(category => {
        const amount = categorySpending[category];
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-amount">₹${amount.toFixed(2)}</span>
        `;
        categoryList.appendChild(categoryItem);
    });
}

// Load dashboard data
async function loadDashboardData() {
    await transactionManager.fetchTransactions();
    await updateDashboardSummaries();
}

// Render transactions list
function renderTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    const transactions = transactionManager.filteredTransactions;

    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <p>No transactions found</p>
            </div>
        `;
        return;
    }

    transactionsList.innerHTML = '';
    transactions.forEach(transaction => {
        const date = transaction.date;
        const dateStr = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        const typeClass = transaction.type === 'Income' ? 'income' : 'expense';
        const amountClass = transaction.type === 'Income' ? 'income' : 'expense';
        const amountSign = transaction.type === 'Income' ? '+' : '-';

        let categoryDisplay = transaction.category;
        if (transaction.type === 'Income') {
            categoryDisplay = 'Income';
        }

        transactionItem.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-type ${typeClass}">${transaction.type}</div>
                <div class="transaction-category">${categoryDisplay}</div>
                <div class="transaction-meta">
                    <span>${dateStr} at ${timeStr}</span>
                    ${transaction.notes ? `<span> • ${transaction.notes}</span>` : ''}
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">${amountSign}₹${transaction.amount.toFixed(2)}</div>
            <div class="transaction-actions">
                <button class="btn btn-secondary" onclick="openEditModal('${transaction.id}')">Edit</button>
                <button class="btn btn-danger" onclick="openDeleteModal('${transaction.id}')">Delete</button>
            </div>
        `;

        transactionsList.appendChild(transactionItem);
    });
}

// Render users list (admin)
async function renderUsersList() {
    const usersList = document.getElementById('usersList');
    const users = await adminManager.getAllUsers();

    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="empty-state">
                <p>No users found</p>
            </div>
        `;
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered Date</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach(user => {
        const registeredDate = adminManager.formatDate(user.createdAt);
        html += `
            <tr>
                <td>${user.name || '-'}</td>
                <td>${user.email}</td>
                <td><span class="role-badge">${user.role}</span></td>
                <td>${registeredDate}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    usersList.innerHTML = html;
}

// Open transaction modal
function openTransactionModal(transactionId = null) {
    const modal = document.getElementById('transactionModal');
    const form = document.getElementById('transactionForm');
    const modalTitle = document.getElementById('modalTitle');

    if (transactionId) {
        // Edit mode
        modalTitle.textContent = 'Edit Transaction';
        const transaction = transactionManager.getTransactionById(transactionId);
        
        if (transaction) {
            document.getElementById('transactionType').value = transaction.type;
            
            // Update category options based on type
            updateCategoryOptions(transaction.type);
            document.getElementById('transactionCategory').value = transaction.category;
            
            document.getElementById('transactionAmount').value = transaction.amount;
            
            // Format date for datetime-local
            const date = transaction.date;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            document.getElementById('transactionDate').value = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            document.getElementById('transactionNotes').value = transaction.notes || '';
            currentEditingTransactionId = transactionId;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add Transaction';
        form.reset();
        document.getElementById('transactionType').value = 'Expense';
        updateCategoryOptions('Expense');
        
        // Set current date/time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('transactionDate').value = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        currentEditingTransactionId = null;
    }

    modal.classList.add('active');
}

// Update category options based on type
function updateCategoryOptions(type) {
    const categorySelect = document.getElementById('transactionCategory');
    
    if (type === 'Income') {
        categorySelect.innerHTML = '<option value="Income">Income</option>';
    } else {
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
        `;
    }
}

// Close transaction modal
function closeTransactionModal() {
    document.getElementById('transactionModal').classList.remove('active');
    currentEditingTransactionId = null;
}

// Open delete confirmation modal
function openDeleteModal(transactionId) {
    document.getElementById('deleteModal').classList.add('active');
    currentEditingTransactionId = transactionId;
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    currentEditingTransactionId = null;
}

// Switch page
function switchPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected page
    if (page === 'dashboard') {
        document.getElementById('dashboardPage').classList.add('active');
        document.querySelector('[data-page="dashboard"]').classList.add('active');
        updateMonthlySummary();
    } else if (page === 'transactions') {
        document.getElementById('transactionsPage').classList.add('active');
        document.querySelector('[data-page="transactions"]').classList.add('active');
        renderTransactionsList();
    } else if (page === 'admin') {
        document.getElementById('adminPage').classList.add('active');
        document.querySelector('[data-page="admin"]').classList.add('active');
        renderUsersList();
    }
}

// Next month
function nextMonth() {
    currentDisplayMonth = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth() + 1, 1);
    updateMonthlySummary();
}

// Previous month
function prevMonth() {
    currentDisplayMonth = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth() - 1, 1);
    updateMonthlySummary();
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('dateFromFilter').value = '';
    document.getElementById('dateToFilter').value = '';
    transactionManager.filterTransactions();
    renderTransactionsList();
}

// Apply filters
function applyFilters() {
    const searchText = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const dateFrom = document.getElementById('dateFromFilter').value;
    const dateTo = document.getElementById('dateToFilter').value;

    transactionManager.filterTransactions(searchText, category, dateFrom, dateTo);
    renderTransactionsList();
}

// Edit transaction
async function editTransaction() {
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
    const result = await transactionManager.updateTransaction(
        currentEditingTransactionId,
        type,
        category,
        amount,
        date,
        notes
    );
    hideLoading();

    if (result.success) {
        closeTransactionModal();
        await loadDashboardData();
        renderTransactionsList();
    }
}

// Delete transaction
async function deleteTransaction() {
    showLoading();
    const result = await transactionManager.deleteTransaction(currentEditingTransactionId);
    hideLoading();

    if (result.success) {
        closeDeleteModal();
        await loadDashboardData();
        renderTransactionsList();
    }
}

// Delete account
async function deleteUserAccount() {
    const confirmInput = document.getElementById('deleteAccountConfirmInput');
    if (confirmInput.value !== 'DELETE') {
        showMessage('Please type DELETE to confirm', 'error');
        return;
    }

    showLoading();
    const result = await authManager.deleteAccount();
    hideLoading();

    if (result.success) {
        document.getElementById('deleteAccountModal').classList.remove('active');
    }
}
