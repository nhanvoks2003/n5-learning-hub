import React, { useState, useEffect } from 'react';
import { supabase } from './api/supabaseClient';
import { Plus } from 'lucide-react';

// Nhập khẩu các Component con độc lập
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LessonsView from './components/LessonsView';
import FlashcardsView from './components/FlashcardsView';
import LeaderboardView from './components/LeaderboardView';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard'); // Điều hướng: dashboard, lessons, flashcards, leaderboard
  const [lessons, setLessons] = useState([]);
  const [kanjiDeck, setKanjiDeck] = useState([]); // ĐÃ ĐỔI THÀNH STATE ĐỘNG
  const [vocabList, setVocabList] = useState([]); // ĐÃ ĐỔI THÀNH STATE ĐỘNG
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [activeNotesTab, setActiveNotesTab] = useState('teacher');

  useEffect(() => {
    // Gọi kích hoạt nạp toàn bộ dữ liệu từ Supabase khi ứng dụng khởi chạy
    initAppData();
  }, []);

  const initAppData = async () => {
    try {
      setLoading(true);

      // 1. Fetch danh sách bài học ngữ pháp
      const { data: lessonsData, error: lessonsError } = await supabase.from('lessons').select('*').order('id', { ascending: true });
      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
        setNotes(lessonsData[0].personal_notes || '');
      }

      // 2. Fetch danh sách chữ Kanji N5 từ bảng public.kanji mới tạo
      const { data: kanjiData, error: kanjiError } = await supabase.from('kanji').select('*').order('id', { ascending: true });
      if (kanjiError) throw kanjiError;
      setKanjiDeck(kanjiData || []);

      // 3. Fetch danh sách Từ vựng N5 từ bảng public.vocabularies mới tạo
      const { data: vocabData, error: vocabError } = await supabase.from('vocabularies').select('*').order('id', { ascending: true });
      if (vocabError) throw vocabError;
      setVocabList(vocabData || []);

    } catch (error) {
      console.error('Lỗi kết nối hệ thống dữ liệu Supabase:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (lesson) => {
    const updatedStatus = !lesson.status;
    try {
      const { error } = await supabase.from('lessons').update({ status: updatedStatus }).eq('id', lesson.id);
      if (error) throw error;
      setLessons(lessons.map(l => l.id === lesson.id ? { ...l, status: updatedStatus } : l));
      if (selectedLesson && selectedLesson.id === lesson.id) {
        setSelectedLesson({ ...selectedLesson, status: updatedStatus });
      }
    } catch (error) {
      alert('Lỗi cập nhật trạng thái: ' + error.message);
    }
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setNotes(lesson.personal_notes || '');
    setCurrentTab('lessons');
  };

  const saveNotes = async () => {
    if (!selectedLesson) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase.from('lessons').update({ personal_notes: notes }).eq('id', selectedLesson.id);
      if (error) throw error;
      setLessons(lessons.map(l => l.id === selectedLesson.id ? { ...l, personal_notes: notes } : l));
      alert('Đã lưu ghi chú thành công 🎉');
    } catch (error) {
      alert('Lỗi khi lưu ghi chú: ' + error.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const completedCount = lessons.filter(l => l.status).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1326] text-white flex items-center justify-center font-sans">
        <div className="text-center relative">
          <div className="absolute -inset-4 bg-sky-500/20 blur-xl rounded-full animate-pulse"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium tracking-wide animate-pulse">Đang đồng bộ luồng dữ liệu đám mây...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col antialiased">
      
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex flex-1">
        
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} progressPercent={progressPercent} />

        <main className="flex-1 lg:ml-64 p-6 md:p-10 max-w-7xl mx-auto w-full">
          
          {currentTab === 'dashboard' && (
            <DashboardView progressPercent={progressPercent} setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'lessons' && (
            <LessonsView 
              lessons={lessons} selectedLesson={selectedLesson} handleSelectLesson={handleSelectLesson}
              toggleStatus={toggleStatus} notes={notes} setNotes={setNotes} saveNotes={saveNotes}
              savingNotes={savingNotes} activeNotesTab={activeNotesTab} setActiveNotesTab={setActiveNotesTab}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView kanjiDeck={kanjiDeck} vocabList={vocabList} />
          )}

          {currentTab === 'leaderboard' && (
            <LeaderboardView progressPercent={progressPercent} />
          )}

        </main>
      </div>

      <button onClick={() => setCurrentTab('flashcards')} className="fixed bottom-6 right-6 w-12 h-12 bg-sky-500 text-[#0b1326] rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 focus:outline-none">
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
}

export default App;