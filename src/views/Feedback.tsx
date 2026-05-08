"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Feedback() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'feedbacks'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      <div className="w-full bg-[#f7f7f7]">
        {/* Hero Header */}
        <section className="relative h-[480px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://static.tripcngo.com/ing/banner_bg_1.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            {t('feedback.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-medium"
          >
            {t('feedback.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
          {/* Left: Form */}
          <div className="flex-1 p-8 md:p-16">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="name">
                  {t('feedback.name')}：
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder={t('feedback.name.placeholder')}
                  className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-md focus:border-[#1b887a] outline-none transition-all shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="email">
                  {t('feedback.email')}：
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder={t('feedback.email.placeholder')}
                  className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-md focus:border-[#1b887a] outline-none transition-all shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="message">
                  {t('feedback.message')}：
                </label>
                <textarea
                  id="message"
                  required
                  rows={8}
                  placeholder={t('feedback.message.placeholder')}
                  className="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-md focus:border-[#1b887a] outline-none transition-all resize-none shadow-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`px-10 py-3 bg-[#1b887a] text-white font-bold rounded-lg hover:bg-[#166d63] transition-all transform active:scale-95 shadow-lg ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' ? '...' : t('feedback.submit')}
                </button>
              </div>

              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium"
                >
                  {t('feedback.success')}
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 font-medium"
                >
                  Failed to send feedback.
                </motion.div>
              )}
            </form>
          </div>

          {/* Right: Image */}
          <div className="hidden lg:block lg:w-[45%] relative">
            <img 
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1000" 
              alt="Contact info" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-white/95 backdrop-blur-md px-12 py-10 rounded-lg shadow-2xl border border-white/40 transform -rotate-2">
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Contact Us</h2>
                  <div className="mt-4 w-20 h-1.5 bg-[#1b887a] rounded-full mx-auto"></div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
