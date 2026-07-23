import React, { useState, useEffect } from 'react';
import { supabase } from './api/supabaseClient';
import { Plus } from 'lucide-react';

// Nhập khẩu các Component con
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LessonsView from './components/LessonsView';
import FlashcardsView from './components/FlashcardsView';
import LeaderboardView from './components/LeaderboardView';
import QuizModal from './components/QuizModal';
import AdminView from './components/AdminView';
import AuthModal from './components/AuthModal';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [lessons, setLessons] = useState([]);
  const [kanjiDeck, setKanjiDeck] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [activeNotesTab, setActiveNotesTab] = useState('teacher');
  
  // STATE POPUP, PHIÊN ĐĂNG NHẬP & ROLE NGƯỜI DÙNG
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('student'); // Mặc định là 'student'

  useEffect(() => {
    initAppData();
    checkUserSession();
  }, []);

  // Lấy thông tin Role từ bảng profiles trên Supabase
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setUserRole(data.role || 'student');
      } else {
        setUserRole('student');
      }
    } catch (err) {
      console.error('Lỗi lấy role:', err.message);
      setUserRole('student');
    }
  };

  // Lắng nghe phiên đăng nhập Supabase real-time
  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchUserRole(session.user.id);
    } else {
      setUser(null);
      setUserRole('student');
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setUserRole('student');
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole('student');
    if (currentTab === 'admin') setCurrentTab('dashboard');
    alert('Đã đăng xuất tài khoản.');
  };

  const initAppData = async () => {
    try {
      setLoading(true);
      const { data: lessonsData } = await supabase.from('lessons').select('*').order('id', { ascending: true });
      setLessons(lessonsData || []);
      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
        setNotes(lessonsData[0].personal_notes || '');
      }

      const { data: kanjiData } = await supabase.from('kanji').select('*').order('id', { ascending: true });
      setKanjiDeck(kanjiData || []);

      const { data: vocabData } = await supabase.from('vocabularies').select('*').order('id', { ascending: true });
      setVocabList(vocabData || []);
    } catch (error) {
      console.error('Lỗi API:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (lesson) => {
    const updatedStatus = !lesson.status;
    try {
      await supabase.from('lessons').update({ status: updatedStatus }).eq('id', lesson.id);
      setLessons(lessons.map(l => l.id === lesson.id ? { ...l, status: updatedStatus } : l));
      if (selectedLesson && selectedLesson.id === lesson.id) {
        setSelectedLesson({ ...selectedLesson, status: updatedStatus });
      }
    } catch (error) {
      alert('Lỗi cập nhật: ' + error.message);
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
      await supabase.from('lessons').update({ personal_notes: notes }).eq('id', selectedLesson.id);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col antialiased">
      
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user} 
        userRole={userRole} // <-- TRUYỀN THÊM userRole SANG HEADER
        openAuthModal={() => setIsAuthOpen(true)}
        handleSignOut={handleSignOut}
      />

      <div className="flex flex-1">
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          progressPercent={progressPercent}
          handleSignOut={handleSignOut}
        />

        <main className="flex-1 lg:ml-64 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView progressPercent={progressPercent} setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'lessons' && (
            <LessonsView 
              lessons={lessons} selectedLesson={selectedLesson} handleSelectLesson={handleSelectLesson}
              toggleStatus={toggleStatus} notes={notes} setNotes={setNotes} saveNotes={saveNotes}
              savingNotes={savingNotes} activeNotesTab={activeNotesTab} setActiveNotesTab={setActiveNotesTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView kanjiDeck={kanjiDeck} vocabList={vocabList} />
          )}

          {currentTab === 'leaderboard' && (
            <LeaderboardView progressPercent={progressPercent} />
          )}

          {/* CHỈ CHO PHÉP HIỂN THỊ ADMIN VIEW KHI USER LÀ ADMIN */}
          {currentTab === 'admin' && userRole === 'admin' && (
            <AdminView 
              lessons={lessons} 
              kanjiDeck={kanjiDeck} 
              vocabList={vocabList} 
              refreshData={initAppData} 
            />
          )}
        </main>
      </div>

      <button 
        onClick={() => setIsQuizOpen(true)} 
        title="Làm bài kiểm tra ngẫu nhiên"
        className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-sky-400 to-emerald-400 text-[#0b1326] rounded-full shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 focus:outline-none"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </button>

      {/* MODAL BÀI KIỂM TRA */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* MODAL ĐĂNG NHẬP / ĐĂNG KÝ SUPABASE AUTH */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          fetchUserRole(loggedUser.id);
        }}
      />

    </div>
  );
}

export default App;