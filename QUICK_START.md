# Personal Budget Tracker - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Get Firebase Credentials (2 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Click ⚙️ → Project Settings
4. Under "Your apps", click "Firebase SDK snippet" → Config
5. Copy the configuration object

### Step 2: Configure the App (1 min)

1. Open `firebase-config.js`
2. Replace `YOUR_API_KEY`, `YOUR_PROJECT`, etc. with your credentials
3. Save the file

### Step 3: Set Up Firestore Rules (1 min)

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /transactions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 4: Run the App (1 min)

1. Open `index.html` in your web browser
2. Or deploy to Firebase Hosting (see README.md)

### Step 5: Create Your Account

1. Click "Register here"
2. Enter name, email, and password
3. Start tracking! 🎉

---

## 📱 Quick Features Reference

| Feature | Path | How to Use |
|---------|------|-----------|
| **Add Transaction** | Dashboard/Transactions | Click "+ Add Transaction" |
| **View Summary** | Dashboard | See income, expenses, balance |
| **Monthly View** | Dashboard | Use ← Prev / Next → to navigate |
| **Toggle Charts** | Dashboard | Click Pie Chart or Bar Chart button |
| **Edit Transaction** | Transactions | Click "Edit" button on transaction |
| **Delete Transaction** | Transactions | Click "Delete" then confirm |
| **Search Notes** | Transactions | Type in search box |
| **Filter by Category** | Transactions | Select from dropdown |
| **Filter by Date** | Transactions | Select From and To dates |
| **View Users** (Admin) | Admin Tab | Only visible if you're an admin |
| **Logout** | Header | Click "Logout" button |

---

## 🎯 Typical Workflow

### First Time Setup
1. Register with email/password
2. Add your current balance as an "Income" transaction
3. Add existing expenses

### Daily Usage
1. After spending, go to Transactions
2. Click "+ Add Transaction"
3. Fill in details and save
4. Dashboard updates automatically

### Monthly Review
1. Go to Dashboard
2. Use month selector to view previous months
3. Check category breakdown
4. Review spending patterns in charts

---

## ❓ Common Questions

**Q: Can I edit past transactions?**  
A: Yes! Click "Edit" on any transaction to modify it.

**Q: Can I delete my account?**  
A: Yes, but it permanently deletes all your data. Future versions will add an account deletion button.

**Q: How many decimal places for amounts?**  
A: Exactly 2 decimal places (e.g., 99.99, 1234.50)

**Q: Can I see other users' data?**  
A: No. Each user can only access their own transactions.

**Q: What if I forget my password?**  
A: Use Firebase's password reset (can be added in future versions)

**Q: Can I use on mobile?**  
A: Yes! The app is fully responsive and works on all devices.

**Q: Can I make a user an admin?**  
A: Yes, manually in Firebase Console:
   1. Go to Firestore → users collection
   2. Find the user document
   3. Change `role` field from "user" to "admin"
   4. They'll see Admin tab on next login

---

## 🐛 Troubleshooting

### "Firebase is not defined"
- Check if Firebase CDN links are loaded (Network tab in DevTools)
- Ensure internet connection is active

### "Cannot add property 'X' to undeclared variable"
- Clear browser cache (Ctrl+Shift+Delete)
- Check that all .js files are loaded in Network tab

### Transactions not saving
- Check Firebase Firestore Rules (see Step 3)
- Ensure you're authenticated (should see Dashboard)
- Check browser console for error messages

### Charts not showing
- Verify expense data exists for the month
- Try switching between chart types
- Check if Chart.js CDN is loading

---

## 📊 Dashboard Breakdown

```
┌─────────────────────────────────────────────────────┐
│              💰 BUDGET TRACKER                     │
│  User Name                     [Logout]             │
├─────────────────────────────────────────────────────┤
│ Dashboard | Transactions | Admin (if admin)        │
├─────────────────────────────────────────────────────┤
│
│  [Total Income]  [Total Expenses]  [Balance]
│    ₹10,000         ₹3,500           ₹6,500
│
│  Monthly Summary
│  ← Prev | June 2026 | Next →
│  [Monthly Income] [Monthly Expenses] [Monthly Balance]
│
│  📊 Chart Type:  [Pie Chart] [Bar Chart]
│  
│  [Pie/Bar Chart Display]
│
│  Category-wise Spending
│  Food         ₹1,500
│  Transport    ₹800
│  Shopping     ₹1,200
│
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security Notes

- Your data is stored securely in Firebase Firestore
- Only you can access your transactions
- Passwords are encrypted by Firebase
- Each login is independent (multi-device support)
- No data is shared between users

---

## 📝 Example Transactions

### Income Example
- Type: Income
- Category: Income (auto-selected)
- Amount: 50000.00
- Date: 2026-06-01 09:00 AM
- Notes: Monthly salary

### Expense Example
- Type: Expense
- Category: Food
- Amount: 450.50
- Date: 2026-06-22 01:00 PM
- Notes: Lunch at restaurant

---

## 🎓 Learning Resources

### Firebase Setup
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)

### Chart.js
- [Chart.js Documentation](https://www.chartjs.org/)
- [Chart Examples](https://www.chartjs.org/docs/latest/samples/)

### Responsive Web Design
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Mobile First](https://www.w3schools.com/css/css_rwd_intro.asp)

---

## 🎉 You're Ready!

Your Personal Budget Tracker is set up and ready to use. Start by:

1. ✅ Registering an account
2. ✅ Adding your first transaction
3. ✅ Viewing the dashboard
4. ✅ Exploring the analytics

Happy budgeting! 🚀

---

**Need Help?** Check the detailed README.md for advanced features and troubleshooting.
