import React from 'react';
import { Globe, Flame, Bolt, Lightbulb, ChevronUp } from 'lucide-react';

function LeaderboardView({ progressPercent }) {
  return (
    <div className="space-y-12 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171f33]/40 border border-white/5 p-8 rounded-2xl flex flex-col justify-between min-h-[160px] group">
          <div className="flex justify-between items-start"><span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Global Rank</span><Globe className="w-4 h-4 text-sky-400" /></div>
          <div><span className="text-4xl font-black text-white tracking-tight">#1,248</span><p className="text-[#4edea3] text-xs font-bold mt-1">Top 4.2% of learners</p></div>
        </div>
        <div className="bg-[#171f33]/40 border border-white/5 p-8 rounded-2xl flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start"><span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Weekly Streak</span><Flame className="w-4 h-4 text-[#ffb2b7] fill-[#ffb2b7]" /></div>
          <div><span className="text-4xl font-black text-white tracking-tight">14 <span class="text-sm text-slate-500 font-normal">Days</span></span><p className="text-[#ffb2b7] text-xs font-bold mt-1">+2 từ tuần trước</p></div>
        </div>
        <div className="bg-[#171f33]/40 border border-white/5 p-8 rounded-2xl flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start"><span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Study XP</span><Bolt className="w-4 h-4 text-[#4edea3] fill-[#4edea3]" /></div>
          <div><span className="text-4xl font-black text-white tracking-tight">45.2k</span><p className="text-slate-500 text-xs font-bold mt-1">Lên cấp tiếp theo trong 4,800 XP</p></div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#171f33]/40 border border-white/5 p-8 rounded-3xl relative shadow-xl">
          <div className="mb-10"><h2 className="text-lg font-black text-white tracking-wide">Weekly Momentum</h2><p className="text-slate-500 text-xs mt-0.5">Phân phối số phút tự học trong 7 ngày qua</p></div>
          <div className="h-64 flex items-end gap-3 md:gap-6 px-4">
            {[
              { day: 'MON', h: 'h-32', min: '45m', active: false },
              { day: 'TUE', h: 'h-48', min: '65m', active: false },
              { day: 'WED', h: 'h-64', min: '120m', active: true },
              { day: 'THU', h: 'h-40', min: '55m', active: false },
              { day: 'FRI', h: 'h-36', min: '50m', active: false },
              { day: 'SAT', h: 'h-20', min: '25m', active: false },
              { day: 'SUN', h: 'h-24', min: '30m', active: false }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 group relative">
                <div className={`w-full rounded-t-xl transition-all duration-300 ${item.active ? 'bg-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]' : 'bg-white/5 group-hover:bg-sky-500/20' } ${item.h}`}></div>
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[9px] font-mono font-black px-2 py-1 rounded-md transition-opacity duration-200 ${item.active ? 'bg-sky-500 text-[#0b1326] opacity-100' : 'bg-slate-800 text-white opacity-0 group-hover:opacity-100'}`}>{item.min}</div>
                <span className={`block text-center text-[9px] font-mono font-black mt-4 ${item.active ? 'text-sky-400' : 'text-slate-500'}`}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#171f33]/40 border border-white/5 p-8 rounded-3xl flex flex-col justify-between shadow-xl">
          <h2 className="text-base font-black text-white uppercase tracking-wider">Skills Mastery</h2>
          <div className="space-y-6 flex-1 mt-6">
            <div className="space-y-2"><div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold"><span>KANJI (N5)</span><span className="text-sky-400">88%</span></div><div className="h-2 w-full bg-slate-950 p-0.5 rounded-full border border-white/5"><div className="h-full bg-sky-400 rounded-full" style={{ width: '88%' }}></div></div></div>
            <div className="space-y-2"><div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold"><span>GRAMMAR</span><span className="text-[#4edea3]">62%</span></div><div className="h-2 w-full bg-slate-950 p-0.5 rounded-full border border-white/5"><div className="h-full bg-[#4edea3] rounded-full" style={{ width: '62%' }}></div></div></div>
          </div>
          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-sky-400" /></div><p className="text-[11px] text-slate-400 leading-normal">Tập trung học các từ vựng thuộc nhóm <span className="text-white font-bold">Động từ</span> để mở khóa các chữ Kanji tiếp theo.</p></div>
        </div>
      </section>

      <section className="bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-slate-900/10"><h2 className="text-base font-black text-white uppercase tracking-wider">Elite League</h2></div>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/40 border-b border-white/5"><tr className="text-slate-500 font-mono text-[10px] uppercase tracking-widest"><th className="px-8 py-4">Rank</th><th className="px-8 py-4">Learner</th><th className="px-8 py-4">Weekly XP</th><th className="px-8 py-4">Streak</th><th className="px-8 py-4">Mastery</th><th className="px-8 py-4">Status</th></tr></thead>
          <tbody className="divide-y divide-white/5 font-medium">
            <tr className="bg-sky-500/5 group">
              <td className="px-8 py-5"><div className="flex items-center gap-1"><span className="text-sky-400 font-bold">#1,248</span><ChevronUp className="w-3.5 h-3.5 text-sky-400" /></div></td>
              <td className="px-8 py-5"><div><span className="block text-white font-bold">Nhân (You)</span><span className="text-[9px] font-mono text-sky-400 uppercase font-black tracking-wider">Elite Tier</span></div></td>
              <td className="px-8 py-5 font-bold text-white font-mono text-sm">4,280</td>
              <td className="px-8 py-5"><div className="flex items-center gap-1 text-[#ffb2b7] font-mono font-bold"><Flame className="w-4 h-4 fill-[#ffb2b7]" /> 14</div></td>
              {/* LIÊN KẾT ĐỘNG TIẾN ĐỘ MASTERY VỚI SUPABASE TẠI ĐÂY */}
              <td className="px-8 py-5"><div className="w-32 h-1.5 bg-slate-950 p-0.5 border border-white/5 rounded-full overflow-hidden"><div className="h-full bg-sky-400 rounded-full" style={{ width: `${progressPercent}%` }}></div></div></td>
              <td className="px-8 py-5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[9px] font-black tracking-wider">CURRENT SESSION</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default LeaderboardView;