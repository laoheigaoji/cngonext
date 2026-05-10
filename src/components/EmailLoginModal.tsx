"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface EmailLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailLoginModal({ isOpen, onClose }: EmailLoginModalProps) {
  const { language } = useLanguage();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const isZh = language === 'zh' || language === 'cn';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError('');

    const result = await signInWithEmail(email.trim());
    setSending(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || (isZh ? '发送失败，请重试' : 'Failed to send, please retry'));
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setEmail('');
      setSent(false);
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
                    {isZh ? '登录' : 'Sign in'}
                  </h2>
                </div>
                <p className="text-teal-100 text-sm leading-relaxed">
                  {isZh
                    ? '输入您的邮箱地址，我们将发送一个登录链接到您的邮箱，点击即可登录。'
                    : 'Enter your email address and we\'ll send you a login link. Click it to sign in instantly.'}
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                {!sent ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {isZh ? '邮箱地址' : 'Email address'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={isZh ? '请输入邮箱地址' : 'you@example.com'}
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
                          {isZh ? '发送中...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          {isZh ? '发送登录链接' : 'Send login link'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-400">
                          {isZh ? '或' : 'or'}
                        </span>
                      </div>
                    </div>

                    {/* Google login button */}
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {isZh ? '使用 Google 登录' : 'Sign in with Google'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {isZh ? '邮件已发送！' : 'Email sent!'}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {isZh
                        ? `我们已将登录链接发送到 ${email}，请查看您的收件箱（包括垃圾邮件文件夹），点击链接即可登录。`
                        : `We've sent a login link to ${email}. Check your inbox (and spam folder), click the link to sign in.`}
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      {isZh ? '我知道了' : 'Got it'}
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
