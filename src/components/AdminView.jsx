import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Plus, Trash2, Pencil, Layers, BookOpen, Sparkles, CheckCircle2, Save, Undo2, X } from 'lucide-react';

function AdminView({ lessons, kanjiDeck, vocabList, refreshData }) {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'kanji', 'vocab'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ---------------- LOCAL STAGING STATES ----------------
  const [localLessons, setLocalLessons] = useState([]);
  const [localKanji, setLocalKanji] = useState([]);
  const [localVocab, setLocalVocab] = useState([]);

  // LƯU ĐANG CHỈNH SỬA MỤC NÀO
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingKanjiId, setEditingKanjiId] = useState(null);
  const [editingVocabId, setEditingVocabId] = useState(null);

  // Theo dõi các thay đổi chưa lưu (Insert, Delete, Update)
  const [pendingChanges, setPendingChanges] = useState({
    lessons: { insert: [], delete: [], update: [] },
    kanji: { insert: [], delete: [], update: [] },
    vocab: { insert: [], delete: [], update: [] },
  });

  useEffect(() => {
    setLocalLessons(lessons || []);
    setLocalKanji(kanjiDeck || []);
    setLocalVocab(vocabList || []);
    resetPendingChanges();
  }, [lessons, kanjiDeck, vocabList]);

  const resetPendingChanges = () => {
    setPendingChanges({
      lessons: { insert: [], delete: [], update: [] },
      kanji: { insert: [], delete: [], update: [] },
      vocab: { insert: [], delete: [], update: [] },
    });
    handleCancelEdit();
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  // Forms
  const [lessonForm, setLessonForm] = useState({ lesson_name: '', week: 'WEEK 1', description: '', youtube_embed_id: '' });
  const [kanjiForm, setKanjiForm] = useState({ char: '', trans: '', onyomi: '', level: 'LVL 1' });
  const [vocabForm, setVocabForm] = useState({ kanji: '', romaji: '', english: '', week: 'WEEK 1', stage: 'GROWING' });

  const handleCancelEdit = () => {
    setEditingLessonId(null);
    setEditingKanjiId(null);
    setEditingVocabId(null);
    setLessonForm({ lesson_name: '', week: 'WEEK 1', description: '', youtube_embed_id: '' });
    setKanjiForm({ char: '', trans: '', onyomi: '', level: 'LVL 1' });
    setVocabForm({ kanji: '', romaji: '', english: '', week: 'WEEK 1', stage: 'GROWING' });
  };

  // ---------------- 1. XỬ LÝ BÀI HỌC (LESSONS) ----------------
  const handleStartEditLesson = (item) => {
    setEditingLessonId(item.id || item.temp_id);
    setLessonForm({
      lesson_name: item.lesson_name,
      week: item.week || 'WEEK 1',
      description: item.description || '',
      youtube_embed_id: item.youtube_embed_id || '',
    });
  };

  const handleSaveLessonForm = (e) => {
    e.preventDefault();
    if (!lessonForm.lesson_name) return;

    if (editingLessonId) {
      const updatedList = localLessons.map(l => {
        if ((l.id && l.id === editingLessonId) || (l.temp_id && l.temp_id === editingLessonId)) {
          return { ...l, ...lessonForm, is_edited: !l.is_new };
        }
        return l;
      });
      setLocalLessons(updatedList);

      const updatedItem = updatedList.find(l => (l.id === editingLessonId || l.temp_id === editingLessonId));

      setPendingChanges(prev => {
        if (updatedItem.is_new) {
          return {
            ...prev,
            lessons: {
              ...prev.lessons,
              insert: prev.lessons.insert.map(i => i.temp_id === editingLessonId ? updatedItem : i)
            }
          };
        } else {
          const existsInUpdate = prev.lessons.update.some(u => u.id === updatedItem.id);
          const newUpdateArr = existsInUpdate
            ? prev.lessons.update.map(u => u.id === updatedItem.id ? updatedItem : u)
            : [...prev.lessons.update, updatedItem];
          return { ...prev, lessons: { ...prev.lessons, update: newUpdateArr } };
        }
      });
      handleCancelEdit();
    } else {
      const newItem = { ...lessonForm, temp_id: 'temp_' + Date.now(), status: false, is_new: true };
      setLocalLessons([newItem, ...localLessons]);
      setPendingChanges(prev => ({
        ...prev,
        lessons: { ...prev.lessons, insert: [newItem, ...prev.lessons.insert] }
      }));
      setLessonForm({ lesson_name: '', week: 'WEEK 1', description: '', youtube_embed_id: '' });
    }
  };

  const handleDeleteLesson = (item) => {
    setLocalLessons(localLessons.filter(l => (l.id ? l.id !== item.id : l.temp_id !== item.temp_id)));
    if (editingLessonId === (item.id || item.temp_id)) handleCancelEdit();

    setPendingChanges(prev => {
      if (item.is_new) {
        return { ...prev, lessons: { ...prev.lessons, insert: prev.lessons.insert.filter(i => i.temp_id !== item.temp_id) } };
      } else {
        return {
          ...prev,
          lessons: {
            ...prev.lessons,
            update: prev.lessons.update.filter(u => u.id !== item.id),
            delete: [...prev.lessons.delete, item.id]
          }
        };
      }
    });
  };

  // ---------------- 2. XỬ LÝ KANJI ----------------
  const handleStartEditKanji = (item) => {
    setEditingKanjiId(item.id || item.temp_id);
    setKanjiForm({
      char: item.char,
      trans: item.trans,
      onyomi: item.onyomi || '',
      level: item.level || 'LVL 1',
    });
  };

  const handleSaveKanjiForm = (e) => {
    e.preventDefault();
    if (!kanjiForm.char || !kanjiForm.trans) return;

    if (editingKanjiId) {
      const updatedList = localKanji.map(k => {
        if ((k.id && k.id === editingKanjiId) || (k.temp_id && k.temp_id === editingKanjiId)) {
          return { ...k, ...kanjiForm, is_edited: !k.is_new };
        }
        return k;
      });
      setLocalKanji(updatedList);

      const updatedItem = updatedList.find(k => (k.id === editingKanjiId || k.temp_id === editingKanjiId));

      setPendingChanges(prev => {
        if (updatedItem.is_new) {
          return {
            ...prev,
            kanji: {
              ...prev.kanji,
              insert: prev.kanji.insert.map(i => i.temp_id === editingKanjiId ? updatedItem : i)
            }
          };
        } else {
          const existsInUpdate = prev.kanji.update.some(u => u.id === updatedItem.id);
          const newUpdateArr = existsInUpdate
            ? prev.kanji.update.map(u => u.id === updatedItem.id ? updatedItem : u)
            : [...prev.kanji.update, updatedItem];
          return { ...prev, kanji: { ...prev.kanji, update: newUpdateArr } };
        }
      });
      handleCancelEdit();
    } else {
      const newItem = { ...kanjiForm, temp_id: 'temp_' + Date.now(), progress: 0, is_new: true };
      setLocalKanji([newItem, ...localKanji]);
      setPendingChanges(prev => ({
        ...prev,
        kanji: { ...prev.kanji, insert: [newItem, ...prev.kanji.insert] }
      }));
      setKanjiForm({ char: '', trans: '', onyomi: '', level: 'LVL 1' });
    }
  };

  const handleDeleteKanji = (item) => {
    setLocalKanji(localKanji.filter(k => (k.id ? k.id !== item.id : k.temp_id !== item.temp_id)));
    if (editingKanjiId === (item.id || item.temp_id)) handleCancelEdit();

    setPendingChanges(prev => {
      if (item.is_new) {
        return { ...prev, kanji: { ...prev.kanji, insert: prev.kanji.insert.filter(i => i.temp_id !== item.temp_id) } };
      } else {
        return {
          ...prev,
          kanji: {
            ...prev.kanji,
            update: prev.kanji.update.filter(u => u.id !== item.id),
            delete: [...prev.kanji.delete, item.id]
          }
        };
      }
    });
  };

  // ---------------- 3. XỬ LÝ TỪ VỰNG (VOCAB) ----------------
  const handleStartEditVocab = (item) => {
    setEditingVocabId(item.id || item.temp_id);
    setVocabForm({
      kanji: item.kanji,
      romaji: item.romaji,
      english: item.english || '',
      week: item.week || 'WEEK 1',
      stage: item.stage || 'GROWING',
    });
  };

  const handleSaveVocabForm = (e) => {
    e.preventDefault();
    if (!vocabForm.kanji || !vocabForm.romaji) return;

    if (editingVocabId) {
      const updatedList = localVocab.map(v => {
        if ((v.id && v.id === editingVocabId) || (v.temp_id && v.temp_id === editingVocabId)) {
          return { ...v, ...vocabForm, is_edited: !v.is_new };
        }
        return v;
      });
      setLocalVocab(updatedList);

      const updatedItem = updatedList.find(v => (v.id === editingVocabId || v.temp_id === editingVocabId));

      setPendingChanges(prev => {
        if (updatedItem.is_new) {
          return {
            ...prev,
            vocab: {
              ...prev.vocab,
              insert: prev.vocab.insert.map(i => i.temp_id === editingVocabId ? updatedItem : i)
            }
          };
        } else {
          const existsInUpdate = prev.vocab.update.some(u => u.id === updatedItem.id);
          const newUpdateArr = existsInUpdate
            ? prev.vocab.update.map(u => u.id === updatedItem.id ? updatedItem : u)
            : [...prev.vocab.update, updatedItem];
          return { ...prev, vocab: { ...prev.vocab, update: newUpdateArr } };
        }
      });
      handleCancelEdit();
    } else {
      const newItem = { ...vocabForm, temp_id: 'temp_' + Date.now(), progress: 0, is_new: true };
      setLocalVocab([newItem, ...localVocab]);
      setPendingChanges(prev => ({
        ...prev,
        vocab: { ...prev.vocab, insert: [newItem, ...prev.vocab.insert] }
      }));
      setVocabForm({ kanji: '', romaji: '', english: '', week: 'WEEK 1', stage: 'GROWING' });
    }
  };

  const handleDeleteVocab = (item) => {
    setLocalVocab(localVocab.filter(v => (v.id ? v.id !== item.id : v.temp_id !== item.temp_id)));
    if (editingVocabId === (item.id || item.temp_id)) handleCancelEdit();

    setPendingChanges(prev => {
      if (item.is_new) {
        return { ...prev, vocab: { ...prev.vocab, insert: prev.vocab.insert.filter(i => i.temp_id !== item.temp_id) } };
      } else {
        return {
          ...prev,
          vocab: {
            ...prev.vocab,
            update: prev.vocab.update.filter(u => u.id !== item.id),
            delete: [...prev.vocab.delete, item.id]
          }
        };
      }
    });
  };

  // ĐẾM TỔNG SỐ LẦN THAY ĐỔI
  const totalPendingCount =
    pendingChanges.lessons.insert.length + pendingChanges.lessons.delete.length + pendingChanges.lessons.update.length +
    pendingChanges.kanji.insert.length + pendingChanges.kanji.delete.length + pendingChanges.kanji.update.length +
    pendingChanges.vocab.insert.length + pendingChanges.vocab.delete.length + pendingChanges.vocab.update.length;

  // LƯU HÀNG LOẠT VÀO SUPABASE
  const handleSaveChangesToSupabase = async () => {
    if (totalPendingCount === 0) return;

    setLoading(true);
    try {
      // 1. DELETE
      if (pendingChanges.lessons.delete.length > 0) await supabase.from('lessons').delete().in('id', pendingChanges.lessons.delete);
      if (pendingChanges.kanji.delete.length > 0) await supabase.from('kanji').delete().in('id', pendingChanges.kanji.delete);
      if (pendingChanges.vocab.delete.length > 0) await supabase.from('vocabularies').delete().in('id', pendingChanges.vocab.delete);

      // 2. INSERT
      if (pendingChanges.lessons.insert.length > 0) {
        const clean = pendingChanges.lessons.insert.map(({ temp_id, is_new, is_edited, ...rest }) => rest);
        await supabase.from('lessons').insert(clean);
      }
      if (pendingChanges.kanji.insert.length > 0) {
        const clean = pendingChanges.kanji.insert.map(({ temp_id, is_new, is_edited, ...rest }) => rest);
        await supabase.from('kanji').insert(clean);
      }
      if (pendingChanges.vocab.insert.length > 0) {
        const clean = pendingChanges.vocab.insert.map(({ temp_id, is_new, is_edited, ...rest }) => rest);
        await supabase.from('vocabularies').insert(clean);
      }

      // 3. UPDATE (UPSERT)
      if (pendingChanges.lessons.update.length > 0) {
        const clean = pendingChanges.lessons.update.map(({ temp_id, is_new, is_edited, ...rest }) => rest);
        await supabase.from('lessons').upsert(clean);
      }
      if (pendingChanges.kanji.update.length > 0) {
        const clean = pendingChanges.kanji.update.map(({ temp_id, is_new, is_edited, ...rest }) => rest);
        await supabase.from('kanji').upsert(clean);
      }
      if (pendingChanges.vocab.update.length > 0) {
        const clean = pendingChanges.vocab.update.map(({ temp_id, is_new, is_edited, ...rest }) => rest);
        await supabase.from('vocabularies').upsert(clean);
      }

      showNotification(`Đã lưu thành công ${totalPendingCount} thay đổi lên Database! 🎉`);
      resetPendingChanges();
      refreshData();
    } catch (err) {
      alert('Lỗi khi lưu dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    setLocalLessons(lessons || []);
    setLocalKanji(kanjiDeck || []);
    setLocalVocab(vocabList || []);
    resetPendingChanges();
    showNotification('Đã hủy các thay đổi chưa lưu.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Quản Trị Dữ Liệu (Admin Panel)</h1>
          <p className="text-xs text-slate-400 mt-1">Thêm, Sửa, Xóa linh hoạt — Bấm "Xác nhận & Lưu" để đồng bộ hàng loạt lên Supabase</p>
        </div>

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

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      {/* TABS */}
      <div className="flex border-b border-white/10 gap-4 text-xs font-bold uppercase tracking-wider font-mono">
        <button 
          onClick={() => { setActiveTab('lessons'); handleCancelEdit(); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'lessons' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <Layers className="w-4 h-4" /> Bài Học ({localLessons.length})
        </button>
        <button 
          onClick={() => { setActiveTab('kanji'); handleCancelEdit(); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'kanji' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <Sparkles className="w-4 h-4" /> Chữ Kanji ({localKanji.length})
        </button>
        <button 
          onClick={() => { setActiveTab('vocab'); handleCancelEdit(); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'vocab' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <BookOpen className="w-4 h-4" /> Từ Vựng ({localVocab.length})
        </button>
      </div>

      {/* ---------------- TAB 1: BÀI HỌC ---------------- */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                {editingLessonId ? '✏️ Cập Nhật Bài Học' : '➕ Thêm Bài Học Mới'}
              </h3>
              {editingLessonId && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Hủy sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSaveLessonForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Tên Bài Học (*)</label>
                <input 
                  type="text" required placeholder="VD: Bài 1: Nhập môn Thể ます" 
                  value={lessonForm.lesson_name}
                  onChange={(e) => setLessonForm({ ...lessonForm, lesson_name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Tuần / Nhãn</label>
                <input 
                  type="text" placeholder="VD: WEEK 1" 
                  value={lessonForm.week}
                  onChange={(e) => setLessonForm({ ...lessonForm, week: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">YouTube Embed ID</label>
                <input 
                  type="text" placeholder="VD: e_04m16kUGE" 
                  value={lessonForm.youtube_embed_id}
                  onChange={(e) => setLessonForm({ ...lessonForm, youtube_embed_id: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Mô tả ngắn bài học</label>
                <textarea 
                  rows="3" placeholder="Nhập nội dung tổng quan..." 
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                  editingLessonId ? 'bg-amber-400 text-[#0b1326]' : 'bg-sky-500 text-[#0b1326]'
                }`}
              >
                {editingLessonId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingLessonId ? 'Lưu Thay Đổi (Tạm)' : 'Thêm Vào Danh Sách Tạm'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH BÀI HỌC</div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {localLessons.map((item, idx) => {
                const itemId = item.id || item.temp_id;
                const isEditing = editingLessonId === itemId;

                return (
                  <div key={itemId || idx} className={`p-4 flex items-center justify-between gap-4 transition-colors ${isEditing ? 'bg-amber-500/10 border-l-4 border-amber-400' : item.is_new ? 'bg-emerald-500/5 border-l-4 border-emerald-400' : item.is_edited ? 'bg-sky-500/5 border-l-4 border-sky-400' : 'hover:bg-white/5'}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold text-sky-400 px-1.5 py-0.5 bg-sky-500/10 rounded">{item.week}</span>
                        {item.is_new && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Chưa lưu</span>}
                        {item.is_edited && <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded font-mono">Đã sửa</span>}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-1">{item.lesson_name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{item.description || 'Chưa có mô tả'}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => handleStartEditLesson(item)}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                        title="Chỉnh sửa bài học"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(item)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Xóa bài học"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- TAB 2: KANJI ---------------- */}
      {activeTab === 'kanji' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                {editingKanjiId ? '✏️ Cập Nhật Kanji' : '➕ Thêm Kanji Mới'}
              </h3>
              {editingKanjiId && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Hủy sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSaveKanjiForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Chữ Kanji (*)</label>
                <input 
                  type="text" required placeholder="VD: 山" 
                  value={kanjiForm.char}
                  onChange={(e) => setKanjiForm({ ...kanjiForm, char: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Nghĩa tiếng Anh / Việt (*)</label>
                <input 
                  type="text" required placeholder="VD: Mountain / Ngọn núi" 
                  value={kanjiForm.trans}
                  onChange={(e) => setKanjiForm({ ...kanjiForm, trans: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Âm Onyomi</label>
                <input 
                  type="text" placeholder="VD: サン" 
                  value={kanjiForm.onyomi}
                  onChange={(e) => setKanjiForm({ ...kanjiForm, onyomi: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                  editingKanjiId ? 'bg-amber-400 text-[#0b1326]' : 'bg-sky-500 text-[#0b1326]'
                }`}
              >
                {editingKanjiId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingKanjiId ? 'Lưu Thay Đổi (Tạm)' : 'Thêm Vào Danh Sách Tạm'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH KANJI</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {localKanji.map((item, idx) => {
                const itemId = item.id || item.temp_id;
                const isEditing = editingKanjiId === itemId;

                return (
                  <div key={itemId || idx} className={`p-3 border rounded-2xl flex items-center justify-between ${isEditing ? 'bg-amber-500/10 border-amber-400' : item.is_new ? 'bg-emerald-500/10 border-emerald-400' : item.is_edited ? 'bg-sky-500/10 border-sky-400' : 'bg-slate-900/40 border-white/5'}`}>
                    <div>
                      <span className="text-2xl font-black text-white">{item.char}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{item.trans}</span>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => handleStartEditKanji(item)} className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteKanji(item)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- TAB 3: TỪ VỰNG ---------------- */}
      {activeTab === 'vocab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                {editingVocabId ? '✏️ Cập Nhật Từ Vựng' : '➕ Thêm Từ Vựng Mới'}
              </h3>
              {editingVocabId && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Hủy sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSaveVocabForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Từ Kanji (*)</label>
                <input 
                  type="text" required placeholder="VD: 先生" 
                  value={vocabForm.kanji}
                  onChange={(e) => setVocabForm({ ...vocabForm, kanji: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Romaji / Cách đọc (*)</label>
                <input 
                  type="text" required placeholder="VD: Sensei" 
                  value={vocabForm.romaji}
                  onChange={(e) => setVocabForm({ ...vocabForm, romaji: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Nghĩa tiếng Anh / Việt</label>
                <input 
                  type="text" placeholder="VD: Teacher / Giáo viên" 
                  value={vocabForm.english}
                  onChange={(e) => setVocabForm({ ...vocabForm, english: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Phân loại Tuần (*)</label>
                <input 
                  type="text" required placeholder="VD: WEEK 1" 
                  value={vocabForm.week}
                  onChange={(e) => setVocabForm({ ...vocabForm, week: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                  editingVocabId ? 'bg-amber-400 text-[#0b1326]' : 'bg-sky-500 text-[#0b1326]'
                }`}
              >
                {editingVocabId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingVocabId ? 'Lưu Thay Đổi (Tạm)' : 'Thêm Vào Danh Sách Tạm'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH TỪ VỰNG</div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {localVocab.map((item, idx) => {
                const itemId = item.id || item.temp_id;
                const isEditing = editingVocabId === itemId;

                return (
                  <div key={itemId || idx} className={`p-4 flex items-center justify-between gap-4 transition-colors ${isEditing ? 'bg-amber-500/10 border-l-4 border-amber-400' : item.is_new ? 'bg-emerald-500/5 border-l-4 border-emerald-400' : item.is_edited ? 'bg-sky-500/5 border-l-4 border-sky-400' : 'hover:bg-white/5'}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold text-sky-400 px-1.5 py-0.5 bg-sky-500/10 rounded">{item.week || 'WEEK 1'}</span>
                        <span className="text-sm font-black text-white">{item.kanji}</span>
                        <span className="text-xs font-bold text-sky-400">{item.romaji}</span>
                        {item.is_new && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Chưa lưu</span>}
                        {item.is_edited && <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded font-mono">Đã sửa</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{item.english}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleStartEditVocab(item)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteVocab(item)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default AdminView;