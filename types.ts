
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  BANNED = 'BANNED'
}

export enum TaskType {
  CLICK = 'CLICK',
  VISIT = 'VISIT',
  INSTALL = 'INSTALL',
  VIDEO = 'VIDEO'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum DepositStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum VerificationStatus {
  NOT_APPLIED = 'NOT_APPLIED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface CustomAd {
  id: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
}

export interface AdPost {
  id: string;
  providerName: string;
  adKeyOrCode: string;
  placement: 'MISSIONS' | 'WALLET' | 'DASHBOARD';
  isActive: boolean;
}

export interface User {
  id: string;
  uid: string;
  email: string;
  phone: string;
  name: string;
  password?: string;
  role: UserRole;
  status: AccountStatus;
  banReason?: string;
  banUntil?: number; 
  otpCode?: string;
  deletionScheduledAt?: number; // Timestamp for 12h countdown
  isVerified: boolean; 
  verificationStatus: VerificationStatus;
  isAdFree: boolean;
  points: number;
  referralCode: string;
  referredBy?: string;
  hasUsedReferral: boolean;
  referralCount: number;
  totalEarned: number;
  createdAt: number;
  deviceId: string;
}

export interface AppSettings {
  appName: string;
  appLogoUrl: string;
  packageName: string; // com.earnmaster.pro
  coinName: string;
  premiumPackageName: string;
  conversionRate: number;
  referralRewardUser: number;
  referralRewardReferrer: number;
  depositCommissionPercent: number;
  minWithdrawal: number;
  withdrawalFeePercent: number;
  adFreeSubscriptionPrice: number;
  externalAdCode: string;
  isReferralSystemEnabled: boolean;
  isEarningEnabled: boolean;
  customAds: CustomAd[];
  adPosts: AdPost[];
  adKeys: {
    admobAppId: string;
    banner: string;
    interstitial: string;
    rewarded: string;
    applovinKey: string;
    unityGameId: string;
  };
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    databaseURL: string;
    measurementId?: string;
  };
  themeColor: string;
  language: 'EN' | 'BN';
  theme: 'LIGHT' | 'DARK';
  notifExpiryHours: number;
  noticeBoard: string;
  bkashNumber: string;
  nagadNumber: string;
  verificationLink: string;
  facebookLink: string;
  telegramLink: string;
  whatsappLink: string;
  adminEmail?: string;
  adminPassword?: string;
  geminiApiKey?: string;
  aiProvider?: 'GEMINI' | 'OPENROUTER';
  tutorialVideoLink?: string;
  moreAppsLink?: string;
  minWithdrawalNotice?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  method: 'Bkash' | 'Nagad';
  senderNumber: string;
  transactionId: string;
  amount: number;
  status: DepositStatus;
  createdAt: number;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  paymentNumber: string;
  transactionId: string;
  timestamp: number;
  status: VerificationStatus;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  reward: number;
  link: string;
  timer: number;
  limitPerDay: number;
  buttonText: string;
  isActive: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  feeAmount: number;
  payoutAmount: number;
  method: 'Bkash' | 'Nagad' | 'Manual';
  accountNumber: string;
  status: WithdrawalStatus;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  senderId: string;
  senderName: string;
  text: string;
  isAdmin: boolean;
  timestamp: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'EARN' | 'CONVERT' | 'WITHDRAW' | 'REFERRAL' | 'DEPOSIT' | 'VERIFICATION_BONUS' | 'ADFREE_PURCHASE' | 'COMMISSION';
  amount: number;
  currency: 'POINTS' | 'BDT';
  description: string;
  timestamp: number;
}

export interface TaskLog {
  userId: string;
  taskId: string;
  completedAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}
