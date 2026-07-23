import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { X, Brain, Trophy, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { speakJapanese } from '../utils/speech';

function QuizModal({ isOpen, onClose, user }) {
  const [step, setSetep] = useState('setup'); // 'setup', 'quiz', 'result'
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [questionLimit, setQuestionLimit] = useState(5);
  
  const [currentQuizList, setCurrentQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 'result' && user && score > 0) {
      addEarnedXpToUser(score * 20);
    }
  }, [step]);

  const addEarnedXpToUser = async (gainedXp) => {
    try {
      const { data } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
      const currentXp = data?.xp || 0;
      await supabase.from('profiles').update({ xp: currentXp + gainedXp }).eq('id', user.id);
    } catch (err) {
      console.error('Lỗi cộng XP:', err.message);
    }
  };

  // Thuật toán tráo ngẫu nhiên (Fisher-Yates Shuffle)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Kích hoạt sinh đề ngẫu nhiên theo gói người dùng chọn
  const handleStartQuiz = () => {
    let filtered = [...questions];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    if (selectedSection !== 'all') {
      filtered = filtered.filter(q => q.section === selectedSection);
    }

    if (filtered.length === 0) {
      alert('Không tìm thấy câu hỏi phù hợp với gói lựa chọn này. Vui lòng chọn gói khác!');
      return;
    }

    // Trộn ngẫu nhiên câu hỏi & tráo cả thứ tự đáp án bên trong
    const randomQuestions = shuffleArray(filtered).slice(0, questionLimit).map(q => {
      const optionsObj = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const correctAnswerText = optionsObj[q.correct_index];
      const shuffledOptions = shuffleArray(optionsObj);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

      return {
        ...q,
        options: shuffledOptions,
        correct_index: newCorrectIndex
      };
    });

    setCurrentQuizList(randomQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSetep('quiz');
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQuestion = currentQuizList[currentIndex];
    if (index === currentQuestion.correct_index) {
      setScore(prev => prev + 1);
    }

    // Tự động phát âm nếu câu hỏi chứa tiếng Nhật
    if (currentQuestion.question) {
      speakJapanese(currentQuestion.question);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < currentQuizList.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setSetep('result');
    }
  };

  if (!isOpen) return null;

  // Lọc danh sách Section khả dụng dựa theo Category đang chọn
  const availableSections = Array.from(
    new Set(
      questions
        .filter(q => selectedCategory === 'all' || q.category === selectedCategory)
        .map(q => q.section)
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#131b2e] border border-sky-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden">
        
        {/* Nút đóng Modal */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* ---------------- SCREEN 1: THIẾT LẬP GÓI CÂU HỎI ---------------- */}
        {step === 'setup' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">Cấu Hình Đề Luyện Tập</h2>
                <p className="text-xs text-slate-400">Tùy chỉnh gói câu hỏi ngẫu nhiên theo mục tiêu học</p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Đang tải bộ dữ liệu câu hỏi...</div>
            ) : (
              <div className="space-y-5">
                
                {/* 1. Chọn Học Phần / Category */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 mb-2">1. Chọn Học Phần</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'all', label: '⚡ Tất cả học phần' },
                      { id: 'kanji', label: '🈁 Kanji Mastery' },
                      { id: 'vocabulary', label: '📖 Từ vựng N5' },
                      { id: 'grammar', label: '🧩 Ngữ pháp Minna' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedCategory(item.id); setSelectedSection('all'); }}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${selectedCategory === item.id ? 'bg-sky-500/10 border-sky-400 text-sky-400' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Chọn Gói Phần Học Chi Tiết */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 mb-2">2. Chọn Gói Phần Học</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  >
                    <option value="all">-- Ngẫu nhiên tất cả các phần --</option>
                    {availableSections.map((sec, idx) => (
                      <option key={idx} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Số lượng câu hỏi */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 mb-2">3. Số Lượng Câu Hỏi</label>
                  <div className="flex gap-3">
                    {[5, 10, 15].map(num => (
                      <button
                        key={num}
                        onClick={() => setQuestionLimit(num)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${questionLimit === num ? 'bg-[#4edea3]/10 border-[#4edea3] text-[#4edea3]' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5'}`}
                      >
                        {num} CÂU
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full mt-4 py-3.5 bg-linear-to-r from-sky-500 to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-sky-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" /> Bắt Đầu Luyện Tập Ngẫu Nhiên
                </button>

              </div>
            )}
          </div>
        )}

        {/* ---------------- SCREEN 2: MÀN HÌNH LÀM BÀI TRẮC NGHIỆM ---------------- */}
        {step === 'quiz' && currentQuizList.length > 0 && (
          <div className="space-y-6">
            
            {/* Header Tiến Trình */}
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-sky-400 font-bold uppercase tracking-wider">
                CÂU {currentIndex + 1} / {currentQuizList.length}
              </span>
              <span className="text-slate-500 font-bold">
                {currentQuizList[currentIndex].section}
              </span>
            </div>

            {/* Thanh Progress bar */}
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-sky-400 transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
                style={{ width: `${((currentIndex + 1) / currentQuizList.length) * 100}%` }}
              ></div>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="py-2">
              <h3 className="text-lg font-bold text-white leading-relaxed">
                {currentQuizList[currentIndex].question}
              </h3>
            </div>

            {/* Danh sách 4 đáp án */}
            <div className="space-y-3">
              {currentQuizList[currentIndex].options.map((opt, idx) => {
                let btnStyle = "bg-slate-900/50 border-white/10 text-slate-300 hover:bg-white/5";
                
                if (isAnswered) {
                  if (idx === currentQuizList[currentIndex].correct_index) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow-[0_0_15px_rgba(78,222,163,0.2)]";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-red-500/20 border-red-500 text-red-400 font-bold";
                  } else {
                    btnStyle = "bg-slate-900/20 border-white/5 text-slate-600 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border text-xs text-left transition-all flex items-center justify-between font-medium ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQuizList[currentIndex].correct_index && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQuizList[currentIndex].correct_index && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Khung giải thích chi tiết */}
            {isAnswered && (
              <div className="p-4 bg-white/5 border border-sky-500/20 rounded-xl space-y-3 animate-fade-in">
                <p className="text-xs text-slate-300 leading-relaxed">
                  💡 <span className="text-sky-400 font-bold">Giải thích:</span> {currentQuizList[currentIndex].explanation || 'Chính xác!'}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  Câu Tiếp Theo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ---------------- SCREEN 3: MÀN HÌNH TỔNG KẾT KẾT QUẢ ---------------- */}
        {step === 'result' && (
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Hoàn Thành Bài Kiểm Tra!</h2>
              <p className="text-xs text-slate-400 mt-1">Hệ thống đã ghi nhận điểm thưởng của bạn</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl">
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold">ĐIỂM SỐ</span>
                <span className="text-2xl font-black text-sky-400">{score} / {currentQuizList.length}</span>
              </div>
              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl">
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold">THƯỞNG XP</span>
                <span className="text-2xl font-black text-[#4edea3]">+{score * 20} XP</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSetep('setup')}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Luyện Bài Khác
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-sky-500 hover:bg-sky-400 text-[#0b1326] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default QuizModal;