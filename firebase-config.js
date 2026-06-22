// Firebase Configuration
// IMPORTANT: Replace these with your own Firebase project credentials

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase instances
const auth = firebase.auth();
const db = firebase.firestore();

// Helper to show loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Helper to show temporary messages
function showMessage(message, type = 'success') {
    const element = document.createElement('div');
    element.className = `${type}-message`;
    element.textContent = message;
    element.style.position = 'fixed';
    element.style.top = '20px';
    element.style.right = '20px';
    element.style.zIndex = '3000';
    element.style.padding = '12px 20px';
    element.style.borderRadius = '8px';
    element.style.fontSize = '14px';
    element.style.fontWeight = '600';
    
    if (type === 'success') {
        element.style.backgroundColor = '#10b981';
        element.style.color = 'white';
    } else if (type === 'error') {
        element.style.backgroundColor = '#ef4444';
        element.style.color = 'white';
    }
    
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 3000);
}
