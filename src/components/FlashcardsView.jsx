import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Filter } from 'lucide-react';

function FlashcardsView({ kanjiDeck, vocabList }) {
  const [mode, setMode] = useState('vocab'); // 'kanji' hoặc 'vocab'
  const [selectedWeek, setSelectedWeek] = useState('ALL'); // Lọc theo Tuần
  const [flippedIndex, setFlippedIndex] = useState(null);

  // Phát âm tiếng Nhật Web Speech API
  const speakJapanese = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Lấy danh sách các Tuần duy nhất từ Database
  const availableWeeks = ['ALL', ...Array.from(new Set(vocabList.map(v => v.week || 'WEEK 1')))];

  // Lọc từ vựng theo Tuần đã chọn
  const filteredVocab = selectedWeek === 'ALL' 
    ? vocabList 
    : vocabList.filter(v => (v.week || 'WEEK 1') === selectedWeek);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER MÀN HÌNH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Kho Luyện Tập Flashcard</h1>
          <p className="text-xs text-slate-400 mt-1">Lật thẻ ghi nhớ Kanji & Từ vựng kết hợp phát âm giọng chuẩn Tokyo</p>
        </div>

        {/* CHUYỂN ĐỔI CHẾ ĐỘ HỌC */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs font-bold font-mono">
          <button 
            onClick={() => { setMode('vocab'); setFlippedIndex(null); }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${mode === 'vocab' ? 'bg-sky-500 text-[#0b1326] shadow-lg font-black' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" /> Từ Vựng ({filteredVocab.length})
          </button>
          <button 
            onClick={() => { setMode('kanji'); setFlippedIndex(null); }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${mode === 'kanji' ? 'bg-sky-500 text-[#0b1326] shadow-lg font-black' : 'text-slate-400 hover:text-white'}`}
          >
            <Sparkles className="w-4 h-4" /> Kanji ({kanjiDeck.length})
          </button>
        </div>
      </div>

      {/* BỘ LỌC THEO TUẦN (CHỈ HIỂN THỊ KHI Ở CHẾ ĐỘ TỪ VỰNG) */}
      {mode === 'vocab' && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 shrink-0">
            <Filter className="w-4 h-4 text-sky-400" /> Lọc Tuần:
          </div>
          {availableWeeks.map(week => (
            <button
              key={week}
              onClick={() => { setSelectedWeek(week); setFlippedIndex(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                selectedWeek === week 
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-md' 
                  : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {week === 'ALL' ? 'Tất cả bài' : week}
            </button>
          ))}
        </div>
      )}

      {/* DANH SÁCH FLASHCARDS TỪ VỰNG */}
      {mode === 'vocab' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocab.map((item, idx) => {
            const isFlipped = flippedIndex === idx;

            return (
              <div 
                key={item.id || idx}
                onClick={() => setFlippedIndex(isFlipped ? null : idx)}
                className="group relative h-48 rounded-3xl bg-[#171f33]/50 border border-white/10 p-6 flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition-all duration-300 shadow-xl hover:shadow-sky-500/10 active:scale-98"
              >
                {/* HEAD CARD */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                    {item.week || 'WEEK 1'}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(item.kanji);
                    }}
                    className="p-2 rounded-full bg-white/5 hover:bg-sky-500 hover:text-[#0b1326] text-slate-400 transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* CONTENT CARD (LẬT MẶT) */}
                <div className="text-center my-auto">
                  {!isFlipped ? (
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white tracking-wide">{item.kanji}</h3>
                      <p className="text-xs font-bold text-sky-400 font-mono">{item.romaji}</p>
                    </div>
                  ) : (
                    <div className="space-y-1 animate-fade-in">
                      <p className="text-sm font-black text-emerald-400">{item.english}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Bấm để lật lại</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {isFlipped ? 'Nghĩa tiếng Việt' : 'Bấm thẻ để xem nghĩa'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DANH SÁCH FLASHCARDS KANJI */}
      {mode === 'kanji' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {kanjiDeck.map((item, idx) => (
            <div 
              key={item.id || idx}
              onClick={() => speakJapanese(item.char)}
              className="group bg-[#171f33]/50 border border-white/10 rounded-3xl p-6 text-center space-y-3 hover:border-sky-500/50 transition-all cursor-pointer shadow-xl active:scale-95"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl font-black text-white group-hover:scale-110 transition-transform">
                {item.char}
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-400">{item.trans}</h4>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Âm Onyomi: {item.onyomi || '---'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default FlashcardsView;