"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Volume2, Copy, RotateCcw, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HanziWriter from 'hanzi-writer';

interface CharDetailModalProps {
    char: string;
    pinyin: string;
    definition?: string;
    tone?: number;
    onClose: () => void;
    onSpeak: (text: string, lang?: string) => void;
    t: (key: string) => string;
}

const CharDetailModal: React.FC<CharDetailModalProps> = ({ char, pinyin, definition, tone, onClose, onSpeak, t }) => {
    const writerRef = useRef<HTMLDivElement>(null);
    const writerInstanceRef = useRef<any>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [copied, setCopied] = useState(false);
    const [strokeCount, setStrokeCount] = useState<number | null>(null);
    const [loadError, setLoadError] = useState(false);

    // Initialize HanziWriter
    useEffect(() => {
        if (!writerRef.current) return;

        // Clear previous
        writerRef.current.innerHTML = '';
        writerInstanceRef.current = null;
        setIsAnimating(false);
        setIsPaused(false);
        setLoadError(false);
        setStrokeCount(null);

        const writer = HanziWriter.create(writerRef.current, char, {
            width: 200,
            height: 200,
            padding: 15,
            showOutline: true,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 300,
            strokeColor: '#1b887a',
            outlineColor: '#e0e0e0',
            drawingColor: '#1b887a',
            radicalColor: '#16816c',
            highlightColor: '#a3e4db',
            showCharacter: false,
            highlightOnComplete: true,
            charDataLoader: (charToLoad: string, onComplete: (data: any) => void, onError: (err?: any) => void) => {
                fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${charToLoad}.json`)
                    .then(res => {
                        if (!res.ok) throw new Error('Not found');
                        return res.json();
                    })
                    .then(data => {
                        setStrokeCount(data?.strokes?.length || null);
                        onComplete(data);
                    })
                    .catch((err) => {
                        setLoadError(true);
                        onError(err);
                    });
            },
        });

        writerInstanceRef.current = writer;

        // Auto animate on open
        const timer = setTimeout(() => {
            writer.animateCharacter({
                onComplete: () => setIsAnimating(false),
            });
            setIsAnimating(true);
        }, 400);

        return () => {
            clearTimeout(timer);
            if (writerRef.current) {
                writerRef.current.innerHTML = '';
            }
            writerInstanceRef.current = null;
        };
    }, [char]);

    const handleReplay = useCallback(() => {
        if (!writerInstanceRef.current || loadError) return;
        setIsAnimating(true);
        setIsPaused(false);
        writerInstanceRef.current.hideCharacter();
        writerInstanceRef.current.animateCharacter({
            onComplete: () => setIsAnimating(false),
        });
    }, [loadError]);

    const handleTogglePause = useCallback(() => {
        if (!writerInstanceRef.current || loadError) return;
        if (isPaused) {
            setIsPaused(false);
            writerInstanceRef.current.hideCharacter();
            writerInstanceRef.current.animateCharacter({
                onComplete: () => setIsAnimating(false),
            });
        } else {
            setIsPaused(true);
            setIsAnimating(false);
        }
    }, [isPaused, loadError]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(char);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    }, [char]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                        <h3 className="text-base font-bold text-gray-900">{t('tools.pinyin.charModal.title')}</h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Stroke Order Animation Area */}
                    <div className="flex justify-center py-4">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 relative">
                            <div ref={writerRef} className="mx-auto" style={{ width: 200, height: 200 }} />
                            {loadError && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl text-[#1b887a] font-serif">{char}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Animation Controls */}
                    <div className="flex justify-center gap-3 pb-3">
                        <button
                            onClick={handleReplay}
                            disabled={loadError}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#1b887a] text-white rounded-lg text-sm font-medium hover:bg-[#167a6a] transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {t('tools.pinyin.charModal.replay')}
                        </button>
                        <button
                            onClick={handleTogglePause}
                            disabled={loadError}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isPaused || !isAnimating ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                            {isPaused || !isAnimating ? t('tools.pinyin.charModal.play') : t('tools.pinyin.charModal.pause')}
                        </button>
                    </div>

                    {/* Pinyin + Actions */}
                    <div className="px-5 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-gray-900">{char}</span>
                                <span className="text-xl text-[#1b887a] font-semibold">{pinyin}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onSpeak(char, 'zh-CN')}
                                    className="w-9 h-9 bg-[#1b887a] rounded-full flex items-center justify-center hover:bg-[#167a6a] transition"
                                    title={t('tools.pinyin.charModal.playPronunciation')}
                                >
                                    <Volume2 className="w-4 h-4 text-white" />
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition relative"
                                    title={t('tools.pinyin.charModal.copyChar')}
                                >
                                    <Copy className="w-4 h-4 text-gray-600" />
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                                            {t('tools.pinyin.charModal.copied')}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Definition */}
                    {definition && (
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                            <div className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wide">{t('tools.pinyin.charModal.definition')}</div>
                            <div className="text-gray-700 font-medium">{definition}</div>
                        </div>
                    )}

                    {/* Tone, Character & Strokes Info */}
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-6">
                        {tone ? (
                            <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{t('tools.pinyin.charModal.tone')}</div>
                                <div className="text-lg font-bold text-gray-900">{tone}</div>
                            </div>
                        ) : null}
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{t('tools.pinyin.charModal.character')}</div>
                            <div className="text-lg font-bold text-gray-900">{char}</div>
                        </div>
                        {strokeCount !== null && (
                            <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{t('tools.pinyin.charModal.strokes')}</div>
                                <div className="text-lg font-bold text-gray-900">{strokeCount}</div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CharDetailModal;
