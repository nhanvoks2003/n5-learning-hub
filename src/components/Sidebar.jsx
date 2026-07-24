import React from 'react';
import { LayoutDashboard, PlayCircle, BookOpen, Trophy, LogOut, BookMarked } from 'lucide-react';

function Sidebar({ currentTab, setCurrentTab, progressPercent, handleSignOut }) {
  return (
    <aside className="hidden lg:flex w-64 bg-[#0b1326] border-r border-white/10 p-6 flex-col justify-between fixed h-[calc(100vh-73px)] top-[73px]">
      
      <div className="space-y-6">
        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-3">
          Menu Điều Hướng
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              currentTab === 'dashboard'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('lessons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              currentTab === 'lessons'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <PlayCircle className="w-4 h-4" /> Video Lessons
          </button>

          <button
            onClick={() => setCurrentTab('grammar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              currentTab === 'grammar'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" /> Ngữ Pháp N5
          </button>

          <button
            onClick={() => setCurrentTab('flashcards')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              currentTab === 'flashcards'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Kanji & Từ Vựng
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              currentTab === 'leaderboard'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> Leaderboard
          </button>
        </nav>
      </div>

      {/* TIẾN ĐỘ & NÚT ĐĂNG XUẤT */}
      <div className="space-y-4 border-t border-white/10 pt-4">
        <div className="bg-[#171f33]/60 border border-white/5 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-slate-400">Tiến độ N5</span>
            <span className="text-sky-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;