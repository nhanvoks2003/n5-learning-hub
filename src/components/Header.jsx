import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

function Header({ currentTab, setCurrentTab }) {
  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAawmpoMSxxLa9dVVXHych4boW8JP6egRdrHBWXl9P8pTCNLcoxXr8jF32DHZCR7T0kfPiLWXIrQ9eB5aWlRhS_bLGQCvtEBLa4RclNfYPWRsMnMPGWsnpH-O-7wBJm28mkkLj6vPLTcVFZvgk9iOXQAXH9dkABiVsiS8M1g0_p0twF_Em9o1xhEoGgfmJEbBb48SOHALPKmBQ5Gyl4YF7xu7GsY6jIjW_cVIFrgemCo7Lu3kYD0vF5";

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0b1326]/30 backdrop-blur-xl border-b border-white/10 shadow-[0_0_30px_rgba(137,206,255,0.1)]">
      <div className="flex items-center gap-8 group cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
        <img 
          src={logoUrl} 
          alt="N5 Calligraphy Neon Logo" 
          className="h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(137,206,255,0.25)] transition-transform duration-300 group-hover:scale-105 rounded-xl"
        />
        <nav className="hidden md:flex gap-6">
          <button onClick={() => setCurrentTab('dashboard')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'dashboard' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Dashboard</button>
          <button onClick={() => setCurrentTab('lessons')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'lessons' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Video Lessons</button>
          <button onClick={() => setCurrentTab('flashcards')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'flashcards' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Kanji Mastery</button>
          <button onClick={() => setCurrentTab('leaderboard')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'leaderboard' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Leaderboard</button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex bg-white/5 rounded-full px-4 py-1.5 border border-white/10 focus-within:border-sky-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-400 mt-1 mr-2" />
          <input type="text" placeholder="Quick search..." className="bg-transparent border-none text-xs text-on-surface placeholder:text-slate-500 focus:outline-none w-48"/>
        </div>
        <button className="text-slate-400 hover:bg-white/5 p-2 rounded-full transition-colors"><Bell className="w-4 h-4" /></button>
        <button className="text-slate-400 hover:bg-white/5 p-2 rounded-full transition-colors"><Settings className="w-4 h-4" /></button>
        <div className="w-9 h-9 rounded-full border border-sky-500/30 overflow-hidden">
          <div className="w-full h-full bg-linear-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-xs font-black text-[#0b1326]">N</div>
        </div>
      </div>
    </header>
  );
}

export default Header;