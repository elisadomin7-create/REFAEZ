
import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import Missions from './pages/Missions';
import Referral from './pages/Referral';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Help from './pages/Help';
import UserSettings from './pages/UserSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import AdminCustomizer from './pages/AdminCustomizer';
import AdminUserSearch from './pages/AdminUserSearch';
import AdminPremium from './pages/AdminPremium';
import AdminSystemConfig from './pages/AdminSystemConfig';
import AdminPaymentConfig from './pages/AdminPaymentConfig';
import AdminUsers from './pages/AdminUsers';
import AdminTasks from './pages/AdminTasks';
import AdminDeposits from './pages/AdminDeposits';
import AdminChat from './pages/AdminChat';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { currentUser, settings } = useApp();
  const [activeTab, setActiveTab] = useState('/');

  if (!currentUser) {
    return <Auth />;
  }

  const renderContent = () => {
    if (currentUser.role === UserRole.ADMIN) {
      switch (activeTab) {
        case '/admin': return <AdminDashboard />;
        case '/admin/settings': return <AdminSettings />;
        case '/admin/customize': return <AdminCustomizer />;
        case '/admin/search': return <AdminUserSearch />;
        case '/admin/premium': return <AdminPremium />;
        case '/admin/system-config': return <AdminSystemConfig />;
        case '/admin/payment-config': return <AdminPaymentConfig />;
        case '/admin/users': return <AdminUsers />;
        case '/admin/tasks': return <AdminTasks />;
        case '/admin/withdrawals': return <AdminDeposits />;
        case '/admin/chat': return <AdminChat />;
        default: return <AdminDashboard />;
      }
    }

    switch (activeTab) {
      case '/': return <UserDashboard />;
      case '/missions': return <Missions />;
      case '/refer': return <Referral />;
      case '/wallet': return <Wallet />;
      case '/profile': return <Profile />;
      case '/help': return <Help />;
      case '/user-settings': return <UserSettings />;
      default: return <UserDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Global Notice Board */}
      {currentUser.role !== UserRole.ADMIN && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-900/30 p-4 mb-4">
          <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">📢 {settings.noticeBoard}</p>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
