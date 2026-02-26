
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { TaskType } from '../types';
import { Plus, Trash2, MousePointer2, Eye, Download, Play, Info } from 'lucide-react';

const AdminTasks: React.FC = () => {
  const { tasks, addTask, deleteTask, settings } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', type: TaskType.CLICK, reward: 10, link: '', timer: 10, limitPerDay: 1, buttonText: 'Start Task'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ ...formData, isActive: true });
    setShowForm(false);
    setFormData({
      title: '', type: TaskType.CLICK, reward: 10, link: '', timer: 10, limitPerDay: 1, buttonText: 'Start Task'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Mission Builder</h2>
          <p className="text-gray-500 text-sm">Create unique missions for users to earn {settings.coinName}.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Create New Task
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
        <Info size={18} className="text-blue-500 mt-1" />
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          <strong>Notice:</strong> Missions are now "One-Time" per account by default. Once a user completes a task, they cannot earn from it again. This ensures anti-fraud and high-value traffic for your links.
        </p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-blue-100 shadow-xl space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Task Title</label>
              <input placeholder="Watch YouTube Video" className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
              <select className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as TaskType})}>
                <option value={TaskType.CLICK}>Click Task</option>
                <option value={TaskType.VISIT}>Visit Task</option>
                <option value={TaskType.VIDEO}>Video Task</option>
                <option value={TaskType.INSTALL}>Install App</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reward ({settings.coinName})</label>
              <input type="number" placeholder="10" className="w-full p-3 border rounded-xl dark:bg-gray-700" value={formData.reward} onChange={e => setFormData({...formData, reward: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Completion Timer (Seconds)</label>
              <input type="number" placeholder="15" className="w-full p-3 border rounded-xl dark:bg-gray-700" value={formData.timer} onChange={e => setFormData({...formData, timer: parseInt(e.target.value)})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target URL</label>
              <input placeholder="https://youtube.com/..." className="w-full p-3 border rounded-xl dark:bg-gray-700" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Button Label</label>
              <input placeholder="Watch Now" className="w-full p-3 border rounded-xl dark:bg-gray-700" value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200">Publish Mission</button>
        </form>
      )}

      <div className="grid gap-4">
        {tasks.map(t => (
          <div key={t.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-blue-600">
                {t.type === TaskType.VIDEO ? <Play size={22}/> : (t.type === TaskType.INSTALL ? <Download size={22}/> : <Eye size={22}/>)}
              </div>
              <div>
                <h4 className="font-bold dark:text-white">{t.title}</h4>
                <p className="text-xs text-gray-500">{t.reward} {settings.coinName} • {t.timer}s timer</p>
              </div>
            </div>
            <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[32px]">
            <p className="text-gray-400 italic">No missions available. Start by building one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
