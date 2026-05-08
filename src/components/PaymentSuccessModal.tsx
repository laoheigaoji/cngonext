import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldAlert, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 mx-4"
          >
            {/* Success Header */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-[#1b887a] to-[#25ad9b] flex items-center justify-center overflow-hidden">
              {/* Decorative elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]"
              />
              <div className="absolute top-0 right-0 p-3">
                 <button onClick={onClose} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
                   <X className="w-4 h-4" />
                 </button>
              </div>
              
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="bg-white p-4 sm:p-5 rounded-full shadow-xl"
                >
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#1b887a]" />
                </motion.div>
                
                {/* Sparkles */}
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-3 -right-3 text-white"
                >
                  <Sparkles className="w-5 h-5 fill-current" />
                </motion.div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8">
              <div className="text-center mb-5">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {t('pay.success.title', '🎉 支付成功！')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  {t('pay.success.subtitle', '内容已解锁，感谢您的支持！')}
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="flex gap-2 mb-2 text-[#1b887a]">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">{t('pay.success.important', '重要提示')}</span>
                </div>
                <ul className="space-y-2 text-[11px] sm:text-sm text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#1b887a] font-bold">•</span>
                    <span>{t('pay.success.item1', '您的购买记录已保存在此设备浏览器的本地缓存中（LocalStorage）。')}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#1b887a] font-bold">•</span>
                    <span>{t('pay.success.item2', '请勿清除浏览器缓存，否则将失去访问权限。')}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#1b887a] font-bold">•</span>
                    <span>{t('pay.success.item3', '当前模式暂不支持跨设备/浏览器同步。')}</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-[#1b887a] hover:bg-[#156e62] text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-[#1b887a]/20 text-sm sm:text-base"
              >
                {t('pay.success.button', '开始浏览')}
              </motion.button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
