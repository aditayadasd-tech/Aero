
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role } from './types';
import { geminiService } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import AeronAvatar from './components/AeronAvatar';
import { AERON_CONFIG } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Aeron's welcome message
  useEffect(() => {
    const welcome = async () => {
      setIsTyping(true);
      geminiService.initChat();
      const initialResponse = "Hey! it's so good to see you again. 😊 How has your day been treating you so far?";
      
      setMessages([{
        id: '1',
        role: Role.AERON,
        content: initialResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    };
    welcome();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let aeronReply = "";
      const stream = geminiService.sendMessageStream(userMessage.content);
      
      const aeronMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aeronMessageId,
        role: Role.AERON,
        content: "",
        timestamp: new Date(),
        isStreaming: true
      }]);

      for await (const chunk of stream) {
        aeronReply += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aeronMessageId ? { ...msg, content: aeronReply } : msg
        ));
      }

      setMessages(prev => prev.map(msg => 
        msg.id === aeronMessageId ? { ...msg, isStreaming: false } : msg
      ));
    } catch (error) {
      console.error("Failed to get Aeron's response:", error);
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: Role.AERON,
        content: "I'm sorry, my digital thoughts got a bit tangled there. 😅 Can we try that again?",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between py-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
             <span className="text-blue-400 font-bold">A</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">{AERON_CONFIG.name}</h1>
            <p className="text-xs text-blue-400/80 flex items-center gap-1.5 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Digital Companion
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm text-slate-400 italic font-light tracking-wide">"Meaningful chats, digital friendship."</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 glass rounded-3xl overflow-hidden relative border-white/5 shadow-2xl mb-6">
        {/* Chat Background Graphic */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center overflow-hidden">
           <svg viewBox="0 0 200 200" className="w-full h-full text-white">
              <path d="M 10,100 Q 50,20 100,100 T 190,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 10,120 Q 50,40 100,120 T 190,120" fill="none" stroke="currentColor" strokeWidth="0.5" />
           </svg>
        </div>

        {/* Character Visual */}
        <div className="absolute top-8 right-8 pointer-events-none hidden md:block z-0">
          <AeronAvatar isSpeaking={isTyping} />
        </div>

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide z-10"
        >
          {messages.length === 0 && !isTyping && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <AeronAvatar />
                <p className="mt-8 text-lg font-light">Aeron is ready to listen.</p>
             </div>
          )}
          
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && messages[messages.length-1]?.role !== Role.AERON && (
            <div className="flex justify-start mb-6">
              <div className="glass px-5 py-3 rounded-2xl rounded-bl-none border-blue-500/10">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-slate-900/50 border-t border-white/5 z-20">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-end gap-3 glass p-2 pr-3 rounded-2xl border-white/10 shadow-inner focus-within:border-blue-500/30 transition-colors"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-3 px-4 resize-none max-h-[120px] scrollbar-hide"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-xl transition-all duration-200 ${
                inputValue.trim() && !isTyping
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
          <div className="flex justify-center gap-4 mt-3">
             <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
               Multilingual ✨ English • বাংলা • Hindi
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
