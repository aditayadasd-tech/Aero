
import React from 'react';

const AeronAvatar: React.FC<{ isSpeaking?: boolean }> = ({ isSpeaking }) => {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32">
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
        isSpeaking ? 'bg-blue-500/40 scale-125' : 'bg-indigo-500/20 scale-100'
      }`} />
      
      {/* Main Sphere */}
      <div className={`relative z-10 w-full h-full rounded-full glass flex items-center justify-center overflow-hidden border-2 border-white/10 transition-transform duration-500 ${
        isSpeaking ? 'scale-110' : 'scale-100'
      }`}>
        {/* Animated Internal Elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-blue-400/30 animate-pulse-gentle" />
        
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-blue-200/80 drop-shadow-lg">
           <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="animate-[spin_20s_linear_infinite]" />
           <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_15s_linear_infinite_reverse]" />
           <path d="M50 30 Q70 50 50 70 Q30 50 50 30" fill="currentColor" fillOpacity="0.2" className={isSpeaking ? 'animate-pulse' : ''} />
        </svg>
      </div>

      {/* Speaking Indicator Rings */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-[ping_2s_linear_infinite]" />
          <div className="absolute inset-[-10px] rounded-full border border-blue-400/20 animate-[ping_3s_linear_infinite]" />
        </>
      )}
    </div>
  );
};

export default AeronAvatar;
