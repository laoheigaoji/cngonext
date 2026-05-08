import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ShareModal from './ShareModal';

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
  className?: string;
}

export default function ShareButton({ title, url, text, className }: ShareButtonProps) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className={className || "flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-all border border-white/20"}
      >
        <Share2 className="w-4 h-4" />
        {t('share.button', 'Share')}
      </button>

      <ShareModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        url={url || (typeof window !== 'undefined' ? window.location.href : '')}
      />
    </>
  );
}
