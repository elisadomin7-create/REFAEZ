
import React from 'react';
import { 
  Home, 
  Target, 
  Users, 
  Wallet, 
  User as UserIcon, 
  Settings, 
  TrendingUp,
  LayoutDashboard,
  FileText,
  CreditCard,
  MessageCircleQuestion,
  Headset,
  Palette,
  Search,
  Crown
} from 'lucide-react';

export const INITIAL_SETTINGS = {
  coinName: 'EarnCoin',
  conversionRate: 0.5,
  referralRewardUser: 20,
  referralRewardReferrer: 100,
  minWithdrawal: 500,
  isReferralSystemEnabled: true,
  isEarningEnabled: true,
  adKeys: {
    banner: 'banner_key_123',
    interstitial: 'int_key_123',
    rewarded: 'reward_key_123',
  },
  themeColor: '#3b82f6',
};

export const NAVIGATION_ITEMS = [
  { label: 'Home', icon: <Home size={20} />, path: '/' },
  { label: 'Missions', icon: <Target size={20} />, path: '/missions' },
  { label: 'Refer', icon: <Users size={20} />, path: '/refer' },
  { label: 'Wallet', icon: <Wallet size={20} />, path: '/wallet' },
  { label: 'Settings', icon: <Settings size={20} />, path: '/user-settings' },
  { label: 'Profile', icon: <UserIcon size={20} />, path: '/profile' },
  { label: 'Help', icon: <Headset size={20} />, path: '/help' },
];

export const ADMIN_NAVIGATION = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
  { label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
  { label: 'Missions', icon: <FileText size={20} />, path: '/admin/tasks' },
  { label: 'Support', icon: <MessageCircleQuestion size={20} />, path: '/admin/chat' },
  { label: 'Payments', icon: <CreditCard size={20} />, path: '/admin/withdrawals' },
  { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  { label: 'Customize', icon: <Palette size={20} />, path: '/admin/customize' },
  { label: 'User Controller', icon: <Search size={20} />, path: '/admin/search' },
  { label: 'Premium', icon: <Crown size={20} />, path: '/admin/premium' },
  { label: 'System Config', icon: <Settings size={20} />, path: '/admin/system-config' },
];
