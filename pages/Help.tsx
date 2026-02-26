
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { MessageCircle, Facebook, Send, SendHorizontal, MessageCircleQuestion, Sparkles, Bot, User as UserIcon, Trash2 } from 'lucide-react';

const Help: React.FC = () => {
  const { currentUser, settings, messages, sendChatMessage, askAI, deleteMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'LIVE' | 'AI'>('AI');
  const [aiMessages, setAiMessages] = useState<{ id: string, text: string, isAi: boolean, timestamp: number }[]>([
    { id: 'initial', text: 'Hello! I am your EarnMaster AI. How can I help you earn more today?', isAi: true, timestamp: Date.now() }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  const userMessages = messages.filter(m => m.userId === currentUser.id);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userMessages, aiMessages, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (activeTab === 'LIVE') {
      sendChatMessage(inputText, false);
      setInputText('');
    } else {
      const userMsg = { id: 'u_' + Date.now(), text: inputText, isAi: false, timestamp: Date.now() };
      setAiMessages(prev => [...prev, userMsg]);
      setInputText('');
      setIsAiLoading(true);

      const aiResponse = await askAI(inputText);
      const aiMsg = { id: 'ai_' + Date.now(), text: aiResponse, isAi: true, timestamp: Date.now() };
      setAiMessages(prev => [...prev, aiMsg]);
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black dark:text-white">Help & Support</h2>
        <p className="text-gray-500">How can we help you today?</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <a href={settings.facebookLink} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-4 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Facebook size={24} />
          </div>
          <span className="font-bold dark:text-white text-xs">Facebook</span>
        </a>
        <a href={settings.telegramLink} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-4 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Send size={24} />
          </div>
          <span className="font-bold dark:text-white text-xs">Telegram</span>
        </a>
        <a href={settings.whatsappLink} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-4 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
            <MessageCircle size={24} />
          </div>
          <span className="font-bold dark:text-white text-xs">WhatsApp</span>
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('AI')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-black transition-all ${activeTab === 'AI' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-400'}`}
          >
            <Sparkles size={18} /> AI ASSISTANT
          </button>
          <button 
            onClick={() => setActiveTab('LIVE')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-black transition-all ${activeTab === 'LIVE' ? 'text-green-600 border-b-4 border-green-600 bg-green-50/50 dark:bg-green-900/10' : 'text-gray-400'}`}
          >
            <MessageCircleQuestion size={18} /> LIVE SUPPORT
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
          {activeTab === 'AI' ? (
            aiMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.isAi && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                      <Bot size={16} />
                    </div>
                  )}
                  <div className={`p-4 rounded-3xl text-sm ${
                    msg.isAi 
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm border dark:border-gray-700' 
                      : 'bg-blue-600 text-white rounded-br-none shadow-md'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-2 font-bold ${msg.isAi ? 'text-gray-400' : 'text-blue-200'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            userMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-50">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <MessageCircle size={40} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-black text-xl dark:text-white">No messages yet</p>
                  <p className="text-sm">Start a conversation with our human support team.</p>
                </div>
              </div>
            ) : (
              userMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                        <UserIcon size={16} />
                      </div>
                    )}
                    <div className={`p-4 rounded-3xl text-sm relative group ${
                      msg.isAdmin 
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm border dark:border-gray-700' 
                        : 'bg-green-600 text-white rounded-br-none shadow-md'
                    }`}>
                      {!msg.isAdmin && (
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="absolute -top-2 -left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-[9px] mt-2 font-bold ${msg.isAdmin ? 'text-gray-400' : 'text-green-200'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-bl-none shadow-sm border dark:border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-6 bg-white dark:bg-gray-900 border-t dark:border-gray-700 flex gap-3">
          <input 
            placeholder={activeTab === 'AI' ? "Ask AI for earning tips..." : "Message support team..."}
            className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isAiLoading}
          />
          <button 
            type="submit" 
            disabled={isAiLoading || !inputText.trim()}
            className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center ${
              activeTab === 'AI' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50 disabled:scale-100`}
          >
            <SendHorizontal size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Help;
