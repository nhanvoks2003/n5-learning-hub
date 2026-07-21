import React from 'react';
import { Play, Sparkles, BookOpen, Trophy, Bolt } from 'lucide-react';

function DashboardView({ progressPercent, setCurrentTab }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Kon'nichiwa, Nhân.</h1>
        <p className="text-slate-400 text-xs mt-1">Lộ trình tự học N5 của bạn đã đạt {progressPercent}%. Tiếp tục bứt phá mục tiêu hôm nay nhé!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div onClick={() => setCurrentTab('lessons')} className="bg-[#171f33]/40 border border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400"><Play className="w-6 h-6" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Vào Không Gian Học</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Xem video bài giảng & lưu Note</p>
          </div>
        </div>
        <div onClick={() => setCurrentTab('flashcards')} className="bg-[#171f33]/40 border border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-[#4edea3]"><Sparkles className="w-6 h-6" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Luyện Flashcards</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Ghi nhớ 100+ Kanji N5 thuật toán SRS</p>
          </div>
        </div>
        <div onClick={() => setCurrentTab('leaderboard')} className="bg-[#171f33]/40 border border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400"><Trophy className="w-6 h-6" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Bảng Xếp Hạng</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Xem vị trí Elite League tuần này</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;