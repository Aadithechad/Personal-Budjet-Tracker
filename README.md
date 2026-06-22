<<<<<<< HEAD
# Personal Budget Tracker

A modern, responsive web application for managing personal finances. Users can track income and expenses, view monthly summaries, and visualize spending patterns through interactive charts.

## Features

### Core Functionality
- ✅ User Authentication (Register/Login/Logout)
- ✅ Transaction Management (Add/Edit/Delete)
- ✅ Automatic Balance Calculation
- ✅ Monthly Summary & Analysis
- ✅ Category-wise Spending Breakdown
- ✅ Interactive Charts (Pie & Bar)
- ✅ Advanced Filtering & Search
- ✅ Account Management & Deletion
- ✅ Admin Dashboard for User Management
- ✅ Responsive Design (Mobile, Tablet, Desktop)

### Transaction Features
- Record income and expenses
- Categorize transactions (Food, Transportation, Shopping, Education, Entertainment, Healthcare, Other)
- Store transaction timestamps with notes
- Support for amounts up to ₹999,999.99 with 2 decimal precision
- Date validation (past and current dates only)
- Edit and delete transactions with confirmation dialogs

### Analytics Features
- Total income, expenses, and balance calculations
- Monthly summaries with category-wise spending
- Pie chart and bar chart visualizations
- Chart type toggle
- Category breakdown display
- Monthly navigation to view previous months

### User Features
- Email & password authentication via Firebase
- Automatic role assignment (user/admin)
- Secure data isolation (users see only their data)
- Account deletion with complete data removal
- Multi-device login support

### Admin Features
- View all registered users
- User information display (name, email, registration date, role)
- No access to user transaction data (Version 1)

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase (Firestore & Authentication)
- **Charts**: Chart.js
- **Hosting**: Firebase Hosting
- **Version Control**: Git/GitHub

## Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project account
- Git (for cloning the repository)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name and complete setup
4. Enable Firebase Authentication (Email/Password)
5. Create Firestore Database in production mode

### 2. Get Firebase Credentials

1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click "Firebase SDK snippet" and select "Config"
4. Copy the Firebase configuration object

### 3. Configure the Application

1. Open `firebase-config.js`
2. Replace the placeholder credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save the file

### 4. Set Up Firestore Rules

In Firebase Console → Firestore Database → Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only user can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Transactions collection - only user can access their own transactions
    match /transactions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Deploy to Firebase Hosting

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init hosting

