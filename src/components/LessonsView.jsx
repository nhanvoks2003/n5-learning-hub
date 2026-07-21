import React from 'react';
import { FileText, Play, Save, Circle, CheckCircle2, ChevronRight, Brain, Flame, Sparkles } from 'lucide-react';

function LessonsView({ 
  lessons, 
  selectedLesson, 
  handleSelectLesson, 
  toggleStatus, 
  notes, 
  setNotes, 
  saveNotes, 
  savingNotes, 
  activeNotesTab, 
  setActiveNotesTab,
  setCurrentTab // <-- NHẬN HÀM CHUYỂN TAB TẠI ĐÂY
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* DANH SÁCH BÀI HỌC BÊN TRÁI */}
      <div className="w-full lg:w-80 flex flex-col bg-[#171f33]/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="p-4 border-b border-white/5 font-bold text-slate-300 flex items-center gap-2 bg-slate-900/20">
          <FileText className="w-4 h-4 text-sky-400" />
          <span className="text-xs uppercase tracking-wider">Danh Sách ({lessons.length} bài)</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 max-h-[35vh] lg:max-h-[60vh] custom-scrollbar">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`p-4 flex items-start justify-between gap-2 cursor-pointer transition-all ${selectedLesson?.id === lesson.id ? 'bg-sky-500/10 border-l-4 border-sky-400' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
              onClick={() => handleSelectLesson(lesson)}
            >
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded mb-1 ${lesson.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sky-500/10 text-sky-400'}`}>{lesson.week}</span>
                <h4 className="font-bold text-xs text-white truncate">{lesson.lesson_name}</h4>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleStatus(lesson); }} className="text-slate-500 hover:text-sky-400 transition-colors mt-1">
                {lesson.status ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TRÌNH PHÁT VIDEO VÀ KHUNG GHI CHÚ BÊN PHẢI */}
      <div className="flex-1 flex flex-col gap-6">
        {selectedLesson ? (
          <>
            <div className="bg-[#171f33]/40 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-bold text-sky-400 font-mono tracking-widest uppercase">{selectedLesson.week}</span>
                <h2 className="text-lg font-black text-white mt-0.5">{selectedLesson.lesson_name}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedLesson.description}</p>
              </div>
              <button onClick={() => toggleStatus(selectedLesson)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${selectedLesson.status ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-linear-to-r from-sky-500 to-indigo-500 text-white shadow-md'}`}>
                {selectedLesson.status ? '✓ ĐÃ HOÀN THÀNH' : 'ĐÁNH DẤU XONG'}
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-3 flex flex-col gap-2.5">
                {selectedLesson.youtube_embed_id ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${selectedLesson.youtube_embed_id}?rel=0`} title={selectedLesson.lesson_name} frameBorder="0" allowFullScreen></iframe>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center bg-slate-900/20 text-slate-600 shadow-inner"><Play className="w-10 h-10 mb-2 stroke-1" /><p className="text-xs">Bài học bổ trợ tài liệu mở</p></div>
                )}

                {/* DOUBLE TABS NOTES SYSTEM */}
                <div className="bg-[#171f33]/40 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                  <div className="flex border-b border-white/5 mb-6 gap-6 text-xs font-bold uppercase tracking-widest">
                    <button onClick={() => setActiveNotesTab('teacher')} className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${activeNotesTab === 'teacher' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}><FileText className="w-4 h-4" /> Giáo trình lớp học</button>
                    <button onClick={() => setActiveNotesTab('personal')} className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${activeNotesTab === 'personal' ? 'text-[#4edea3]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}><Save className="w-4 h-4" /> Sổ tay của Nhân</button>
                  </div>
                  {activeNotesTab === 'teacher' ? (
                    <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-400 leading-relaxed">
                      <div className="p-4 bg-white/5 rounded-xl border-l-4 border-l-[#4edea3]"><strong className="text-[#4edea3] block mb-1 font-bold font-mono">Quy tắc vàng: Ichidan vs Godan</strong>Phân biệt chính xác nhóm động từ là chìa khóa tối quan trọng cho mọi cấu trúc chia thể ます sau này.</div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Nhóm 2 (Ichidan): Bỏ ~ru dán đuôi ~masu vào.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Nhóm 1 (Godan): Đổi âm cuối sang hàng 'i' + ~masu.</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><p className="text-[11px] text-slate-500 font-mono">Dữ liệu ghi chú tự động đồng bộ hóa lên Supabase.</p><button onClick={saveNotes} disabled={savingNotes} className="bg-linear-to-r from-[#4edea3] to-teal-500 text-[#0b1326] text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-md">{savingNotes ? 'Lưu...' : 'LƯU GHI CHÚ'}</button></div>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Hãy ghi chú các mẫu ví dụ câu bài học vào đây..." className="w-full min-h-[140px] bg-slate-950/60 border border-white/5 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50 font-mono resize-none leading-relaxed"/>
                    </div>
                  )}
                </div>
              </div>

              {/* RESOURCE SIDEBAR RIGHT - ĐÃ GẮN ONCLICK CHUYỂN TAB */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-[#171f33]/40 border border-white/5 p-5 rounded-2xl shadow-xl space-y-4">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider">Resources Tài Liệu</h3>
                  <div className="space-y-2.5">
                    
                    {/* THẺ 1: BẤM LÀ SANG TẬN NƠI KANJI & VOCABULARY */}
                    <div 
                      onClick={() => setCurrentTab('flashcards')}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3]">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">Vocabulary Deck</p>
                          <p className="text-[10px] text-slate-500">Bộ 45 Từ vựng JLPT N5</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* THẺ 2: BẤM CŨNG CHUYỂN SANG KANJI MASTERY */}
                    <div 
                      onClick={() => setCurrentTab('flashcards')}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                          <Brain className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">Kanji Precision Deck</p>
                          <p className="text-[10px] text-slate-500">Thẻ Flashcard 3D Lật MẶT</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </div>

                  </div>
                </div>

                <div className="bg-[#171f33]/40 border border-white/5 p-5 rounded-2xl shadow-xl bg-gradient-to-br from-sky-500/5 to-transparent border-sky-500/10">
                  <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase">Streak Status</span><div className="flex items-center gap-1 text-[#4edea3] font-mono font-bold text-xs"><Flame className="w-4 h-4 fill-[#4edea3]" /> 12 DAYS</div></div>
                  <div className="flex gap-1 mt-3"><div className="h-1 flex-1 bg-[#4edea3] rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div><div className="h-1 flex-1 bg-[#4edea3] rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div><div className="h-1 flex-1 bg-[#4edea3] rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div><div className="h-1 flex-1 bg-white/10 rounded-full"></div></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 py-20 border border-dashed border-white/5 rounded-2xl bg-[#171f33]/10"><p className="text-xs">Vui lòng chọn bài học ở danh sách bên cạnh.</p></div>
        )}
      </div>
    </div>
  );
}

export default LessonsView;