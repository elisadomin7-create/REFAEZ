
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, set, onValue, push, update, remove, get } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { 
  User, Task, WithdrawalRequest, AppSettings, Transaction, 
  UserRole, AccountStatus, TaskLog, WithdrawalStatus, TaskType, Notification,
  DepositRequest, DepositStatus, VerificationRequest, VerificationStatus, ChatMessage
} from '../types';

import { GoogleGenAI } from "@google/genai";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  withdrawals: WithdrawalRequest[];
  deposits: DepositRequest[];
  verificationRequests: VerificationRequest[];
  settings: AppSettings;
  transactions: Transaction[];
  taskLogs: TaskLog[];
  notifications: Notification[];
  messages: ChatMessage[];
  urlRefCode: string | null;
  askAI: (prompt: string) => Promise<string>;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean, message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean, message?: string, isDomainError?: boolean }>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password?: string, refCode?: string) => Promise<void>;
  applyReferralCode: (code: string) => void;
  updateSettings: (newSettings: AppSettings) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  completeTask: (taskId: string) => void;
  requestWithdrawal: (amount: number, method: 'Bkash' | 'Nagad' | 'Manual', account: string) => void;
  processWithdrawal: (id: string, status: WithdrawalStatus) => void;
  submitDeposit: (amount: number, method: 'Bkash' | 'Nagad', senderNumber: string, trxId: string) => void;
  processDeposit: (id: string, status: DepositStatus) => void;
  submitVerification: (paymentNumber: string, transactionId: string) => void;
  processVerification: (id: string, status: VerificationStatus) => void;
  verifyUser: (id: string, toggle: boolean) => void;
  setAdFreeStatus: (userId: string, status: boolean) => void;
  buyAdFree: () => void;
  manageUser: (id: string, status: AccountStatus, balanceChange?: number, reason?: string, days?: number) => void;
  deleteUser: (userId: string) => void;
  scheduleAccountDeletion: () => void;
  recoverAccount: () => void;
  broadcastNotification: (title: string, message: string) => void;
  sendChatMessage: (text: string, isAdmin: boolean, targetUserId?: string) => void;
  sendOtp: (email: string) => void;
  verifyAndResetPassword: (email: string, otp: string, newPass: string) => boolean;
  deleteMessage: (messageId: string) => void;
  updateUserProfile: (name: string, phone: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('earnmaster_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [urlRefCode, setUrlRefCode] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('earnmaster_settings');
    const defaults: AppSettings = { 
      appName: 'EarnMaster AI Pro', 
      appLogoUrl: 'https://cdn-icons-png.flaticon.com/512/2488/2488961.png',
      packageName: 'com.earnmaster.pro', 
      coinName: 'Points', 
      premiumPackageName: 'Premium VIP', 
      conversionRate: 0.5, 
      referralRewardUser: 20, 
      referralRewardReferrer: 100, 
      minWithdrawal: 500, 
      withdrawalFeePercent: 10, 
      adFreeSubscriptionPrice: 200, 
      depositCommissionPercent: 5,
      externalAdCode: '',
      isReferralSystemEnabled: true, 
      isEarningEnabled: true, 
      customAds: [],
      adPosts: [],
      adKeys: { admobAppId: '', banner: '', interstitial: '', rewarded: '', applovinKey: '', unityGameId: '' },
      firebaseConfig: {
        apiKey: "AIzaSyAe1P_pq0wgtVDaeKeYD-BvaMePzXcsmwM",
        authDomain: "faltu-7eeb0.firebaseapp.com",
        projectId: "faltu-7eeb0",
        storageBucket: "faltu-7eeb0.firebasestorage.app",
        messagingSenderId: "108838762498",
        appId: "1:108838762498:web:f767add969b841ce610f1b",
        measurementId: "G-HQGF38PR4H",
        databaseURL: "https://faltu-7eeb0-default-rtdb.firebaseio.com"
      },
      themeColor: '#3b82f6', language: 'EN', theme: 'LIGHT', notifExpiryHours: 24, noticeBoard: 'Welcome to EarnMaster Pro! Verify your account to start earning.',
      bkashNumber: '017XXXXXXXX', nagadNumber: '018XXXXXXXX', verificationLink: 'https://t.me/admin', facebookLink: 'https://facebook.com',
      telegramLink: 'https://t.me', whatsappLink: 'https://wa.me',
      adminEmail: 'admin@earnmaster9.99.com',
      adminPassword: '@ADMINDMPT9.99%',
      aiProvider: 'GEMINI',
      tutorialVideoLink: '',
      moreAppsLink: ''
    };
    if (saved) return { ...defaults, ...JSON.parse(saved) };
    return defaults;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { auth, db } = useMemo(() => {
    try {
      const config = settings.firebaseConfig;
      const app = getApps().length === 0 ? initializeApp(config) : getApp();
      return { auth: getAuth(app), db: getDatabase(app) };
    } catch (error) {
      console.error("Firebase Init Error:", error);
      return { auth: null, db: null };
    }
  }, [settings.firebaseConfig]);

  // Global Sync Listeners
  useEffect(() => {
    if (!db) return;

    // Listen for Settings
    const unsubscribeSettings = onValue(ref(db, 'settings'), (snapshot) => {
      const data = snapshot.val();
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });

    // Listen for Users
    const unsubscribeUsers = onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.values(data) as User[];
        setUsers(userList);
        
        // Sync current user if logged in
        if (currentUser && currentUser.role === UserRole.USER) {
          const updatedMe = userList.find(u => u.id === currentUser.id);
          if (updatedMe) setCurrentUser(updatedMe);
        }
      } else {
        setUsers([]);
      }
    });

    // Listen for Tasks
    const unsubscribeTasks = onValue(ref(db, 'tasks'), (snapshot) => {
      const data = snapshot.val();
      if (data) setTasks(Object.values(data));
      else setTasks([]);
    });

    // Listen for Withdrawals
    const unsubscribeWithdrawals = onValue(ref(db, 'withdrawals'), (snapshot) => {
      const data = snapshot.val();
      if (data) setWithdrawals(Object.values(data));
      else setWithdrawals([]);
    });

    // Listen for Deposits
    const unsubscribeDeposits = onValue(ref(db, 'deposits'), (snapshot) => {
      const data = snapshot.val();
      if (data) setDeposits(Object.values(data));
      else setDeposits([]);
    });

    // Listen for Messages
    const unsubscribeMessages = onValue(ref(db, 'messages'), (snapshot) => {
      const data = snapshot.val();
      if (data) setMessages(Object.values(data));
      else setMessages([]);
    });

    // Listen for Notifications
    const unsubscribeNotifs = onValue(ref(db, 'notifications'), (snapshot) => {
      const data = snapshot.val();
      if (data) setNotifications(Object.values(data));
      else setNotifications([]);
    });

    // Listen for Verifications
    const unsubscribeVerifs = onValue(ref(db, 'verifications'), (snapshot) => {
      const data = snapshot.val();
      if (data) setVerificationRequests(Object.values(data));
      else setVerificationRequests([]);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeUsers();
      unsubscribeTasks();
      unsubscribeWithdrawals();
      unsubscribeDeposits();
      unsubscribeMessages();
      unsubscribeNotifs();
      unsubscribeVerifs();
    };
  }, [db, currentUser?.id]);

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        const saved = localStorage.getItem('earnmaster_current_user');
        const user = saved ? JSON.parse(saved) : null;
        
        // If user is Admin but not authenticated in Firebase, force logout to fix permissions
        if (user && user.role === UserRole.ADMIN) {
           console.log("Admin session invalid (no Firebase Auth). Forcing logout.");
           setCurrentUser(null);
           localStorage.removeItem('earnmaster_current_user');
           return;
        }

        if (user && user.role !== UserRole.ADMIN) {
           setCurrentUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#ref=')) {
      const code = hash.split('=')[1];
      if (code) setUrlRefCode(code.toUpperCase());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('earnmaster_current_user', JSON.stringify(currentUser));
    localStorage.setItem('earnmaster_settings', JSON.stringify(settings));
    if (settings.theme === 'DARK') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [currentUser, settings]);

  const saveToDb = (path: string, data: any) => {
    if (!db) {
      alert("Database not connected. Please check your internet connection.");
      return;
    }
    set(ref(db, path), data)
      .catch(err => alert(`Error saving data: ${err.message}`));
  };

  const login = async (email: string, password?: string, role: UserRole = UserRole.USER) => {
    // FIXED ADMIN CREDENTIALS AS PER USER REQUEST
    const masterAdminEmail = 'admin@earnmaster9.99.com';
    const masterAdminPass = '@ADMINDMPT9.99%';

    if (email === masterAdminEmail && role === UserRole.ADMIN && password === masterAdminPass) {
      try {
        // Attempt to sign in to Firebase as Admin to get Write Access
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth!, email, password);
        } catch (e: any) {
          // If admin doesn't exist in Firebase, create them
          if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
            userCredential = await createUserWithEmailAndPassword(auth!, email, password);
          } else {
            throw e;
          }
        }

        // Use the REAL Firebase UID for the admin to ensure database rules work
        const adminUser: User = {
          id: userCredential.user.uid, 
          uid: '00000001', 
          email: masterAdminEmail, 
          phone: '01700000000', 
          name: 'Super Admin',
          password: masterAdminPass, 
          role: UserRole.ADMIN, 
          status: AccountStatus.ACTIVE, 
          isVerified: true,
          verificationStatus: VerificationStatus.APPROVED, 
          isAdFree: true, 
          points: 1000000, 
          referralCode: 'ADMIN',
          referralCount: 0, 
          totalEarned: 0, 
          createdAt: Date.now(), 
          deviceId: 'MASTER', 
          hasUsedReferral: false
        };
        
        // Save Admin Profile to DB to ensure consistency
        saveToDb(`users/${adminUser.id}`, adminUser);
        setCurrentUser(adminUser);
        return { success: true };

      } catch (error: any) {
        console.error("Admin Auth Error:", error);
        return { success: false, message: "Admin Auth Failed: " + error.message };
      }
    }

    if (!auth) return { success: false, message: "Auth failed" };

    try {
      const result = await signInWithEmailAndPassword(auth, email, password || '');
      const dbUser = users.find(u => u.id === result.user.uid);
      if (dbUser) {
        if (dbUser.status === AccountStatus.BANNED) return { success: false, message: "Account is Banned." };
        setCurrentUser(dbUser);
        return { success: true };
      }
      return { success: false, message: "User data not found in DB." };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) return { success: false, message: "Firebase connection failed." };
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      
      let existingUser = users.find(u => u.id === user.uid);
      
      if (!existingUser) {
        existingUser = {
          id: user.uid,
          uid: Math.floor(10000000 + Math.random() * 90000000).toString(),
          email: user.email || '',
          phone: '',
          name: user.displayName || 'Google User',
          role: UserRole.USER,
          status: AccountStatus.ACTIVE,
          isVerified: false,
          verificationStatus: VerificationStatus.NOT_APPLIED,
          isAdFree: false,
          points: 0,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          referralCount: 0,
          totalEarned: 0,
          hasUsedReferral: false,
          createdAt: Date.now(),
          deviceId: 'G_' + user.uid.substring(0, 5)
        };
        saveToDb(`users/${existingUser.id}`, existingUser);
      }
      setCurrentUser(existingUser);
      return { success: true };
    } catch (error: any) {
      const isDomainError = error.code === 'auth/unauthorized-domain';
      return { success: false, message: error.message, isDomainError };
    }
  };

  const logout = () => {
    if (auth) signOut(auth);
    setCurrentUser(null);
  };

  const register = async (name: string, email: string, phone: string, password?: string, refCode?: string) => {
    if (!auth) return;
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password || '');
      const user = result.user;
      const newUser: User = {
        id: user.uid,
        uid: Math.floor(10000000 + Math.random() * 90000000).toString(),
        email, phone, name, role: UserRole.USER, status: AccountStatus.ACTIVE,
        isVerified: false, verificationStatus: VerificationStatus.NOT_APPLIED, isAdFree: false, points: 0,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(), referredBy: refCode,
        hasUsedReferral: !!refCode, referralCount: 0, totalEarned: 0, createdAt: Date.now(),
        deviceId: 'WEB_' + user.uid.substring(0, 5)
      };
      saveToDb(`users/${newUser.id}`, newUser);
      setCurrentUser(newUser);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const applyReferralCode = (code: string) => {
    if (!currentUser || currentUser.hasUsedReferral || !db) return;
    const referrer = users.find(u => u.referralCode === code.toUpperCase());
    if (!referrer || referrer.id === currentUser.id) {
      alert("Invalid Referral Code.");
      return;
    }
    update(ref(db, `users/${currentUser.id}`), { referredBy: code.toUpperCase(), hasUsedReferral: true })
      .then(() => alert("Referral Applied!"))
      .catch(err => alert(err.message));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveToDb('settings', newSettings);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const id = 't_' + Date.now();
    saveToDb(`tasks/${id}`, { ...task, id });
  };

  const deleteTask = (id: string) => {
    if (db) remove(ref(db, `tasks/${id}`));
  };

  const completeTask = (taskId: string) => {
    if (!currentUser || !currentUser.isVerified || !db) { alert("Please verify your account first."); return; }
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const todayStr = new Date().toDateString();
    const alreadyDoneToday = taskLogs.some(log => 
      log.userId === currentUser.id && log.taskId === taskId && new Date(log.completedAt).toDateString() === todayStr
    );
    if (alreadyDoneToday) return alert("Task done for today.");
    update(ref(db, `users/${currentUser.id}`), { 
      points: currentUser.points + task.reward, 
      totalEarned: currentUser.totalEarned + task.reward 
    }).then(() => {
      saveToDb(`taskLogs/log_${currentUser.id}_${taskId}_${Date.now()}`, { userId: currentUser.id, taskId, completedAt: Date.now() });
      alert("Task Completed! Reward Added.");
    }).catch(err => alert(err.message));
  };

  const requestWithdrawal = (amount: number, method: 'Bkash' | 'Nagad' | 'Manual', accountNumber: string) => {
    if (!currentUser || !db) return;
    const id = 'w_' + Date.now();
    const feeAmount = (amount * settings.withdrawalFeePercent) / 100;
    const newReq: WithdrawalRequest = { id, userId: currentUser.id, userName: currentUser.name, amount, feeAmount, payoutAmount: amount - feeAmount, method, accountNumber, status: WithdrawalStatus.PENDING, createdAt: Date.now() };
    saveToDb(`withdrawals/${id}`, newReq);
    update(ref(db, `users/${currentUser.id}`), { points: currentUser.points - (amount / settings.conversionRate) })
      .then(() => alert("Withdrawal Request Sent!"))
      .catch(err => alert(err.message));
  };

  const processWithdrawal = (id: string, status: WithdrawalStatus) => {
    if (!db) return;
    update(ref(db, `withdrawals/${id}`), { status })
      .then(() => alert(`Withdrawal ${status}!`))
      .catch(err => alert(err.message));

    if (status === WithdrawalStatus.REJECTED) {
      const req = withdrawals.find(w => w.id === id);
      if (req) {
        const user = users.find(u => u.id === req.userId);
        if (user) update(ref(db, `users/${user.id}`), { points: user.points + (req.amount / settings.conversionRate) });
      }
    }
  };

  const submitDeposit = (amount: number, method: 'Bkash' | 'Nagad', senderNumber: string, transactionId: string) => {
    if (!currentUser || !db) return;
    const id = 'dp_' + Date.now();
    saveToDb(`deposits/${id}`, { id, userId: currentUser.id, userName: currentUser.name, amount, method, senderNumber, transactionId, status: DepositStatus.PENDING, createdAt: Date.now() });
  };

  const processDeposit = (id: string, status: DepositStatus) => {
    if (!db) return;
    update(ref(db, `deposits/${id}`), { status })
      .then(() => alert(`Deposit ${status}!`))
      .catch(err => alert(err.message));

    if (status === DepositStatus.APPROVED) {
      const req = deposits.find(d => d.id === id);
      if (req) {
        const user = users.find(u => u.id === req.userId);
        if (user) update(ref(db, `users/${user.id}`), { points: user.points + (req.amount / settings.conversionRate) });
      }
    }
  };

  const submitVerification = (paymentNumber: string, transactionId: string) => {
    if (!currentUser || !db) return;
    const id = 'v_' + Date.now();
    saveToDb(`verifications/${id}`, { id, userId: currentUser.id, userName: currentUser.name, paymentNumber, transactionId, timestamp: Date.now(), status: VerificationStatus.PENDING });
    update(ref(db, `users/${currentUser.id}`), { verificationStatus: VerificationStatus.PENDING });
  };

  const processVerification = (id: string, status: VerificationStatus) => {
    if (!db) return;
    update(ref(db, `verifications/${id}`), { status })
      .then(() => alert(`Verification ${status}!`))
      .catch(err => alert(err.message));

    if (status === VerificationStatus.APPROVED) {
      const req = verificationRequests.find(v => v.id === id);
      if (req) {
        const user = users.find(u => u.id === req.userId);
        if (user) {
          let updates: any = { isVerified: true, verificationStatus: status, points: user.points + settings.referralRewardUser };
          if (user.referredBy) {
            const referrer = users.find(u => u.referralCode === user.referredBy);
            if (referrer) {
              update(ref(db, `users/${referrer.id}`), { 
                points: referrer.points + settings.referralRewardReferrer,
                referralCount: (referrer.referralCount || 0) + 1 
              });
            }
          }
          update(ref(db, `users/${user.id}`), updates);
        }
      }
    }
  };

  const verifyUser = (id: string, toggle: boolean) => {
    if (!db) return;
    update(ref(db, `users/${id}`), { isVerified: toggle, verificationStatus: toggle ? VerificationStatus.APPROVED : VerificationStatus.NOT_APPLIED })
      .then(() => alert(`User Verification Updated!`))
      .catch(err => alert(err.message));
  };

  const setAdFreeStatus = (userId: string, status: boolean) => {
    if (!db) return;
    update(ref(db, `users/${userId}`), { isAdFree: status })
      .then(() => alert(`Ad-Free Status Updated!`))
      .catch(err => alert(err.message));
  };

  const buyAdFree = () => {
    if (!currentUser || !db) return;
    const cost = settings.adFreeSubscriptionPrice / settings.conversionRate;
    if (currentUser.points < cost) return alert("Insufficient balance.");
    update(ref(db, `users/${currentUser.id}`), { points: currentUser.points - cost, isAdFree: true });
  };

  const manageUser = (id: string, status: AccountStatus, balanceChange?: number, reason?: string, days?: number) => {
    if (!db) return;
    const user = users.find(u => u.id === id);
    if (!user) return;
    const updateData: any = { status, banReason: reason || '' };
    if (balanceChange) updateData.points = user.points + balanceChange;
    if (days && days > 0) updateData.banUntil = Date.now() + (days * 24 * 60 * 60 * 1000);
    
    update(ref(db, `users/${id}`), updateData)
      .then(() => alert("User Updated Successfully!"))
      .catch(err => alert(err.message));
  };

  const deleteUser = (userId: string) => {
    if (db) remove(ref(db, `users/${userId}`))
      .then(() => alert("User Deleted!"))
      .catch(err => alert(err.message));
  };

  const broadcastNotification = (title: string, message: string) => {
    if (!db) return;
    const id = 'n_' + Date.now();
    saveToDb(`notifications/${id}`, { id, title, message, timestamp: Date.now() });
  };

  const askAI = async (prompt: string) => {
    try {
      const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return "AI Assistant is currently offline. Please contact support.";

      // Handle OpenRouter / OpenAI Compatible
      if (settings.aiProvider === 'OPENROUTER') {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "google/gemini-2.0-flash-lite-preview-02-05:free", // Default free model
            "messages": [
              {
                "role": "system",
                "content": `You are the EarnMaster Pro AI Assistant. 
                Your goal is to help users earn more points in the app. 
                The app features: Daily Missions (Video, Visit, Install), Referrals (Refer friends for ${settings.referralRewardReferrer} ${settings.coinName}), 
                and Withdrawals (Min ${settings.minWithdrawal} BDT). 
                Current conversion rate: 1 BDT = ${1/settings.conversionRate} ${settings.coinName}.
                Be helpful, encouraging, and professional. Keep answers concise.
                DO NOT reveal admin secrets or system internals.`
              },
              { "role": "user", "content": prompt }
            ]
          })
        });
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that right now.";
      }

      // Default: Gemini API
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: prompt,
        config: {
          systemInstruction: `You are the EarnMaster Pro AI Assistant. 
          Your goal is to help users earn more points in the app. 
          The app features: Daily Missions (Video, Visit, Install), Referrals (Refer friends for ${settings.referralRewardReferrer} ${settings.coinName}), 
          and Withdrawals (Min ${settings.minWithdrawal} BDT). 
          Current conversion rate: 1 BDT = ${1/settings.conversionRate} ${settings.coinName}.
          Be helpful, encouraging, and professional. Keep answers concise.
          DO NOT reveal admin secrets or system internals.`
        }
      });
      return response.text || "I'm sorry, I couldn't process that right now.";
    } catch (error) {
      console.error("AI Error:", error);
      return "AI Service is temporarily unavailable.";
    }
  };

  const sendChatMessage = (text: string, isAdmin: boolean, targetUserId?: string) => {
    if (!currentUser || !db) return;
    const id = 'msg_' + Date.now();
    const chatId = isAdmin && targetUserId ? targetUserId : currentUser.id;
    saveToDb(`messages/${id}`, { id, userId: chatId, senderId: currentUser.id, senderName: currentUser.name, text, isAdmin, timestamp: Date.now() });
  };

  const sendOtp = (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = users.find(u => u.email === email);
    if (user && db) update(ref(db, `users/${user.id}`), { otpCode: otp });
    alert(`DEMO OTP: ${otp}`); 
  };

  const verifyAndResetPassword = (email: string, otp: string, newPass: string) => {
    const user = users.find(u => u.email === email);
    if (user && user.otpCode === otp && db) {
      update(ref(db, `users/${user.id}`), { password: newPass, otpCode: null });
      return true;
    }
    return false;
  };

  const deleteMessage = (messageId: string) => {
    if (db) remove(ref(db, `messages/${messageId}`));
  };

  const updateUserProfile = async (name: string, phone: string) => {
    if (!currentUser || !db) return;
    try {
      await update(ref(db, `users/${currentUser.id}`), { name, phone });
      setCurrentUser(prev => prev ? { ...prev, name, phone } : null);
      alert("Profile Updated Successfully!");
    } catch (error: any) {
      alert("Failed to update profile: " + error.message);
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, users, tasks, withdrawals, deposits, verificationRequests, settings, transactions, taskLogs, notifications, messages, urlRefCode,
      login, loginWithGoogle, logout, register, applyReferralCode, updateSettings, addTask, deleteTask, completeTask,
      requestWithdrawal, processWithdrawal, submitDeposit, processDeposit, submitVerification, processVerification, verifyUser, setAdFreeStatus, buyAdFree, manageUser, deleteUser, broadcastNotification, sendChatMessage,
      sendOtp, verifyAndResetPassword, scheduleAccountDeletion: () => {}, recoverAccount: () => {},
      askAI, deleteMessage, updateUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
