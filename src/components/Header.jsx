import React, { useState } from 'react';
import { Search, Bell, Settings, ShieldAlert, LogIn, LogOut, Menu, X } from 'lucide-react';

function Header({ currentTab, setCurrentTab, user, userRole, openAuthModal, handleSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAawmpoMSxxLa9dVVXHych4boW8JP6egRdrHBWXl9P8pTCNLcoxXr8jF32DHZCR7T0kfPiLWXIrQ9eB5aWlRhS_bLGQCvtEBLa4RclNfYPWRsMnMPGWsnpH-O-7wBJm28mkkLj6vPLTcVFZvgk9iOXQAXH9dkABiVsiS8M1g0_p0twF_Em9o1xhEoGgfmJEbBb48SOHALPKmBQ5Gyl4YF7xu7GsY6jIjW_cVIFrgemCo7Lu3kYD0vF5";

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'N';

  const navTo = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0b1326]/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      
      <div className="flex items-center gap-8">
        <div onClick={() => navTo('dashboard')} className="flex items-center gap-3 cursor-pointer">
          <img src={logoUrl} alt="N5 Logo" className="h-10 md:h-12 w-auto object-contain rounded-xl" />
        </div>

        {/* MENU TRÊN MÁY TÍNH */}
        <nav className="hidden md:flex gap-6">
          <button onClick={() => navTo('dashboard')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'dashboard' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Dashboard</button>
          <button onClick={() => navTo('lessons')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'lessons' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Video Lessons</button>
          <button onClick={() => navTo('flashcards')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'flashcards' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Kanji Mastery</button>
          <button onClick={() => navTo('leaderboard')} className={`text-sm font-bold pb-1 transition-all ${currentTab === 'leaderboard' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'}`}>Leaderboard</button>
          {userRole === 'admin' && (
            <button onClick={() => navTo('admin')} className={`text-sm font-bold pb-1 transition-all flex items-center gap-1 ${currentTab === 'admin' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-amber-500/70 hover:text-amber-400'}`}><ShieldAlert className="w-3.5 h-3.5" /> Admin Panel</button>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-xs font-black text-[#0b1326]" title={user.email}>
              {userInitial}
            </div>
            <button onClick={handleSignOut} title="Đăng xuất" className="text-slate-400 hover:text-red-400 p-2"><LogOut className="w-4 h-4" /></button>
          </div>
        ) : (
          <button onClick={openAuthModal} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold rounded-xl"><LogIn className="w-3.5 h-3.5" /> Đăng nhập</button>
        )}

        {/* NÚT HAMBURGER MOBILE */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-400 p-2 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#131b2e] border-b border-white/10 p-5 flex flex-col gap-4 shadow-2xl md:hidden animate-fade-in">
          <button onClick={() => navTo('dashboard')} className="text-left text-xs font-bold text-slate-300 py-2 border-b border-white/5">Dashboard</button>
          <button onClick={() => navTo('lessons')} className="text-left text-xs font-bold text-slate-300 py-2 border-b border-white/5">Video Lessons & Course Tracker</button>
          <button onClick={() => navTo('flashcards')} className="text-left text-xs font-bold text-slate-300 py-2 border-b border-white/5">Kanji Mastery & Flashcards</button>
          <button onClick={() => navTo('leaderboard')} className="text-left text-xs font-bold text-slate-300 py-2 border-b border-white/5">Leaderboard</button>
          {userRole === 'admin' && (
            <button onClick={() => navTo('admin')} className="text-left text-xs font-bold text-amber-400 py-2">Admin Panel</button>
          )}
        </div>
      )}

    </header>
  );
}

export default Header;