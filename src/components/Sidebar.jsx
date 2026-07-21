import React from 'react';
import { LayoutDashboard, Layers, Play, Sparkles, Trophy, Bolt, HelpCircle, LogOut } from 'lucide-react';

function Sidebar({ currentTab, setCurrentTab, progressPercent }) {
  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAawmpoMSxxLa9dVVXHych4boW8JP6egRdrHBWXl9P8pTCNLcoxXr8jF32DHZCR7T0kfPiLWXIrQ9eB5aWlRhS_bLGQCvtEBLa4RclNfYPWRsMnMPGWsnpH-O-7wBJm28mkkLj6vPLTcVFZvgk9iOXQAXH9dkABiVsiS8M1g0_p0twF_Em9o1xhEoGgfmJEbBb48SOHALPKmBQ5Gyl4YF7xu7GsY6jIjW_cVIFrgemCo7Lu3kYD0vF5";

  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-8 z-40 bg-[#131b2e]/50 backdrop-blur-2xl border-r border-white/10 shadow-2xl w-64 justify-between">
      <div className="px-6 mb-4 mt-4">
        <div className="flex items-center gap-3 mb-2">
          <img src={logoUrl} alt="N5 Calligraphy Neon Logo" className="w-8 h-8 object-contain filter drop-shadow-[0_0_10px_rgba(56,189,248,0.3)] rounded-lg" />
          <span className="font-bold text-sm text-white tracking-wide">Mastery Hub</span>
        </div>
        <p className="text-[10px] font-mono text-slate-500 font-bold uppercase mt-1 tracking-widest">Progress: {progressPercent}%</p>
        <div className="mt-3 h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <button onClick={() => setCurrentTab('dashboard')} className={`w-full px-4 py-3 flex items-center gap-3 transition-all rounded-lg text-xs font-mono tracking-wide ${currentTab === 'dashboard' ? 'bg-white/5 text-white font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button onClick={() => setCurrentTab('lessons')} className={`w-full px-4 py-3 flex items-center gap-3 transition-all rounded-lg text-xs font-mono tracking-wide ${currentTab === 'lessons' ? 'bg-sky-500/10 text-sky-400 border-r-4 border-sky-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
          <Layers className="w-4 h-4" /> Course Tracker
        </button>
        <button onClick={() => setCurrentTab('lessons')} className="w-full px-4 py-3 flex items-center gap-3 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all rounded-lg text-xs font-mono tracking-wide">
          <Play className="w-4 h-4" /> Video Lessons
        </button>
        <button onClick={() => setCurrentTab('flashcards')} className={`w-full px-4 py-3 flex items-center gap-3 transition-all rounded-lg text-xs font-mono tracking-wide ${currentTab === 'flashcards' ? 'bg-sky-500/10 text-sky-400 border-r-4 border-sky-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
          <Sparkles className="w-4 h-4" /> Flashcards
        </button>
        <button onClick={() => setCurrentTab('leaderboard')} className={`w-full px-4 py-3 flex items-center gap-3 transition-all rounded-lg text-xs font-mono tracking-wide ${currentTab === 'leaderboard' ? 'bg-sky-500/10 text-sky-400 border-r-4 border-sky-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
          <Trophy className="w-4 h-4" /> Leaderboard
        </button>
      </nav>

      <div className="px-4 space-y-4">
        <button onClick={() => setCurrentTab('lessons')} className="w-full bg-sky-500 text-[#0b1326] font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-xs tracking-wider uppercase">
          Resume Lesson
        </button>
        <div className="border-t border-white/5 pt-3 flex flex-col gap-1">
          <a className="text-slate-500 px-4 py-1.5 flex items-center gap-2.5 hover:text-sky-400 transition-all text-xs font-mono" href="#"><HelpCircle className="w-4 h-4" /> Help</a>
          <a className="text-slate-500 px-4 py-1.5 flex items-center gap-2.5 hover:text-red-400 transition-all text-xs font-mono" href="#"><LogOut className="w-4 h-4" /> Sign Out</a>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;