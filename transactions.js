// Transactions Module

class TransactionManager {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentEditingId = null;
    }

    // Add new transaction
    async addTransaction(type, category, amount, date, notes = '') {
        try {
            const userId = authManager.getCurrentUser().uid;
            
            // Validate amount
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum < 0.01 || amountNum > 999999.99) {
                showMessage('Invalid amount', 'error');
                return { success: false };
            }

            // Validate date is not in future
            const selectedDate = new Date(date);
            if (selectedDate > new Date()) {
                showMessage('Future dates are not allowed', 'error');
                return { success: false };
            }

            const transaction = {
                userId: userId,
                type: type,
                category: category,
                amount: parseFloat(amountNum.toFixed(2)),
                date: selectedDate,
                timestamp: selectedDate.getTime(),
                notes: notes.trim(),
                createdAt: new Date()
            };

            const docRef = await db.collection('transactions').add(transaction);
            showMessage('Transaction added successfully', 'success');
            
            await this.fetchTransactions();
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error adding transaction:', error);
            showMessage(error.message, 'error');
            return { success: false, error };
        }
    }

    // Update transaction
    async updateTransaction(id, type, category, amount, date, notes = '') {
        try {
            const userId = authManager.getCurrentUser().uid;
            
            // Validate amount
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum < 0.01 || amountNum > 999999.99) {
                showMessage('Invalid amount', 'error');
                return { success: false };
            }

            // Validate date is not in future
            const selectedDate = new Date(date);
            if (selectedDate > new Date()) {
                showMessage('Future dates are not allowed', 'error');
                return { success: false };
            }

            const transaction = {
                type: type,
                category: category,
                amount: parseFloat(amountNum.toFixed(2)),
                date: selectedDate,
                timestamp: selectedDate.getTime(),
                notes: notes.trim(),
                updatedAt: new Date()
            };

            await db.collection('transactions').doc(id).update(transaction);
            showMessage('Transaction updated successfully', 'success');
            
            await this.fetchTransactions();
            return { success: true };
        } catch (error) {
            console.error('Error updating transaction:', error);
            showMessage(error.message, 'error');
            return { success: false, error };
        }
    }

    // Delete transaction
    async deleteTransaction(id) {
        try {
            await db.collection('transactions').doc(id).delete();
            showMessage('Transaction deleted successfully', 'success');
            
            await this.fetchTransactions();
            return { success: true };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showMessage(error.message, 'error');
            return { success: false, error };
        }
    }

    // Fetch all transactions for current user
    async fetchTransactions() {
        try {
            const userId = authManager.getCurrentUser().uid;
            
            const snapshot = await db.collection('transactions')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .get();

            this.transactions = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                this.transactions.push({
                    id: doc.id,
                    ...data,
                    date: data.date ? data.date.toDate ? data.date.toDate() : new Date(data.date) : new Date()
                });
            });

            this.filteredTransactions = [...this.transactions];
            return this.transactions;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }

    // Apply filters to transactions
    filterTransactions(searchText = '', category = '', dateFrom = '', dateTo = '') {
        this.filteredTransactions = this.transactions.filter(transaction => {
            // Search in notes
            if (searchText && !transaction.notes.toLowerCase().includes(searchText.toLowerCase())) {
                return false;
            }

            // Filter by category
            if (category && transaction.category !== category) {
                return false;
            }

            // Filter by date range
            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (transaction.date < fromDate) {
                    return false;
                }
            }

            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (transaction.date > toDate) {
                    return false;
                }
            }

            return true;
        });

        return this.filteredTransactions;
    }

    // Get transactions for specific month
    getMonthTransactions(year, month) {
        return this.transactions.filter(transaction => {
            const date = transaction.date;
            return date.getFullYear() === year && date.getMonth() === month;
        });
    }

    // Calculate total income
    calculateTotalIncome() {
        return this.transactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    // Calculate total expenses
    calculateTotalExpenses() {
        return this.transactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    // Calculate balance
    calculateBalance() {
        return this.calculateTotalIncome() - this.calculateTotalExpenses();
    }

    // Calculate monthly totals
    calculateMonthlyTotals(year, month) {
        const monthTransactions = this.getMonthTransactions(year, month);
        
        const income = monthTransactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = monthTransactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            income: parseFloat(income.toFixed(2)),
            expenses: parseFloat(expenses.toFixed(2)),
            balance: parseFloat((income - expenses).toFixed(2))
        };
    }

    // Get category-wise spending
    getCategoryWiseSpending(year, month) {
        const monthTransactions = this.getMonthTransactions(year, month);
        const expenseTransactions = monthTransactions.filter(t => t.type === 'Expense');
        
        const categorySpending = {};
        expenseTransactions.forEach(transaction => {
            if (!categorySpending[transaction.category]) {
                categorySpending[transaction.category] = 0;
            }
            categorySpending[transaction.category] += transaction.amount;
        });

        // Filter out zero values and format
        const result = {};
        Object.keys(categorySpending).forEach(category => {
            const amount = parseFloat(categorySpending[category].toFixed(2));
            if (amount > 0) {
                result[category] = amount;
            }
        });

        return result;
    }

    // Get transaction by ID
    getTransactionById(id) {
        return this.transactions.find(t => t.id === id);
    }

    // Set editing ID
    setEditingId(id) {
        this.currentEditingId = id;
    }

    // Get editing ID
    getEditingId() {
        return this.currentEditingId;
    }

    // Clear editing ID
    clearEditingId() {
        this.currentEditingId = null;
    }
}

// Create global transaction manager instance
const transactionManager = new TransactionManager();
