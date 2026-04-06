import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { BOT_AVATAR } from './constants';

function App() {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('CUSTOM_GEMINI_API_KEY');
    if (savedKey) setApiKeyInput(savedKey);
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('CUSTOM_GEMINI_API_KEY', apiKeyInput);
    setShowSettings(false);
  };

  const handleStartChat = (msg?: string) => {
    if (msg) {
      setInitialMessage(msg);
    } else {
      setInitialMessage('');
    }
    setIsChatStarted(true);
  };

  if (isChatStarted) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        {/* Container for ChatWindow to maintain responsiveness */}
        <div className="w-full h-full md:h-[95vh] md:max-w-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white relative flex flex-col">
           <ChatWindow onBack={() => setIsChatStarted(false)} initialMessage={initialMessage} />
        </div>
      </div>
    );
  }

  const quickActions = [
    "เบอร์โทรภายใน",
    "ตามเปลล้อ",
    "ระบบตรวจเช็คต่างๆ"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4 font-sans relative">
      
      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(true)} 
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-pink-500 hover:bg-white/50 rounded-full transition-colors z-20"
        title="ตั้งค่า API Key"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-pink-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">ตั้งค่า API Key</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              หากคุณมี Gemini API Key ของตัวเอง สามารถนำมาใส่ที่นี่ได้เลยค่ะ ระบบจะจดจำไว้ในเครื่องของคุณ
            </p>
            <input 
              type="password" 
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full border border-gray-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)} 
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                ยกเลิก
              </button>
              <button 
                onClick={saveApiKey} 
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] max-w-sm w-full text-center space-y-6 relative overflow-hidden border border-white/50">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60"></div>

        {/* Logo / Avatar Area */}
        <div className="relative mx-auto w-36 h-36 mb-6 group cursor-default">
             <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-blue-50 rounded-full shadow-inner transform group-hover:scale-105 transition-transform duration-500"></div>
             <div className="absolute inset-2 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden border-4 border-white">
                {/* Nurse Icon */}
                <img src={BOT_AVATAR} alt="Nurse Kaew" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             {/* Status Indicator */}
             <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
             </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                พี่พยาบาล<span className="text-pink-500">แก้ว</span>รอบรู้
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
                สวัสดีค่ะ! พี่แก้วยินดีต้อนรับนะคะ 💖<br/>
                มีข้อสงสัยเรื่องสวัสดิการ หรือข้อมูลองค์กร<br/>
                แวะมาคุยกับพี่แก้วได้ตลอดเลยน้า~
            </p>
        </div>

        {/* Quick Actions */}
        <div className="relative z-10 flex flex-col gap-2 mt-4">
          <p className="text-xs text-gray-400 font-medium mb-1">คำถามที่พบบ่อย (คลิกเพื่อถามได้เลยค่ะ 👇)</p>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleStartChat(action)}
              className="text-sm bg-pink-50 hover:bg-pink-100 text-pink-600 py-2 px-4 rounded-xl border border-pink-100 transition-colors text-left flex items-center justify-between group"
            >
              <span className="truncate mr-2">{action}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button 
            onClick={() => handleStartChat()}
            className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group z-10 mt-4"
        >
            <span className="relative z-10 flex items-center text-lg">
                พิมพ์คำถามอื่นๆ
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
        </button>

        {/* Footer */}
        <div className="pt-4 text-[10px] text-gray-400 font-light tracking-wider uppercase">
            AI Assistant • Internal Only
        </div>
      </div>
    </div>
  );
}

export default App;