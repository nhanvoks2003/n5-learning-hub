import React, { useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Plus, Trash2, Layers, BookOpen, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

function AdminView({ lessons, kanjiDeck, vocabList, refreshData }) {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'kanji', 'vocab'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states cho Bài học
  const [lessonForm, setLessonForm] = useState({
    lesson_name: '',
    week: 'WEEK 1',
    description: '',
    youtube_embed_id: '',
  });

  // Form states cho Kanji
  const [kanjiForm, setKanjiForm] = useState({
    char: '',
    trans: '',
    onyomi: '',
    level: 'LVL 1',
  });

  // Form states cho Từ vựng
  const [vocabForm, setVocabForm] = useState({
    kanji: '',
    romaji: '',
    english: '',
    stage: 'GROWING',
  });

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // --- THÊM BÀI HỌC MỚI ---
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.lesson_name) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('lessons').insert([
        { ...lessonForm, status: false }
      ]);
      if (error) throw error;
      showNotification('Đã thêm Bài học mới thành công! 🎉');
      setLessonForm({ lesson_name: '', week: 'WEEK 1', description: '', youtube_embed_id: '' });
      refreshData();
    } catch (err) {
      alert('Lỗi thêm bài học: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- XÓA BÀI HỌC ---
  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
      showNotification('Đã xóa bài học.');
      refreshData();
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  // --- THÊM KANJI MỚI ---
  const handleAddKanji = async (e) => {
    e.preventDefault();
    if (!kanjiForm.char || !kanjiForm.trans) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('kanji').insert([
        { ...kanjiForm, progress: 0 }
      ]);
      if (error) throw error;
      showNotification('Đã thêm chữ Kanji mới! 🎉');
      setKanjiForm({ char: '', trans: '', onyomi: '', level: 'LVL 1' });
      refreshData();
    } catch (err) {
      alert('Lỗi thêm Kanji: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- XÓA KANJI ---
  const handleDeleteKanji = async (id) => {
    if (!window.confirm('Xóa chữ Kanji này khỏi database?')) return;
    try {
      const { error } = await supabase.from('kanji').delete().eq('id', id);
      if (error) throw error;
      showNotification('Đã xóa Kanji.');
      refreshData();
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  // --- THÊM TỪ VỰNG MỚI ---
  const handleAddVocab = async (e) => {
    e.preventDefault();
    if (!vocabForm.kanji || !vocabForm.romaji) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('vocabularies').insert([
        { ...vocabForm, progress: 0 }
      ]);
      if (error) throw error;
      showNotification('Đã thêm từ vựng mới! 🎉');
      setVocabForm({ kanji: '', romaji: '', english: '', stage: 'GROWING' });
      refreshData();
    } catch (err) {
      alert('Lỗi thêm từ vựng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- XÓA TỪ VỰNG ---
  const handleDeleteVocab = async (id) => {
    if (!window.confirm('Xóa từ vựng này khỏi database?')) return;
    try {
      const { error } = await supabase.from('vocabularies').delete().eq('id', id);
      if (error) throw error;
      showNotification('Đã xóa từ vựng.');
      refreshData();
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER BẢNG QUẢN TRỊ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Quản Trị Dữ Liệu (Admin Panel)</h1>
          <p className="text-xs text-slate-400 mt-1">Thêm, xóa và cập nhật nội dung khóa học trực tiếp lên Supabase</p>
        </div>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-sky-400 rounded-xl text-xs font-mono font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Đồng bộ dữ liệu
        </button>
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
          <Layers className="w-4 h-4" /> Quản Lý Bài Học ({lessons.length})
        </button>
        <button 
          onClick={() => setActiveTab('kanji')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'kanji' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <Sparkles className="w-4 h-4" /> Quản Lý Kanji ({kanjiDeck.length})
        </button>
        <button 
          onClick={() => setActiveTab('vocab')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeTab === 'vocab' ? 'text-sky-400 border-sky-400 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          <BookOpen className="w-4 h-4" /> Quản Lý Từ Vựng ({vocabList.length})
        </button>
      </div>

      {/* ---------------- TAB 1: QUẢN LÝ BÀI HỌC ---------------- */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form thêm bài học */}
          <div className="lg:col-span-5 bg-[#171f33]/40 border border-white/5 p-6 rounded-3xl shadow-xl h-fit space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Thêm Bài Học Mới</h3>
            <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
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
                <label className="block text-slate-400 mb-1 font-mono">YouTube Embed ID (11 ký tự cuối URL)</label>
                <input 
                  type="text" 
                  placeholder="VD: d9vB22K3dls" 
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
                disabled={loading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
              >
                {loading ? 'Đang lưu...' : '+ LƯU BÀI HỌC VÀO DATABASE'}
              </button>
            </form>
          </div>

          {/* Danh sách bài học hiện tại */}
          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH BÀI HỌC HIỆN CÓ</div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {lessons.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono font-bold text-sky-400 px-1.5 py-0.5 bg-sky-500/10 rounded">{item.week}</span>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">{item.lesson_name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{item.description || 'Chưa có mô tả'}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteLesson(item.id)}
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
            <form onSubmit={handleAddKanji} className="space-y-4 text-xs">
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
                disabled={loading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
              >
                {loading ? 'Đang lưu...' : '+ LƯU KANJI VÀO DATABASE'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH KANJI HIỆN CÓ</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {kanjiDeck.map(item => (
                <div key={item.id} className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">{item.char}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{item.trans}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteKanji(item.id)}
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
            <form onSubmit={handleAddVocab} className="space-y-4 text-xs">
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
                disabled={loading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
              >
                {loading ? 'Đang lưu...' : '+ LƯU TỪ VỰNG VÀO DATABASE'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#171f33]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/30 text-xs font-mono font-bold text-slate-400">DANH SÁCH TỪ VỰNG HIỆN CÓ</div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {vocabList.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div>
                    <span className="text-sm font-black text-white">{item.kanji}</span>
                    <span className="text-xs font-bold text-sky-400 ml-3">{item.romaji}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.english}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteVocab(item.id)}
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