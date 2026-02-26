
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { Lock, ShieldCheck, Mail, Phone, User as UserIcon, Unlock, KeyRound, ChevronLeft, AlertCircle, AlertTriangle, Copy, ExternalLink, MessageCircle, Send, Facebook } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, loginWithGoogle, register, settings, sendOtp, verifyAndResetPassword, urlRefCode } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Stealth System for Admin Access
  const [stealthCode, setStealthCode] = useState('');
  const stealthInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', referralCode: '', otp: '', newPassword: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [showDomainFix, setShowDomainFix] = useState(false);

  // Auto-fill referral code if detected from URL
  useEffect(() => {
    if (urlRefCode && !isLogin) {
      setFormData(prev => ({ ...prev, referralCode: urlRefCode }));
    }
  }, [urlRefCode, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setShowDomainFix(false);
    if (isLogin) {
      const res = await login(formData.email, formData.password, isAdminMode ? UserRole.ADMIN : UserRole.USER);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed');
      }
    } else {
      await register(formData.name, formData.email, formData.phone, formData.password, formData.referralCode);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setShowDomainFix(false);
    const res = await loginWithGoogle();
    if (!res.success) {
      setErrorMsg(res.message || 'Google Login failed');
      if (res.isDomainError) {
        setShowDomainFix(true);
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      sendOtp(formData.email);
      alert("OTP Sent to Email!");
    } else {
      const success = verifyAndResetPassword(formData.email, formData.otp, formData.newPassword);
      if (success) {
        alert("Password updated! Please login.");
        setIsForgotPassword(false);
        setIsLogin(true);
      } else {
        alert("Invalid OTP.");
      }
    }
  };

  /**
   * 🛡️ SECRET ADMIN TRIGGER 🛡️
   * লোগোর ওপর টাচ করলে পিন ইনপুট ফোকাস হবে। 
   * বর্তমান সময় (যেমন ২:৩০ হলে ১৪৩০) টাইপ করে ফেসবুক আইকনে ক্লিক করতে হবে।
   */
  const handleFacebookSecretClick = () => {
    if (isAdminMode) return; // Already in admin mode

    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const currentTimeCode = hh + mm;

    if (stealthCode === currentTimeCode) {
      setIsAdminMode(true); 
      setIsLogin(true); 
      setStealthCode('');
      alert("🔓 SYSTEM UNLOCKED!\nEnter Admin Email & Password to login.");
    } else if (stealthCode.length > 0) {
      alert("❌ Invalid Secret Code.");
      setStealthCode('');
    }
  };

  const inputClasses = "w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col relative">
        
        {/* 🕵️ LOGO-SPECIFIC INVISIBLE INPUT 🕵️ */}
        <div 
          className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-[60] cursor-pointer"
          onClick={() => stealthInputRef.current?.focus()}
        >
          <input 
            ref={stealthInputRef}
            type="tel" 
            autoComplete="off"
            maxLength={4}
            className="absolute inset-0 w-full h-full bg-transparent border-none text-transparent caret-transparent focus:outline-none opacity-0"
            value={stealthCode}
            onChange={(e) => setStealthCode(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="px-8 pt-12 pb-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-[24px] overflow-hidden mb-6 shadow-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 pointer-events-none relative z-10">
            {isAdminMode ? (
              <ShieldCheck size={40} className="text-indigo-600 animate-pulse" />
            ) : (
              <img src={settings.appLogoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
            )}
          </div>
          <h2 className="text-3xl font-black tracking-tight" style={isAdminMode ? { color: '#4f46e5' } : { color: settings.themeColor }}>
            {isForgotPassword ? 'Password Reset' : (isAdminMode ? 'Admin Access' : settings.appName)}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
            {isForgotPassword ? 'Follow instructions' : (isAdminMode ? 'Enter Control Mode' : 'Your Master Earning Hub')}
          </p>
        </div>

        {showDomainFix ? (
          <div className="mx-8 mb-6 p-6 bg-red-600 text-white rounded-3xl border-4 border-white shadow-xl">
            <h4 className="font-black text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Configuration Required</h4>
            <p className="text-[10px] opacity-90 mb-4 font-bold">Copy this domain to Firebase &gt; Auth &gt; Settings &gt; Authorized Domains:</p>
            <div className="flex items-center gap-2 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 mb-4">
              <code className="flex-1 font-mono text-xs truncate font-black">{window.location.hostname}</code>
              <button onClick={() => {navigator.clipboard.writeText(window.location.hostname); alert('Copied!');}} className="p-2 bg-white text-red-600 rounded-lg shadow-lg active:scale-90"><Copy size={16}/></button>
            </div>
            <button onClick={() => setShowDomainFix(false)} className="w-full py-3 bg-white text-red-600 rounded-xl font-black text-xs uppercase shadow-lg">Retry Now</button>
          </div>
        ) : errorMsg && (
          <div className="mx-10 mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle size={14}/> {errorMsg}
          </div>
        )}

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="px-10 pb-8 space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-400" size={18}/>
              <input type="email" required className={inputClasses} placeholder="Your Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-4 text-gray-400" size={18}/>
              <input type="text" className={inputClasses} placeholder="OTP Code" value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={18}/>
              <input type="password" className={inputClasses} placeholder="New Password" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} />
            </div>
            <button type="submit" className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl">
              {formData.otp ? 'Set New Password' : 'Send Verification Code'}
            </button>
            <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-sm font-bold text-gray-400">Back</button>
          </form>
        ) : (
          <div className="px-10 pb-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-4 text-gray-400" size={18}/>
                  <input type="text" required className={inputClasses} placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-400" size={18}/>
                <input type="email" required className={inputClasses} placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={18}/>
                <input type="password" required className={inputClasses} placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              {!isLogin && (
                <>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-gray-400" size={18}/>
                    <input type="tel" required className={inputClasses} placeholder="Phone (WhatsApp)" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="relative">
                    <Unlock className="absolute left-4 top-4 text-gray-400" size={18}/>
                    <input type="text" className={inputClasses} placeholder="Referral Code (Optional)" value={formData.referralCode} onChange={e => setFormData({ ...formData, referralCode: e.target.value })} />
                  </div>
                </>
              )}
              <button type="submit" className="w-full py-4 rounded-2xl text-white font-black shadow-xl transition-all active:scale-95" style={{ backgroundColor: isAdminMode ? '#4f46e5' : settings.themeColor }}>
                {isLogin ? (isAdminMode ? 'Login as Admin' : 'Login') : 'Register Now'}
              </button>
            </form>

            {!isAdminMode && (
              <>
                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                  <span className="text-[10px] font-black text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full py-4 rounded-2xl bg-white dark:bg-gray-800 border flex items-center justify-center gap-3 border-gray-100 dark:border-gray-700">
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
                  <span className="text-sm font-black dark:text-white">Google Login</span>
                </button>

                <div className="text-center pt-2">
                  <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-gray-400">
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Secret Trigger Area */}
        <div className="px-8 pb-10 mt-6 flex justify-center gap-10 opacity-30">
           <button onClick={handleFacebookSecretClick} className="hover:opacity-100 transition-opacity outline-none text-gray-600 dark:text-gray-400">
             <Facebook size={22}/>
           </button>
           <button className="text-gray-600 dark:text-gray-400"><Send size={22}/></button>
           <button className="text-gray-600 dark:text-gray-400"><MessageCircle size={22}/></button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
