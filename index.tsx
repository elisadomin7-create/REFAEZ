
/**
 * 🔐 FINAL FIREBASE SECURITY RULES (FOR LIVE APP) 🔐
 * 
 * ১. Realtime Database Rules (Copy and Paste in RTDB Rules tab):
 * ------------------------------------------------------------
 * {
 *   "rules": {
 *     "settings": {
 *       ".read": "true",
 *       ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'ADMIN'"
 *     },
 *     "users": {
 *       ".read": "auth != null",
 *       "$userId": {
 *         ".write": "auth != null && (auth.uid === $userId || root.child('users').child(auth.uid).child('role').val() === 'ADMIN')"
 *       }
 *     },
 *     "tasks": {
 *       ".read": "auth != null",
 *       ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'ADMIN'"
 *     },
 *     "withdrawals": {
 *       ".read": "auth != null",
 *       ".write": "auth != null"
 *     },
 *     "deposits": {
 *       ".read": "auth != null",
 *       ".write": "auth != null"
 *     },
 *     "verifications": {
 *       ".read": "auth != null",
 *       ".write": "auth != null"
 *     },
 *     "messages": {
 *       ".read": "auth != null",
 *       ".write": "auth != null"
 *     },
 *     "notifications": {
 *       ".read": "true",
 *       ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'ADMIN'"
 *     },
 *     "taskLogs": {
 *       ".read": "auth != null",
 *       ".write": "auth != null"
 *     }
 *   }
 * }
 * ------------------------------------------------------------
 * 
 * ২. Cloud Firestore Rules (যদি ব্যবহার করেন):
 * ------------------------------------------------------------
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /{document=**} {
 *       // শুধুমাত্র লগইন করা ইউজাররা পড়তে ও লিখতে পারবে
 *       allow read, write: if request.auth != null;
 *     }
 *   }
 * }
 * ------------------------------------------------------------
 * 
 * গুরুত্বপূর্ণ নোট: 
 * - 'auth != null' নিশ্চিত করে যে আপনার অ্যাপে সাইন-ইন না করে কেউ ডাটা দেখতে পারবে না।
 * - 'root.child(...).val() === 'ADMIN'' নিশ্চিত করে যে শুধুমাত্র এডমিনরাই সেটিংস পরিবর্তন করতে পারবে।
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
