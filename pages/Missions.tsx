
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { TaskType } from '../types';
import { Play, Eye, Download, MousePointer2, Clock, CheckCircle2, ListChecks, Lock, ExternalLink, Timer } from 'lucide-react';

const Missions: React.FC = () => {
  const { tasks, completeTask, taskLogs, currentUser, settings } = useApp();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeTaskId && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (activeTaskId && timeLeft === 0) {
      handleComplete(activeTaskId);
    }
    return () => clearInterval(interval);
  }, [activeTaskId, timeLeft]);

  const handleStartTask = (task: any) => {
    if (!currentUser?.isVerified) {
      alert("Verification required to start earning missions.");
      return;
    }
    if (!settings.isEarningEnabled) {
      alert("Earning is currently disabled by Admin.");
      return;
    }
    
    // Check if done TODAY
    const alreadyDoneToday = taskLogs.some(log => 
      log.userId === currentUser.id && 
      log.taskId === task.id && 
      new Date(log.completedAt).toDateString() === new Date().toDateString()
    );

    if (alreadyDoneToday) {
      alert("Daily limit reached for this mission. Try again tomorrow!");
      return;
    }

    setActiveTaskId(task.id);
    setTimeLeft(task.timer);
    if (task.link && task.link !== '#') {
      window.open(task.link, '_blank');
    }
  };

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    setActiveTaskId(null);
    setTimeLeft(0);
  };

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.VIDEO: return <Play size={24} />;
      case TaskType.VISIT: return <Eye size={24} />;
      case TaskType.INSTALL: return <Download size={24} />;
      default: return <MousePointer2 size={24} />;
    }
  };

  const isTaskDoneToday = (taskId: string) => {
    return taskLogs.some(log => 
      log.userId === currentUser?.id && 
      log.taskId === taskId && 
      new Date(log.completedAt).toDateString() === new Date().toDateString()
    );
  };

  const activeTasks = tasks.filter(t => t.isActive);
  const completedTodayCount = activeTasks.filter(t => isTaskDoneToday(t.id)).length;

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Website Ad Posts (Scripts/Keys) */}
      {!currentUser?.isAdFree && settings.adPosts.filter(p => p.placement === 'MISSIONS' && p.isActive).map(post => (
        <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
           <p className="text-[10px] text-gray-400 mb-2 uppercase font-black tracking-widest">{post.providerName}</p>
           <div className="min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden" dangerouslySetInnerHTML={{ __html: post.adKeyOrCode }} />
        </div>
      ))}

      {/* 2. Custom Internal Banner Ads (Images) */}
      {!currentUser?.isAdFree && settings.customAds.length > 0 && (
        <div className="space-y-4">
          {settings.customAds.filter(ad => ad.isActive).map(ad => (
            <a 
              key={ad.id} 
              href={ad.targetUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="block w-full overflow-hidden rounded-[32px] shadow-lg hover:opacity-90 transition-opacity border dark:border-gray-800"
            >
              <img src={ad.imageUrl} className="w-full h-40 md:h-52 object-cover" alt="Sponsored" />
              <div className="bg-white dark:bg-gray-800 px-6 py-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Sponsored</span>
                <ExternalLink size={14} className="text-blue-500" />
              </div>
            </a>
          ))}
        </div>
      )}

      {!currentUser?.isVerified && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-[32px] p-8 flex flex-col items-center text-center gap-4">
          <Lock size={48} className="text-red-500" />
          <p className="font-black text-xl text-red-700 dark:text-red-400 uppercase tracking-tight">
            Account Verification Required
          </p>
          <p className="text-sm text-red-600/70 font-medium">Verify your account to unlock daily missions and withdrawals.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            {settings.language === 'BN' ? 'দৈনিক মিশন' : 'Daily Missions'}
          </h2>
          <p className="text-gray-500 font-medium">
            {settings.language === 'BN' ? 'প্রতিদিন নতুন কাজ সম্পন্ন করুন' : 'Complete these tasks every 24 hours to earn rewards.'}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center"><ListChecks size={22}/></div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Today's Progress</p>
            <p className="font-black text-gray-900 dark:text-white">{completedTodayCount} / {activeTasks.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {activeTasks.map((task) => {
          const isDone = isTaskDoneToday(task.id);
          const isLocked = !currentUser?.isVerified;
          
          return (
            <div 
              key={task.id} 
              className={`bg-white dark:bg-gray-800 rounded-[32px] p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group transition-all ${isDone || isLocked ? 'opacity-60' : 'hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'}`}
            >
              <div className="flex items-center gap-6">
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg`}
                  style={{ backgroundColor: isLocked ? '#94a3b8' : (isDone ? '#10b981' : settings.themeColor) }}
                >
                  {isDone ? <CheckCircle2 size={28} /> : (isLocked ? <Lock size={24}/> : getTaskIcon(task.type))}
                </div>
                <div>
                  <h4 className="font-black text-xl text-gray-900 dark:text-white">{task.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1 font-black text-green-600 uppercase tracking-tighter bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md">
                      💰 +{task.reward} {settings.coinName}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1 font-bold">
                      <Timer size={14} /> {task.timer}s
                    </span>
                  </div>
                </div>
              </div>

              <button
                disabled={isDone || activeTaskId !== null || isLocked}
                onClick={() => handleStartTask(task)}
                className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 uppercase text-xs tracking-widest ${
                  isDone || isLocked
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'text-white hover:-translate-y-1 shadow-lg'
                }`}
                style={!isDone && activeTaskId === null && !isLocked ? { backgroundColor: settings.themeColor } : {}}
              >
                {isLocked ? <Lock size={16}/> : (isDone ? <CheckCircle2 size={16} /> : null)}
                {isLocked ? 'Locked' : (isDone ? (settings.language === 'BN' ? 'সম্পন্ন' : 'Done') : (activeTaskId === task.id ? `${timeLeft}s...` : task.buttonText))}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Missions;
