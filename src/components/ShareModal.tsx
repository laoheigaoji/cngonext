import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Facebook, Linkedin, Link, Check, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : ''));
  const shareTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-black',
      shareLink: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      shareLink: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      shareLink: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url || (typeof window !== 'undefined' ? window.location.href : ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {t('share.modal.title', 'Share to')}
                </h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-12 h-12 ${platform.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:-translate-y-1`}>
                      <platform.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {platform.name === 'X (Twitter)' ? 'X' : platform.name}
                    </span>
                  </a>
                ))}
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    readOnly
                    value={url || (typeof window !== 'undefined' ? window.location.href : '')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-600 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#1b887a] hover:bg-[#1b887a]/10 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
