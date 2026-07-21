import React, { useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { X, Mail, Lock, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        // ĐĂNG KÝ TÀI KHOẢN MỚI
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        setSuccessMsg('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setIsSignUp(false);
      } else {
        // ĐĂNG NHẬP TÀI KHOẢN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setSuccessMsg('Đăng nhập thành công! 🎉');
        if (onAuthSuccess) onAuthSuccess(data.user);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#131b2e] border border-sky-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            {isSignUp ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            {isSignUp ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập N5 Hub'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignUp ? 'Nhập thông tin để bắt đầu lưu trữ tiến độ học' : 'Kết nối tài khoản Supabase Cloud của bạn'}
          </p>
        </div>

        {/* Thông báo Lỗi / Thành công */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Form Đăng nhập / Đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-mono">Email (*)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input 
                type="email" 
                required
                placeholder="nhan@fpt.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-mono">Mật khẩu (*)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-linear-to-r from-sky-500 to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-sky-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'ĐĂNG KÝ NGAY' : 'ĐĂNG NHẬP')}
          </button>
        </form>

        {/* Toggle Chuyển đổi Đăng nhập / Đăng ký */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
            className="text-sky-400 font-bold hover:underline ml-1"
          >
            {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AuthModal;