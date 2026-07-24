import React, { useState } from 'react';
import { BookMarked, Volume2, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

function GrammarView({ grammarList }) {
  const [selectedWeek, setSelectedWeek] = useState('ALL');

  const speakJapanese = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const availableWeeks = ['ALL', ...Array.from(new Set(grammarList.map(g => g.week || 'WEEK 1')))];

  const filteredGrammar = selectedWeek === 'ALL'
    ? grammarList
    : grammarList.filter(g => (g.week || 'WEEK 1') === selectedWeek);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            <BookMarked className="w-7 h-7 text-sky-400" /> Ngữ Pháp & Cấu Trúc Câu
          </h1>
          <p className="text-xs text-slate-400 mt-1">Tổng hợp mẫu câu, quy tắc chia từ và ví dụ thực hành theo lộ trình</p>
        </div>
      </div>

      {/* LỌC THEO TUẦN */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 shrink-0">
          <Filter className="w-4 h-4 text-sky-400" /> Chọn Tuần:
        </div>
        {availableWeeks.map(week => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              selectedWeek === week 
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-md' 
                : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {week === 'ALL' ? 'Tất cả ngữ pháp' : week}
          </button>
        ))}
      </div>

      {/* DANH SÁCH MẪU NGỮ PHÁP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGrammar.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-3xl">
            Chưa có bài ngữ pháp nào cho tuần này.
          </div>
        ) : (
          filteredGrammar.map((item, idx) => (
            <div 
              key={item.id || idx}
              className="bg-[#171f33]/40 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-sky-500/40 transition-all shadow-xl relative overflow-hidden group"
            >
              {/* TAG TUẦN & TIÊU ĐỀ */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                    {item.week || 'WEEK 1'}
                  </span>
                  <h3 className="text-base font-black text-white mt-2">{item.title}</h3>
                </div>
              </div>

              {/* KHUNG CÔNG THỨC / CẤU TRÚC */}
              <div className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-4 font-mono text-sm font-black text-sky-300 shadow-inner">
                {item.structure}
              </div>

              {/* GIẢI THÍCH */}
              {item.explanation && (
                <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  💡 <span className="font-semibold text-slate-200">{item.explanation}</span>
                </p>
              )}

              {/* CÂU VÍ DỤ MINH HỌA */}
              {(item.example_ja || item.example_vi) && (
                <div className="border-t border-white/5 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Ví dụ minh họa</span>
                    {item.example_ja && (
                      <button 
                        onClick={() => speakJapanese(item.example_ja)}
                        className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 hover:text-[#0b1326] text-sky-400 transition-colors flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Phát âm
                      </button>
                    )}
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 space-y-1">
                    <p className="text-sm font-bold text-emerald-300">{item.example_ja}</p>
                    <p className="text-xs text-slate-400 italic">👉 {item.example_vi}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default GrammarView;