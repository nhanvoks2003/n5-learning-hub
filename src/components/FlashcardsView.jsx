import React, { useState } from 'react';
import { Sparkles, Volume2, Star, Brain, RotateCw } from 'lucide-react';
import { speakJapanese } from '../utils/speech';

function FlashcardsView({ kanjiDeck, vocabList }) {
  // Trạng thái lưu thẻ nào đang được lật mặt sau
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* MASTERY STATS BANNER */}
      <div className="relative overflow-hidden bg-[#171f33]/30 border border-sky-500/20 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-sky-400 mb-3 md:text-4xl">
              Kanji &amp; Vocabulary<br/><span className="text-white">Precision Training</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
              Master the foundational elements of the N5 curriculum with holographic focus and algorithmic repetition.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#131b2e]/60 border border-[#4edea3]/30 px-5 py-3 rounded-2xl">
                <span className="block text-[9px] font-mono font-bold text-[#4edea3] tracking-widest uppercase mb-1">CURRENT LEVEL</span>
                <span className="text-sm font-bold text-white">Vocabulary Specialist</span>
              </div>
              <div className="bg-[#131b2e]/60 border border-[#ffb2b7]/30 px-5 py-3 rounded-2xl">
                <span className="block text-[9px] font-mono font-bold text-[#ffb2b7] tracking-widest uppercase mb-1">STREAK</span>
                <span className="text-sm font-bold text-white">14 DAYS</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/5" cx="88" cy="88" fill="transparent" r="74" stroke="currentColor" strokeWidth="6"></circle>
                <circle className="text-sky-400" cx="88" cy="88" fill="transparent" r="74" stroke="currentColor" strokeDasharray="465" strokeDashoffset="160" strokeWidth="10" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{kanjiDeck.length}</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-0.5">KANJI DECK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY REVIEW DECK - THẺ FLASHCARD LẬT 3D + PHÁT ÂM */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-wide">Daily Review Deck</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click vào thẻ để xoay lật 3D xem đáp án chi tiết.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {kanjiDeck.map((kanji, idx) => {
            const isFlipped = flippedCards[idx];
            return (
              <div 
                key={idx} 
                onClick={() => toggleFlip(idx)}
                className="h-60 cursor-pointer [perspective:1000px] group"
              >
                <div className={`relative w-full h-full duration-500 rounded-2xl [transform-style:preserve-3d] transition-transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                  
                  {/* MẶT TRƯỚC (FRONT) */}
                  <div className="absolute inset-0 w-full h-full bg-[#171f33]/50 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between [backface-visibility:hidden] shadow-xl backdrop-blur-md group-hover:border-sky-500/50 transition-colors">
                    <div className="w-full flex justify-between items-center">
                      {/* NÚT LOA PHÁT ÂM KANJI */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); speakJapanese(kanji.char); }}
                        title="Nghe phát âm"
                        className="text-slate-500 hover:text-sky-400 p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span className={`self-end ${kanji.bg || 'bg-sky-500/10'} ${kanji.color || 'text-sky-400'} border ${kanji.border || 'border-sky-500/20'} text-[9px] font-mono font-black px-2 py-0.5 rounded-full`}>
                        {kanji.level || 'N5'}
                      </span>
                    </div>
                    
                    <div className="text-center my-auto">
                      <span className="text-6xl font-black text-white group-hover:text-sky-400 transition-colors select-none">
                        {kanji.char}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono font-bold">
                      <RotateCw className="w-3 h-3 text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Bấm để lật</span>
                    </div>
                  </div>

                  {/* MẶT SAU (BACK) */}
                  <div className="absolute inset-0 w-full h-full bg-[#0f172a] border border-sky-500/40 rounded-2xl p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl backdrop-blur-xl">
                    <div className="text-center space-y-2 my-auto">
                      <span className="text-3xl font-black text-sky-400">{kanji.char}</span>
                      <div>
                        <span className="block text-sm font-bold text-white">{kanji.trans}</span>
                        <span className="block text-[10px] font-mono text-slate-400 mt-1">ON: {kanji.onyomi || '---'}</span>
                      </div>
                    </div>
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold">
                        <span>MASTERY</span>
                        <span>{kanji.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden p-0.5">
                        <div className={`h-full rounded-full ${(kanji.progress || 0) >= 80 ? 'bg-[#4edea3]' : 'bg-sky-400'}`} style={{ width: `${kanji.progress || 0}%` }}></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT VOCABULARY + PHÁT ÂM */}
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
                {/* NÚT PHÁT ÂM TỪ VỰNG DÙNG WEB SPEECH API */}
                <button 
                  onClick={() => speakJapanese(vocab.kanji)} 
                  title="Phát âm tiếng Nhật"
                  className="hover:text-sky-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors active:scale-90"
                >
                  <Volume2 className="w-4 h-4 text-sky-400" />
                </button>
                <button className="hover:text-amber-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"><Star className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THẺ ALGORITHM */}
      <div className="bg-linear-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20 rounded-2xl p-6 flex flex-col justify-center overflow-hidden relative shadow-xl">
        <div className="absolute top-2 right-2 p-4 opacity-5 text-sky-400 pointer-events-none"><Brain className="w-24 h-24" /></div>
        <h3 className="text-base font-black text-sky-400 tracking-wide mb-1">Algorithm Ready</h3>
        <p className="text-xs text-slate-400 max-w-[85%] leading-relaxed mb-5">The SRS algorithm has detected 15 items ready for high-intensity recall. Ready to boost your retention?</p>
        <button onClick={() => alert('Bắt đầu chuỗi luyện trí nhớ!')} className="self-start flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-[#0b1326] px-5 py-2 rounded-xl text-xs font-black shadow-lg active:scale-95 transition-all uppercase tracking-wider">
          START SESSION →
        </button>
      </div>

    </div>
  );
}

export default FlashcardsView;