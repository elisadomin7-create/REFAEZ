
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { MessageCircle, SendHorizontal, Search, User as UserIcon, Trash2 } from 'lucide-react';

const AdminChat: React.FC = () => {
  const { messages, users, sendChatMessage, deleteMessage } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Group messages by userId to find active conversations
  const chatUsersMap = messages.reduce((acc: Record<string, any>, msg) => {
    if (!acc[msg.userId]) {
      const user = users.find(u => u.id === msg.userId);
      acc[msg.userId] = {
        userId: msg.userId,
        userName: user?.name || 'Unknown User',
        lastMessage: msg.text,
        timestamp: msg.timestamp
      };
    } else if (msg.timestamp > acc[msg.userId].timestamp) {
      acc[msg.userId].lastMessage = msg.text;
      acc[msg.userId].timestamp = msg.timestamp;
    }
    return acc;
  }, {});

  const activeChats = Object.values(chatUsersMap).sort((a: any, b: any) => b.timestamp - a.timestamp);
  const selectedMessages = messages.filter(m => m.userId === selectedUserId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUserId) return;
    sendChatMessage(inputText, true, selectedUserId);
    setInputText('');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl flex h-[calc(100vh-180px)] overflow-hidden">
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b dark:border-gray-800">
          <h3 className="text-xl font-black dark:text-white">Support Inbox</h3>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border dark:border-gray-700" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeChats.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No conversations</p>
          ) : (
            activeChats.map((chat: any) => (
              <button 
                key={chat.userId}
                onClick={() => setSelectedUserId(chat.userId)}
                className={`w-full p-4 flex items-center gap-3 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedUserId === chat.userId ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={20} />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-bold dark:text-white truncate">{chat.userName}</p>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950">
        {selectedUserId ? (
          <>
            <div className="p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <UserIcon size={20} />
                </div>
                {/* Fixed TS error by casting find result to any to access userName */}
                <h4 className="font-bold dark:text-white">{(activeChats.find((c: any) => c.userId === selectedUserId) as any)?.userName}</h4>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm relative group ${
                    msg.isAdmin 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none border dark:border-gray-700'
                  }`}>
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                    >
                      <Trash2 size={10} />
                    </button>
                    <p>{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${msg.isAdmin ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 flex gap-2">
              <input 
                placeholder="Type your reply..." 
                className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button type="submit" className="px-6 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 flex items-center gap-2 font-bold">
                Send <SendHorizontal size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex-col items-center justify-center text-center opacity-40 p-10 hidden md:flex">
            <MessageCircle size={80} />
            <h3 className="text-2xl font-bold mt-4">Select a chat to begin</h3>
            <p>Customer support messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