# Deploy
firebase deploy
```

Or simply open `index.html` in your browser to run locally.

## Project Structure

```
personal-budget-tracker/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── firebase-config.js  # Firebase configuration
├── auth.js            # Authentication logic
├── transactions.js    # Transaction management
├── charts.js          # Chart visualization
├── admin.js           # Admin features
├── ui.js              # UI updates and helpers
├── app.js             # Event listeners and initialization
└── README.md          # Documentation
```

## File Descriptions

### index.html
- Complete HTML structure with auth pages, dashboard, transactions, and admin sections
- Modals for adding/editing transactions and account deletion
- Links to all JavaScript and external libraries

### styles.css
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- Dark mode variables system
- Animations and transitions

### firebase-config.js
- Firebase initialization
- Global helper functions (showLoading, hideLoading, showMessage)

### auth.js
- `AuthManager` class for user authentication
- Register, login, logout, delete account functions
- User role fetching and management
- Firebase Auth state listener

### transactions.js
- `TransactionManager` class for transaction operations
- Add, update, delete transaction methods
- Filtering and search functionality
- Calculations for income, expenses, balance
- Monthly summaries and category breakdown

### charts.js
- `ChartManager` class for chart visualization
- Pie chart and bar chart implementation
- Chart type switching
- Real-time chart updates

### admin.js
- `AdminManager` class for admin features
- Get all users functionality
- User data formatting
- Admin role check

### ui.js
- Dashboard data updates
- Transaction list rendering
- User list rendering (admin)
- Modal management
- Page navigation
- Filter application
- Month navigation

### app.js
- Event listener setup for all interactive elements
- Form submissions (login, register, transaction)
- Button click handlers
- Modal interactions
- Real-time filter updates

## Usage Guide

### Registering a New Account

1. Click "Register here" on login page
2. Enter full name, email, and password
3. Click "Register"
4. You'll be automatically logged in
5. Your role is set to "user" by default

### Adding a Transaction

1. Click "+ Add Transaction" on Dashboard or Transactions page
2. Select Transaction Type (Income/Expense)
3. Choose Category (auto-selected for Income)
4. Enter Amount (0.01 - 999,999.99)
5. Select Date and Time (past/current only)
6. Add optional Notes
7. Click "Save Transaction"

### Viewing Transactions

- **Dashboard**: See summary cards and monthly overview
- **Transactions Page**: View all transactions with applied filters
- Use Search to find by notes
- Filter by Category to see specific expense types
- Use Date Range to view transactions between specific dates
- Click "Clear Filters" to reset

### Understanding the Dashboard

- **Summary Cards**: Total income, expenses, and balance
- **Monthly Summary**: Current month totals (customizable via month selector)
- **Category Breakdown**: Shows how much spent per category
- **Charts**: Toggle between Pie and Bar chart views
- **Month Navigation**: View previous months' data

### Editing and Deleting

- Click "Edit" on any transaction to modify it
- Click "Delete" and confirm to remove a transaction
- Changes update immediately

### Admin Features

1. Only users with "admin" role see Admin tab
2. View list of all registered users with their details
3. To promote a user to admin:
   - Go to Firebase Console → Firestore
   - Find user document in "users" collection
   - Change role field from "user" to "admin"
   - User will see Admin tab on next login

### Deleting Your Account

1. (Feature placeholder - requires adding delete button to UI)
2. Confirms deletion requirement
3. Requires typing "DELETE" to confirm
4. Permanently removes all account data

## Data Structure

### Users Collection
```json
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "timestamp"
}
```

### Transactions Collection
```json
{
  "userId": "firebase-uid",
  "type": "Expense",
  "category": "Food",
  "amount": 250.50,
  "date": "timestamp",
  "timestamp": 1624876800000,
  "notes": "Lunch with team",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Validation Rules

- **Email**: Valid email format required
- **Password**: Minimum 6 characters
- **Amount**: Between 0.01 and 999,999.99, 2 decimal precision
- **Date**: Past or current date only (no future dates)
- **Categories**: Predefined list (no custom categories in V1)

## Security Features

- Firebase Authentication with email/password
- Firestore security rules preventing unauthorized access
- Users can only view/modify their own transactions
- Admins cannot access user financial data (V1)
- Secure session management across devices

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

- **Mobile** (< 480px): Single column layout, optimized touch targets
- **Tablet** (480-768px): Two column layout, readable fonts
- **Desktop** (> 768px): Full multi-column layout, advanced features

## Performance

- Lazy loading of transaction data
- Real-time updates via Firestore listeners
- Optimized chart rendering
- CSS animations for smooth UX
- Minimal dependencies (only Chart.js)

## Troubleshooting

### Firebase Credentials Error
- Verify all credentials are correct in `firebase-config.js`
- Ensure Firebase project is active
- Check that Firestore database is created

### Transactions Not Showing
- Verify Firestore security rules are correctly set
- Check that user is authenticated
- Ensure transactions have matching userId

### Charts Not Displaying
- Verify Chart.js CDN link in HTML
- Check that expense data exists for the month
- Try switching chart type

### Filters Not Working
- Ensure transactions data is loaded
- Check date format (should be YYYY-MM-DD)
- Verify category names match exactly

### Authentication Issues
- Clear browser cache and cookies
- Verify email format is correct
- Ensure password is at least 6 characters
- Check Firebase Authentication is enabled

## Future Enhancements (Out of Scope - V1)

- Custom expense categories
- Recurring transactions
- Budget goals and alerts
- Receipt photo scanning
- PDF/CSV export
- Bank account integration
- Multi-currency support
- Dark mode theme
- Offline functionality
- Mobile app

## Support

For issues or questions:
1. Check Firestore rules and security configuration
2. Review browser console for error messages
3. Verify Firebase credentials are correct
4. Check transaction data format in Firestore
5. Clear browser cache and reload

## License

This project is open source and available under the MIT License.

## Author

Created with ❤️ for personal finance management.

---

**Version**: 1.0.0  
**Last Updated**: June 2026
=======
# Personal-Budjet-Tracker
>>>>>>> 29f2d9e2beabce6f0458a64c8591ca61b16bab68
