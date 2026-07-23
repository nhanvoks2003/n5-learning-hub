import React, { useState, useEffect } from 'react';
import { supabase } from './api/supabaseClient';
import { Plus } from 'lucide-react';

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
  const [userProgressMap, setUserProgressMap] = useState({}); // Map lưu status theo lesson_id
  const [userNotesMap, setUserNotesMap] = useState({});       // Map lưu notes theo lesson_id
  const [kanjiDeck, setKanjiDeck] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [activeNotesTab, setActiveNotesTab] = useState('teacher');
  
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    initAppData();
    checkUserSession();
  }, []);

  // Lắng nghe phiên đăng nhập & tải dữ liệu cá nhân
  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchUserRole(session.user.id);
      fetchUserData(session.user.id);
    } else {
      setUser(null);
      setUserRole('student');
      setUserProgressMap({});
      setUserNotesMap({});
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.id);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setUserRole('student');
        setUserProgressMap({});
        setUserNotesMap({});
      }
    });
  };

  const fetchUserRole = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
      setUserRole(data?.role || 'student');
    } catch {
      setUserRole('student');
    }
  };

  // Tải tiến độ & ghi chú riêng của User đang đăng nhập
  const fetchUserData = async (userId) => {
    try {
      const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', userId);
      const progressMap = {};
      progressData?.forEach(p => { progressMap[p.lesson_id] = p.status; });
      setUserProgressMap(progressMap);

      const { data: notesData } = await supabase.from('user_notes').select('*').eq('user_id', userId);
      const notesMap = {};
      notesData?.forEach(n => { notesMap[n.lesson_id] = n.note_text; });
      setUserNotesMap(notesMap);
    } catch (err) {
      console.error('Lỗi tải dữ liệu cá nhân:', err.message);
    }
  };

  const initAppData = async () => {
    try {
      setLoading(true);
      const { data: lessonsData } = await supabase.from('lessons').select('*').order('id', { ascending: true });
      setLessons(lessonsData || []);
      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
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

  // Toggle trạng thái bài học cá nhân
  const toggleStatus = async (lesson) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const currentStatus = !!userProgressMap[lesson.id];
    const newStatus = !currentStatus;

    try {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        status: newStatus
      }, { onConflict: 'user_id,lesson_id' });

      setUserProgressMap(prev => ({ ...prev, [lesson.id]: newStatus }));
    } catch (error) {
      alert('Lỗi cập nhật tiến độ: ' + error.message);
    }
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setNotes(userNotesMap[lesson.id] || '');
    setCurrentTab('lessons');
  };

  // Lưu ghi chú cá nhân
  const saveNotes = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (!selectedLesson) return;

    setSavingNotes(true);
    try {
      await supabase.from('user_notes').upsert({
        user_id: user.id,
        lesson_id: selectedLesson.id,
        note_text: notes
      }, { onConflict: 'user_id,lesson_id' });

      setUserNotesMap(prev => ({ ...prev, [selectedLesson.id]: notes }));
      alert('Đã lưu ghi chú cá nhân thành công 🎉');
    } catch (error) {
      alert('Lỗi khi lưu ghi chú: ' + error.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole('student');
    if (currentTab === 'admin') setCurrentTab('dashboard');
    alert('Đã đăng xuất tài khoản.');
  };

  // Tính % tiến độ hoàn thành bài học của riêng User
  const completedCount = Object.values(userProgressMap).filter(Boolean).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Chuẩn hóa bài học ghép tiến độ cá nhân để truyền xuống LessonsView
  const lessonsWithPersonalData = lessons.map(l => ({
    ...l,
    status: !!userProgressMap[l.id]
  }));

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
        userRole={userRole}
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
              lessons={lessonsWithPersonalData} 
              selectedLesson={selectedLesson ? { ...selectedLesson, status: !!userProgressMap[selectedLesson.id] } : null} 
              handleSelectLesson={handleSelectLesson}
              toggleStatus={toggleStatus} 
              notes={notes} 
              setNotes={setNotes} 
              saveNotes={saveNotes}
              savingNotes={savingNotes} 
              activeNotesTab={activeNotesTab} 
              setActiveNotesTab={setActiveNotesTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView kanjiDeck={kanjiDeck} vocabList={vocabList} />
          )}

          {currentTab === 'leaderboard' && (
            <LeaderboardView progressPercent={progressPercent} />
          )}

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

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} user={user} />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={(loggedUser) => setUser(loggedUser)}
      />

    </div>
  );
}

export default App;