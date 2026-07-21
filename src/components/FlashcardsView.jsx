import React from 'react';
import { Sparkles, Volume2, Star, Brain } from 'lucide-react';

function FlashcardsView({ kanjiDeck, vocabList }) {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="relative overflow-hidden bg-[#171f33]/30 border border-sky-500/20 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-sky-400 mb-3 md:text-4xl">Kanji &amp; Vocabulary<br/><span className="text-white">Precision Training</span></h1>
            <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">Master the foundational elements of the N5 curriculum with holographic focus and algorithmic repetition.</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#131b2e]/60 border border-[#4edea3]/30 px-5 py-3 rounded-2xl"><span className="block text-[9px] font-mono font-bold text-[#4edea3] tracking-widest uppercase mb-1">CURRENT LEVEL</span><span className="text-sm font-bold text-white">Vocabulary Specialist</span></div>
              <div className="bg-[#131b2e]/60 border border-[#ffb2b7]/30 px-5 py-3 rounded-2xl"><span className="block text-[9px] font-mono font-bold text-[#ffb2b7] tracking-widest uppercase mb-1">STREAK</span><span className="text-sm font-bold text-white">14 DAYS</span></div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90"><circle className="text-white/5" cx="88" cy="88" fill="transparent" r="74" stroke="currentColor" strokeWidth="6"></circle><circle className="text-sky-400" cx="88" cy="88" fill="transparent" r="74" stroke="currentColor" strokeDasharray="465" strokeDashoffset="160" strokeWidth="10" strokeLinecap="round"></circle></svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-black text-white">82</span><span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-0.5">TOTAL KANJI</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white tracking-wide">Daily Review Deck</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {kanjiDeck.map((kanji, idx) => (
            <div key={idx} className="bg-[#171f33]/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center group shadow-md hover:bg-white/5 transition-all cursor-pointer">
              <div className="relative mb-3"><span className="text-5xl font-black text-white group-hover:text-sky-400 transition-colors select-none">{kanji.char}</span></div>
              <div className="text-center w-full"><span className="block text-xs font-bold text-white truncate">{kanji.trans}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <h2 className="text-lg font-extrabold text-white tracking-wide">Recent Vocabulary</h2>
        <div className="space-y-3">
          {vocabList.map((vocab, idx) => (
            <div key={idx} className="bg-[#171f33]/40 border border-white/5 px-6 py-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <span className="text-xl font-black text-white select-none">{vocab.kanji}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-sky-400">{vocab.romaji}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mt-0.5">{vocab.english}</span>
                </div>
              </div>
              <div className="flex-1 max-w-md w-full md:px-6">
                <div className="h-2 w-full bg-slate-950 p-0.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div className="h-full rounded-full bg-linear-to-r from-sky-400 to-emerald-400" style={{ width: `${vocab.progress}%` }}></div>
                </div>
              </div>
              <div className="flex gap-3 text-slate-500">
                <button onClick={() => alert('Phát âm thanh...')} className="hover:text-sky-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"><Volume2 className="w-4 h-4" /></button>
                <button className="hover:text-amber-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"><Star className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THỀ HÀNH ĐỘNG THUẬT TOÁN SRS ALGORITHM */}
      <div className="bg-linear-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20 rounded-2xl p-6 flex flex-col justify-center overflow-hidden relative shadow-xl">
        <div className="absolute top-2 right-2 p-4 opacity-5 text-sky-400 pointer-events-none"><Brain className="w-24 h-24" /></div>
        <h3 className="text-base font-black text-sky-400 tracking-wide mb-1">Algorithm Ready</h3>
        <p className="text-xs text-slate-400 max-w-[85%] leading-relaxed mb-5">The SRS algorithm has detected 15 items ready for high-intensity recall. Ready to boost your retention?</p>
        <button onClick={() => alert('Bắt đầu chuỗi luyện trí nhớ nâng cao!')} className="self-start flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-[#0b1326] px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-sky-500/10 active:scale-95 transition-all uppercase tracking-wider">
          START SESSION →
        </button>
      </div>
    </div>
  );
}

export default FlashcardsView;