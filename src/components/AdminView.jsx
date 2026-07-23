import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Plus, Trash2, Layers, BookOpen, Sparkles, RefreshCw, CheckCircle2, Save, Undo2, AlertCircle } from 'lucide-react';

function AdminView({ lessons, kanjiDeck, vocabList, refreshData }) {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'kanji', 'vocab'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ---------------- LOCAL STAGING STATES ----------------
  const [localLessons, setLocalLessons] = useState([]);
  const [localKanji, setLocalKanji] = useState([]);
  const [localVocab, setLocalVocab] = useState([]);

  // Theo dõi các phần tử chờ Thêm/Xóa trên Database
  const [pendingChanges, setPendingChanges] = useState({
    lessons: { insert: [], delete: [] },
    kanji: { insert: [], delete: [] },
    vocab: { insert: [], delete: [] },
  });

  // Đồng bộ dữ liệu ban đầu từ Supabase vào Local State
  useEffect(() => {
    setLocalLessons(lessons || []);
    setLocalKanji(kanjiDeck || []);
    setLocalVocab(vocabList || []);
    resetPendingChanges();
  }, [lessons, kanjiDeck, vocabList]);

  const resetPendingChanges = () => {
    setPendingChanges({
      lessons: { insert: [], delete: [] },
      kanji: { insert: [], delete: [] },
      vocab: { insert: [], delete: [] },
    });
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  // Form states
  const [lessonForm, setLessonForm] = useState({ lesson_name: '', week: 'WEEK 1', description: '', youtube_embed_id: '' });
  const [kanjiForm, setKanjiForm] = useState({ char: '', trans: '', onyomi: '', level: 'LVL 1' });
  const [vocabForm, setVocabForm] = useState({ kanji: '', romaji: '', english: '', stage: 'GROWING' });

  // ---------------- THAO TÁC CỤC BỘ (STAGING) ----------------

  // 1. BÀI HỌC
  const handleStageAddLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.lesson_name) return;

    const newItem = {
      ...lessonForm,
      temp_id: 'temp_' + Date.now(),
      status: false,
      is_new: true,
    };

    setLocalLessons([newItem, ...localLessons]);
    setPendingChanges(prev => ({
      ...prev,
      lessons: { ...prev.lessons, insert: [newItem, ...prev.lessons.insert] }
    }));

    setLessonForm({ lesson_name: '', week: 'WEEK 1', description: '', youtube_embed_id: '' });
  };

  const handleStageDeleteLesson = (item) => {
    setLocalLessons(localLessons.filter(l => (l.id ? l.id !== item.id : l.temp_id !== item.temp_id)));

    setPendingChanges(prev => {
      if (item.is_new) {
        return {
          ...prev,
          lessons: { ...prev.lessons, insert: prev.lessons.insert.filter(i => i.temp_id !== item.temp_id) }
        };
      } else {
        return {
          ...prev,
          lessons: { ...prev.lessons, delete: [...prev.lessons.delete, item.id] }
        };
      }
    });
  };

  // 2. KANJI
  const handleStageAddKanji = (e) => {
    e.preventDefault();
    if (!kanjiForm.char || !kanjiForm.trans) return;

    const newItem = { ...kanjiForm, temp_id: 'temp_' + Date.now(), progress: 0, is_new: true };
    setLocalKanji([newItem, ...localKanji]);
    setPendingChanges(prev => ({
      ...prev,
      kanji: { ...prev.kanji, insert: [newItem, ...prev.kanji.insert] }
    }));

    setKanjiForm({ char: '', trans: '', onyomi: '', level: 'LVL 1' });
  };

  const handleStageDeleteKanji = (item) => {
    setLocalKanji(localKanji.filter(k => (k.id ? k.id !== item.id : k.temp_id !== item.temp_id)));

    setPendingChanges(prev => {
      if (item.is_new) {
        return {
          ...prev,
          kanji: { ...prev.kanji, insert: prev.kanji.insert.filter(i => i.temp_id !== item.temp_id) }
        };
      } else {
        return {
          ...prev,
          kanji: { ...prev.kanji, delete: [...prev.kanji.delete, item.id] }
        };
      }
    });
  };

  // 3. TỪ VỰNG
  const handleStageAddVocab = (e) => {
    e.preventDefault();
    if (!vocabForm.kanji || !vocabForm.romaji) return;

    const newItem = { ...vocabForm, temp_id: 'temp_' + Date.now(), progress: 0, is_new: true };
    setLocalVocab([newItem, ...localVocab]);
    setPendingChanges(prev => ({
      ...prev,
      vocab: { ...prev.vocab, insert: [newItem, ...prev.vocab.insert] }
    }));

    setVocabForm({ kanji: '', romaji: '', english: '', stage: 'GROWING' });
  };

  const handleStageDeleteVocab = (item) => {
    setLocalVocab(localVocab.filter(v => (v.id ? v.id !== item.id : v.temp_id !== item.temp_id)));

    setPendingChanges(prev => {
      if (item.is_new) {
        return {
          ...prev,
          vocab: { ...prev.vocab, insert: prev.vocab.insert.filter(i => i.temp_id !== item.temp_id) }
        };
      } else {
        return {
          ...prev,
          vocab: { ...prev.vocab, delete: [...prev.vocab.delete, item.id] }
        };
      }
    });
  };

  // Tính tổng số thay đổi chưa lưu
  const totalPendingCount =
    pendingChanges.lessons.insert.length + pendingChanges.lessons.delete.length +
    pendingChanges.kanji.insert.length + pendingChanges.kanji.delete.length +
    pendingChanges.vocab.insert.length + pendingChanges.vocab.delete.length;

  // ---------------- XÁC NHẬN ĐỒNG BỘ HÀNG LOẠT VÀO DATABASE ----------------
  const handleSaveChangesToSupabase = async () => {
    if (totalPendingCount === 0) return;

    setLoading(true);
    try {
      // 1. Thực thi Xóa bài học / Kanji / Từ vựng
      if (pendingChanges.lessons.delete.length > 0) {
        await supabase.from('lessons').delete().in('id', pendingChanges.lessons.delete);
      }
      if (pendingChanges.kanji.delete.length > 0) {
        await supabase.from('kanji').delete().in('id', pendingChanges.kanji.delete);
      }
      if (pendingChanges.vocab.delete.length > 0) {
        await supabase.from('vocabularies').delete().in('id', pendingChanges.vocab.delete);
      }

      // 2. Thực thi Thêm hàng loạt (Loại bỏ thuộc tính tạm temp_id, is_new)
      if (pendingChanges.lessons.insert.length > 0) {
        const cleanInsert = pendingChanges.lessons.insert.map(({ temp_id, is_new, ...rest }) => rest);
        await supabase.from('lessons').insert(cleanInsert);
      }
      if (pendingChanges.kanji.insert.length > 0) {
        const cleanInsert = pendingChanges.kanji.insert.map(({ temp_id, is_new, ...rest }) => rest);
        await supabase.from('kanji').insert(cleanInsert);
      }
      if (pendingChanges.vocab.insert.length > 0) {
        const cleanInsert = pendingChanges.vocab.insert.map(({ temp_id, is_new, ...rest }) => rest);
        await supabase.from('vocabularies').insert(cleanInsert);
      }

      showNotification(`Đã lưu thành công ${totalPendingCount} thay đổi lên Database! 🎉`);
      resetPendingChanges();
      refreshData(); // Gọi lại API làm mới dữ liệu chính thức
    } catch (err) {
      alert('Lỗi khi lưu dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hủy các thay đổi chưa lưu
  const handleDiscardChanges = () => {
    setLocalLessons(lessons || []);
    setLocalKanji(kanjiDeck || []);
    setLocalVocab(vocabList || []);
    resetPendingChanges();
    showNotification('Đã hủy các thay đổi chưa lưu.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER BẢNG QUẢN TRỊ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Quản Trị Dữ Liệu (Admin Panel)</h1>
          <p className="text-xs text-slate-400 mt-1">Thao tác chỉnh sửa linh hoạt — Bấm "Xác nhận & Lưu" để áp dụng thay đổi hàng loạt</p>
        </div>

        {/* THANH THAO TÁC XÁC NHẬN BATCH SAVE */}
        <div className="flex items-center gap-3">
          {totalPendingCount > 0 && (
            <button 
              onClick={handleDiscardChanges}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-white/10"
            >
              <Undo2 className="w-3.5 h-3.5" /> Hủy thay đổi
            </button>
          )}

          <button 
            onClick={handleSaveChangesToSupabase}
            disabled={totalPendingCount === 0 || loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
              totalPendingCount > 0 
                ? 'bg-linear-to-r from-emerald-400 to-teal-500 text-[#0b1326] shadow-emerald-500/20 animate-pulse' 
                : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" /> 
            {loading ? 'Đang lưu...' : `Xác Nhận & Lưu (${totalPendingCount})`}
          </button>
        </div>
      </div>

      {/* THÔNG BÁO POPUP NHANH */}
      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG TABS ADMIN */}
      <div className="flex border-b border-white/10 gap-4 text-xs font-bold uppercase tracking-wider font-mono">
        <button 
          onClick={() => setActiveTab('lessons')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'lessons' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <Layers className="w-4 h-4" /> Bài Học ({localLessons.length})
        </button>
        <button 
          onClick={() => setActiveTab('kanji')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'kanji' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <Sparkles className="w-4 h-4" /> Chữ Kanji ({localKanji.length})
        </button>
        <button 
          onClick={() => setActiveTab('vocab')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'vocab' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <BookOpen className="w-4 h-4" /> Từ Vựng ({localVocab.length})
        </button>
      </div>

      {/* ---------------- TAB 1: QUẢN LÝ BÀI HỌC ---------------- */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Thêm Bài Học Mới</h3>
            <form onSubmit={handleStageAddLesson} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Tên Bài Học (*)</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Bài 1: Nhập môn Thể ます" 
                  value={lessonForm.lesson_name}
                  onChange={(e) => setLessonForm({ ...lessonForm, lesson_name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Tuần / Nhãn</label>
                <input 
                  type="text" 
                  placeholder="VD: WEEK 1" 
                  value={lessonForm.week}
                  onChange={(e) => setLessonForm({ ...lessonForm, week: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">YouTube Embed ID</label>
                <input 
                  type="text" 
                  placeholder="VD: e_04m16kUGE" 
                  value={lessonForm.youtube_embed_id}
                  onChange={(e) => setLessonForm({ ...lessonForm, youtube_embed_id: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Mô tả ngắn bài học</label>
                <textarea 
                  rows="3"
                  placeholder="Nhập nội dung tổng quan..." 
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Thêm Vào Danh Sách Tạm
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400 flex justify-between items-center">
              <span>DANH SÁCH BÀI HỌC</span>
              <span className="text-[10px] text-sky-400 font-normal">Mục có thẻ "Chưa lưu" cần bấm nút Xác nhận để đồng bộ</span>
            </div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {localLessons.map((item, idx) => (
                <div key={item.id || item.temp_id || idx} className={`p-4 flex items-center justify-between gap-4 transition-colors ${item.is_new ? 'bg-emerald-500/5 border-l-4 border-emerald-400' : 'hover:bg-white/5'}`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-sky-400 px-1.5 py-0.5 bg-sky-500/10 rounded">{item.week}</span>
                      {item.is_new && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Chưa lưu</span>}
                    </div>
                    <h4 className="text-xs font-bold text-white truncate mt-1">{item.lesson_name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{item.description || 'Chưa có mô tả'}</p>
                  </div>
                  <button 
                    onClick={() => handleStageDeleteLesson(item)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Xóa bài học"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- TAB 2: QUẢN LÝ KANJI ---------------- */}
      {activeTab === 'kanji' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Thêm Chữ Kanji Mới</h3>
            <form onSubmit={handleStageAddKanji} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Chữ Kanji (*)</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: 山" 
                  value={kanjiForm.char}
                  onChange={(e) => setKanjiForm({ ...kanjiForm, char: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Nghĩa tiếng Anh / Việt (*)</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Mountain / Ngọn núi" 
                  value={kanjiForm.trans}
                  onChange={(e) => setKanjiForm({ ...kanjiForm, trans: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Âm Onyomi</label>
                <input 
                  type="text" 
                  placeholder="VD: サン" 
                  value={kanjiForm.onyomi}
                  onChange={(e) => setKanjiForm({ ...kanjiForm, onyomi: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Thêm Vào Danh Sách Tạm
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH KANJI</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {localKanji.map((item, idx) => (
                <div key={item.id || item.temp_id || idx} className={`p-3 border rounded-2xl flex items-center justify-between relative ${item.is_new ? 'bg-emerald-500/10 border-emerald-400/40' : 'bg-slate-900/40 border-white/5'}`}>
                  <div>
                    <span className="text-2xl font-black text-white">{item.char}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{item.trans}</span>
                  </div>
                  <button 
                    onClick={() => handleStageDeleteKanji(item)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- TAB 3: QUẢN LÝ TỪ VỰNG ---------------- */}
      {activeTab === 'vocab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Thêm Từ Vựng Mới</h3>
            <form onSubmit={handleStageAddVocab} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Từ Kanji (*)</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: 先生" 
                  value={vocabForm.kanji}
                  onChange={(e) => setVocabForm({ ...vocabForm, kanji: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Romaji / Cách đọc (*)</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Sensei" 
                  value={vocabForm.romaji}
                  onChange={(e) => setVocabForm({ ...vocabForm, romaji: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Nghĩa tiếng Anh / Việt</label>
                <input 
                  type="text" 
                  placeholder="VD: Teacher / Giáo viên" 
                  value={vocabForm.english}
                  onChange={(e) => setVocabForm({ ...vocabForm, english: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Thêm Vào Danh Sách Tạm
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH TỪ VỰNG</div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {localVocab.map((item, idx) => (
                <div key={item.id || item.temp_id || idx} className={`p-4 flex items-center justify-between gap-4 transition-colors ${item.is_new ? 'bg-emerald-500/5 border-l-4 border-emerald-400' : 'hover:bg-white/5'}`}>
                  <div>
                    <span className="text-sm font-black text-white">{item.kanji}</span>
                    <span className="text-xs font-bold text-sky-400 ml-3">{item.romaji}</span>
                    {item.is_new && <span className="ml-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Chưa lưu</span>}
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.english}</p>
                  </div>
                  <button 
                    onClick={() => handleStageDeleteVocab(item)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default AdminView;