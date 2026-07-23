import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Trophy, Flame, Award, Zap, ShieldCheck } from 'lucide-react';

function LeaderboardView() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, xp')
        .order('xp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTopUsers(data || []);
    } catch (err) {
      console.error('Lỗi lấy BXH:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden bg-[#171f33]/30 border border-amber-500/20 rounded-[2rem] p-8 md:p-10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">N5 Elite League</h1>
            <p className="text-xs text-slate-400 mt-0.5">Bảng vinh danh Học viên có điểm tích lũy XP cao nhất tuần này</p>
          </div>
        </div>
      </div>

      <div className="bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-slate-900/40 font-mono text-xs font-bold text-slate-400 grid grid-cols-12 gap-4">
          <span className="col-span-2 text-center">HẠNG</span>
          <span className="col-span-6">HỌC VIÊN</span>
          <span className="col-span-4 text-right pr-4">ĐIỂM XP</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Đang cập nhật bảng xếp hạng...</div>
        ) : topUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">Chưa có dữ liệu học viên.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {topUsers.map((item, idx) => {
              const rank = idx + 1;
              let rankBadge = <span className="font-mono text-xs font-bold text-slate-500">#{rank}</span>;
              if (rank === 1) rankBadge = <div className="w-7 h-7 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs">🥇</div>;
              if (rank === 2) rankBadge = <div className="w-7 h-7 mx-auto rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 flex items-center justify-center font-black text-xs">🥈</div>;
              if (rank === 3) rankBadge = <div className="w-7 h-7 mx-auto rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-black text-xs">🥉</div>;

              return (
                <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-2 text-center">{rankBadge}</div>
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-black text-xs text-[#0b1326] shrink-0">
                      {item.email ? item.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.email ? item.email.split('@')[0] : 'Learner'}</p>
                      {item.role === 'admin' && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-amber-400 font-bold"><ShieldCheck className="w-3 h-3" /> Admin</span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-4 text-right pr-4">
                    <span className="text-sm font-black text-sky-400 font-mono">+{item.xp || 0} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardView;