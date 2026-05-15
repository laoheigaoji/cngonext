"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface EmailLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailLoginModal({ isOpen, onClose }: EmailLoginModalProps) {
  const { t, language } = useLanguage();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<'success' | 'noPlan' | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError('');
    setResult(null);

    const res = await signInWithEmail(email.trim());
    setSending(false);

    if (res.success) {
      setResult(res.hasPlan ? 'success' : 'noPlan');
    } else {
      setError(res.error || (language === 'zh' ? '登录失败' : 'Login failed'));
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail('');
      setResult(null);
      setError('');
      setSending(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#1b887a] to-[#14786c] px-6 pt-8 pb-6 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">
                    {language === 'zh' ? '邮箱登录' : 'Email Login'}
                  </h2>
                </div>
                <p className="text-teal-100 text-sm leading-relaxed">
                  {language === 'zh' 
                    ? '输入您支付时使用的邮箱，有套餐即可直接登录' 
                    : 'Enter the email you used for payment. Login directly if you have an active plan.'}
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                {!result ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {language === 'zh' ? '邮箱地址' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={language === 'zh' ? '请输入邮箱' : 'Enter your email'}
                        required
                        autoFocus
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b887a]/20 focus:border-[#1b887a] outline-none transition-all text-gray-800 placeholder:text-gray-400"
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sending || !email.trim()}
                      className="w-full py-3 bg-[#1b887a] text-white rounded-xl font-medium hover:bg-[#14786c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          {language === 'zh' ? '登录中...' : 'Logging in...'}
                        </>
                      ) : (
                        <>
                          {language === 'zh' ? '直接登录' : 'Login'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : result === 'success' ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {language === 'zh' ? '登录成功！' : 'Login Successful!'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {language === 'zh' ? '欢迎使用，页面即将刷新' : 'Welcome! Page will refresh shortly.'}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-6 px-6 py-2.5 bg-[#1b887a] text-white rounded-xl font-medium hover:bg-[#14786c] transition-colors"
                    >
                      {language === 'zh' ? '确定' : 'OK'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {language === 'zh' ? '登录成功' : 'Logged In'}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {language === 'zh' 
                        ? '您还没有活跃的套餐，使用付费功能时将提示购买。' 
                        : 'No active plan yet. You can browse freely and purchase when needed.'}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-6 px-6 py-2.5 bg-[#1b887a] text-white rounded-xl font-medium hover:bg-[#14786c] transition-colors"
                    >
                      {language === 'zh' ? '知道了' : 'Got it'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
