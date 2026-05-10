"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/router-compat';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import ShareButton from '../../components/ShareButton';
import { 
  ChevronRight, 
  Eye, 
  User, 
  Calendar, 
  FolderIcon,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import Markdown from 'react-markdown';
import { supabase } from '../../lib/supabase';
import { fallbackArticles } from '../../data/fallbackData';

interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  content: string;
  contentEn?: string;
  thumbnail?: string;
  category: string;
  author?: string;
  views?: number;
  likes?: number;
  createdAt: string;
}

export default function GuideDetail({ initialData, ssrContentRendered, ssrArticleContent }: { initialData?: any; ssrContentRendered?: boolean; ssrArticleContent?: string }) {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const langField = language === 'zh' ? '' : `_${language}`;
  
  // 获取翻译文本（兼容文章和城市数据，同时支持蛇形和驼峰命名）
  const getI18n = (item: any, baseField: string) => {
    if (!item) return '';
    
    // 城市数据使用 name/enName 格式
    if (baseField === 'name') {
      // 支持驼峰格式: nameKo, nameTw 等
      const camelField = `${baseField}${language.charAt(0).toUpperCase() + language.slice(1)}`;
      const snakeField = `${baseField}_${language}`;
      return language === 'zh' 
        ? (item.name || item.nameZh || item.enName || '')
        : (item[snakeField] || item[camelField] || item.enName || '');
    }
    
    // 中文：直接返回 baseField（如 title, subtitle, content）
    if (language === 'zh') {
      return item[baseField] || item.title || item.subtitle || item.content || '';
    }
    
    // 蛇形命名格式（如 title_ko, title_tw）和驼峰格式（如 titleKo, titleTw）
    const snakeFieldName = `${baseField}_${language}`;
    const camelFieldName = `${baseField}${language.charAt(0).toUpperCase() + language.slice(1)}`;
    
    return item[snakeFieldName] || item[camelFieldName] || item[`${baseField}En`] || item[`${baseField}_en`] || '';
  };

  // 获取数组字段的翻译版本
  const getI18nArray = (item: any, baseField: string) => {
    const translated = getI18n(item, baseField);
    return Array.isArray(translated) ? translated : [];
  };

  const [article, setArticle] = useState<Article | null>(() => {
    if (initialData) {
      return {
        _id: initialData.id,
        ...initialData,
        views: (initialData.views || 0) + 1,
        likes: initialData.likes || 0,
        createdAt: initialData.createdAt || new Date().toISOString()
      } as Article;
    }
    return null;
  });
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const [recommendedCities, setRecommendedCities] = useState<any[]>([]);
  const [prevArticle, setPrevArticle] = useState<Article | null>(null);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const langPrefix = language === 'zh' ? 'cn' : language;

  // 获取文章的多语言标题
  const displayTitle = article ? (getI18n(article, 'title') || article.titleEn || article.title || '') : '';
  const displaySubtitle = article ? (getI18n(article, 'subtitle') || article.subtitleEn || article.subtitle || '') : '';
  const displayContent = article ? (getI18n(article, 'content') || article.contentEn || article.content || '') : '';

  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [captcha, setCaptcha] = useState({ code: '', userAns: '' });
  const captchaCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [translatedComments, setTranslatedComments] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const COMMENTS_PER_PAGE = 10;

  const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const generateCaptcha = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
    }
    setCaptcha({ code, userAns: '' });
  };

  // 绘制图形验证码
  React.useEffect(() => {
    if (!captcha.code || !captchaCanvasRef.current) return;
    const canvas = captchaCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 120, H = 40;
    canvas.width = W;
    canvas.height = H;
    // 背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, W, H);
    // 干扰线
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 60%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.lineTo(Math.random() * W, Math.random() * H);
      ctx.stroke();
    }
    // 噪点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 60%)`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    // 绘制字符
    const colors = ['#1b887a', '#d97706', '#7c3aed', '#dc2626'];
    for (let i = 0; i < captcha.code.length; i++) {
      ctx.save();
      const x = 18 + i * 25;
      const y = 28 + Math.random() * 6 - 3;
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `bold ${22 + Math.random() * 4}px monospace`;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(captcha.code[i], 0, 0);
      ctx.restore();
    }
  }, [captcha.code]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .select('*')
        .eq('articleId', id)
        .order('createdAt', { ascending: true });
      if (!error && data) setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // 构建楼层结构：顶级评论 + 回复
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);
  const getFloorNumber = (commentId: string) => {
    const idx = topLevelComments.findIndex(c => c.id === commentId);
    return idx !== -1 ? idx + 1 : -1;
  };

  // 分页逻辑
  const totalCommentPages = Math.ceil(topLevelComments.length / COMMENTS_PER_PAGE);
  const paginatedComments = topLevelComments.slice(
    (commentPage - 1) * COMMENTS_PER_PAGE,
    commentPage * COMMENTS_PER_PAGE
  );
  const floorOffset = (commentPage - 1) * COMMENTS_PER_PAGE;

  // 翻译评论 - 翻译到当前选择的语言
  const handleTranslate = async (commentId: string, content: string) => {
    if (translatedComments[commentId]) {
      setTranslatedComments(prev => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
      return;
    }
    setTranslatingIds(prev => new Set(prev).add(commentId));
    try {
      const { askDeepSeek } = await import('../../lib/deepseek');
      const targetLangMap: Record<string, string> = {
        zh: 'Simplified Chinese', en: 'English', ja: 'Japanese', ko: 'Korean',
        ru: 'Russian', fr: 'French', es: 'Spanish', de: 'German', tw: 'Traditional Chinese', it: 'Italian'
      };
      const targetLang = targetLangMap[language] || 'Simplified Chinese';
      const translated = await askDeepSeek(
        `Translate the following text to ${targetLang}. If the text is already in ${targetLang}, just output the original text. Only output the translation, nothing else:\n\n${content}`
      );
      setTranslatedComments(prev => ({ ...prev, [commentId]: translated.trim() }));
    } catch (err) {
      console.error('Translation failed:', err);
      alert(t('comment.translateFail'));
    } finally {
      setTranslatingIds(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  // 切换语言时清除翻译缓存
  React.useEffect(() => {
    setTranslatedComments({});
  }, [language]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) return;

    // CAPTCHA check (case-insensitive)
    if (captcha.userAns.toUpperCase() !== captcha.code) {
      alert(t('comment.captchaWrong'));
      return;
    }

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('article_comments')
        .insert([{
          articleId: id,
          name: commentName,
          content: commentText,
          createdAt: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      setCommentText('');
      setCaptcha(prev => ({ ...prev, userAns: '' }));
      generateCaptcha();
      fetchComments();
      alert(t('comment.submitSuccess'));
    } catch (err: any) {
      alert(t('comment.submitFail') + ': ' + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyText.trim() || !replyName.trim() || !replyTo) return;

    setSubmittingReply(true);
    try {
      const { error } = await supabase
        .from('article_comments')
        .insert([{
          articleId: id,
          name: replyName,
          content: replyText,
          parentId: parentId,
          createdAt: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      setReplyText('');
      setReplyName('');
      setReplyTo(null);
      fetchComments();
    } catch (err: any) {
      alert(t('comment.submitFail') + ': ' + err.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, [id]);

  // 非阻塞加载次要数据（推荐文章、推荐城市、上下篇、浏览量递增）
  const loadSecondaryData = async () => {
    const results = await Promise.allSettled([
      supabase.from('cities').select('id, name, enName, listCover, heroImage, stats').limit(5),
      supabase.from('articles').select('*').neq('id', id).limit(10),
      supabase.from('articles').select('id, title, titleEn, thumbnail, createdAt').order('createdAt', { ascending: false }),
      initialData ? supabase.from('articles').update({ views: (initialData.views || 0) + 1 }).eq('id', id) : Promise.resolve({ error: null }),
    ]);

    // 推荐城市
    const citiesResult = results[0];
    if (citiesResult.status === 'fulfilled' && !citiesResult.value.error && citiesResult.value.data) {
      setRecommendedCities(citiesResult.value.data);
    }

    // 推荐文章
    const recResult = results[1];
    if (recResult.status === 'fulfilled' && !recResult.value.error && recResult.value.data) {
      const mapped = recResult.value.data.map((d: any) => ({
        _id: d.id, ...d, createdAt: d.createdAt || new Date().toISOString()
      })) as Article[];
      setRecommendedArticles(mapped.sort(() => 0.5 - Math.random()).slice(0, 3));
    }

    // 上下篇
    const allDocsResult = results[2];
    if (allDocsResult.status === 'fulfilled' && !allDocsResult.value.error && allDocsResult.value.data) {
      const currentIndex = allDocsResult.value.data.findIndex((a: any) => a.id === id);
      if (currentIndex !== -1) {
        const prev = allDocsResult.value.data[currentIndex - 1];
        const next = allDocsResult.value.data[currentIndex + 1];
        setPrevArticle(prev ? ({ _id: prev.id, ...prev } as any) : null);
        setNextArticle(next ? ({ _id: next.id, ...next } as any) : null);
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    // 有 initialData 时：主文章已就绪，直接非阻塞加载次要数据
    if (initialData) {
      loadSecondaryData();
      fetchComments();
      return;
    }

    // 无 initialData 时：客户端加载主文章
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        
        if (!error && data) {
          setArticle({
            _id: data.id,
            ...data,
            views: (data.views || 0) + 1,
            likes: data.likes || 0,
            createdAt: data.createdAt || new Date().toISOString()
          } as Article);
          setLoading(false);
          if (typeof window !== 'undefined') window.scrollTo(0, 0);

          // 非阻塞加载次要数据
          loadSecondaryData();
        } else {
          setError(error?.message || "Article Not Found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Database connection error");
        setLoading(false);
      }
    };
    fetchArticle();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!article || !id) return;
    
    // Optimistic UI update
    setArticle(prev => prev ? {...prev, likes: (prev.likes || 0) + 1} : null);
    
    try {
      const { data, error } = await supabase.from('articles').select('likes').eq('id', id).single();
      if (!error && data) {
        await supabase.from('articles').update({
          likes: (data.likes || 0) + 1
        }).eq('id', id);
      }
    } catch (e) {
      console.error('Failed to update likes', e);
    }
  };

  if (loading && !ssrContentRendered) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1b887a]"></div>
    </div>
  );

  if (error && !article && !ssrContentRendered) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!article && !ssrContentRendered) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
       <h1 className="text-2xl font-black text-gray-900 mb-4">{t('guide.articleNotFound')}</h1>
       <Link to={`/${langPrefix}/articles`} className="px-6 py-3 bg-[#1b887a] text-white rounded-lg font-bold">{t('guide.backToList')}</Link>
    </div>
  );

  // If SSR already rendered the header & content, only render interactive parts
  if (ssrContentRendered && article) {
    return (
      <>
        {/* Left content column */}
        <div className="flex-1 min-w-0">
          {/* SSR Article Content */}
          {ssrArticleContent && (
            <article className="markdown-body prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: ssrArticleContent }} />
            </article>
          )}

          {/* Useful Section */}
          <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center">
             <button 
                onClick={handleLike}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1b887a] group-hover:bg-[#1b887a]/5 transition-all text-gray-300 group-hover:text-[#1b887a]">
                  <ThumbsUp className={`w-6 h-6 ${article.likes && article.likes > 0 ? 'fill-[#1b887a] text-[#1b887a]' : ''}`} />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-[#1b887a] transition-colors">
                  {article.likes || 0} {t('guide.helpful')}
                </span>
             </button>
          </div>

        {/* Comments Section */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#1b887a]" />
            {t('comment.title')}
            <span className="text-sm font-normal text-gray-500 ml-2">({comments.length})</span>
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="bg-gray-50 p-6 rounded-xl mb-12">
            <h4 className="font-bold text-gray-800 mb-4">{t('comment.leaveComment')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                placeholder={t('comment.yourName')}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1b887a] outline-none"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
              />
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2">
                <canvas 
                  ref={captchaCanvasRef} 
                  className="rounded cursor-pointer h-10" 
                  title={t('comment.captchaRefresh') || 'Click to refresh'}
                  onClick={generateCaptcha}
                />
                <input 
                  type="text" 
                  placeholder={t('comment.captchaPlaceholder') || 'Code'}
                  className="w-full outline-none uppercase"
                  value={captcha.userAns}
                  onChange={(e) => setCaptcha(prev => ({ ...prev, userAns: e.target.value }))}
                  required
                  maxLength={4}
                />
              </div>
            </div>
            <textarea 
              rows={4}
              placeholder={t('comment.yourThoughts')}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1b887a] outline-none mb-4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
            <button 
              type="submit"
              disabled={submittingComment}
              className="bg-[#1b887a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#156d61] transition-colors disabled:opacity-50"
            >
              {submittingComment 
                ? t('comment.submitting')
                : t('comment.submit')}
            </button>
          </form>

          {/* Comments List - 楼层式 + 分页 */}
          <div className="space-y-0">
            {paginatedComments.map((comment, idx) => {
              const replies = getReplies(comment.id);
              const floor = floorOffset + idx + 1;
              const isTranslated = !!translatedComments[comment.id];
              const isTranslating = translatingIds.has(comment.id);
              return (
                <div key={comment.id} className="border-b border-gray-100 py-6">
                  {/* 主评论（楼层） */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1b887a] to-[#0d6b5e] flex-shrink-0 flex items-center justify-center text-white font-bold uppercase text-sm shadow-sm">
                      {comment.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900 text-sm">{comment.name}</span>
                        <span className="text-[11px] font-bold text-[#1b887a] bg-[#1b887a]/8 px-2 py-0.5 rounded-full">
                          {floor}F
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-1">{comment.content}</p>
                      {/* 翻译结果 */}
                      {isTranslated && (
                        <div className="mt-2 pl-3 border-l-2 border-blue-300 bg-blue-50/50 rounded-r-lg py-2 pr-3">
                          <p className="text-blue-700/80 text-sm leading-relaxed">{translatedComments[comment.id]}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <button 
                          onClick={() => handleTranslate(comment.id, comment.content)}
                          disabled={isTranslating}
                          className="text-xs text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                          {isTranslating 
                            ? t('comment.translating')
                            : isTranslated 
                              ? t('comment.hideTranslation')
                              : t('comment.translate')}
                        </button>
                        <button 
                          onClick={() => setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id, name: comment.name })}
                          className="text-xs text-gray-400 hover:text-[#1b887a] transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          {t('comment.reply')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 回复列表 */}
                  {replies.length > 0 && (
                    <div className="ml-14 mt-3 space-y-3 pl-4 border-l-2 border-[#1b887a]/10">
                      {replies.map(reply => {
                        const isReplyTranslated = !!translatedComments[reply.id];
                        const isReplyTranslating = translatingIds.has(reply.id);
                        return (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold uppercase text-xs">
                              {reply.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-800 text-xs">{reply.name}</span>
                                <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-500 text-sm leading-relaxed">{reply.content}</p>
                              {isReplyTranslated && (
                                <div className="mt-1.5 pl-2 border-l-2 border-blue-300 bg-blue-50/50 rounded-r-lg py-1.5 pr-2">
                                  <p className="text-blue-700/80 text-xs leading-relaxed">{translatedComments[reply.id]}</p>
                                </div>
                              )}
                              <button 
                                onClick={() => handleTranslate(reply.id, reply.content)}
                                disabled={isReplyTranslating}
                                className="text-[10px] text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 mt-1.5 disabled:opacity-50"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                                {isReplyTranslating 
                                  ? t('comment.translating')
                                  : isReplyTranslated 
                                    ? t('comment.hideTranslation')
                                    : t('comment.translate')}
                              </button>
                            </div>
                          </div>
                          );
                      })}
                    </div>
                  )}

                  {/* 回复输入框 */}
                  {replyTo?.id === comment.id && (
                    <div className="ml-14 mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 mb-3">
                        {t('comment.replyTo')} <span className="font-bold text-[#1b887a]">{replyTo.name}</span>
                      </p>
                      <div className="flex gap-3 mb-3">
                        <input 
                          type="text" 
                          placeholder={t('comment.yourName')}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1b887a] outline-none"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder={t('comment.writeReply')}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1b887a] outline-none"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && replyText.trim() && replyName.trim()) { e.preventDefault(); handleReply(comment.id); } }}
                        />
                        <button 
                          onClick={() => handleReply(comment.id)}
                          disabled={submittingReply || !replyText.trim() || !replyName.trim()}
                          className="bg-[#1b887a] text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#156d61] transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {submittingReply ? t('comment.submitting') : t('comment.reply')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {topLevelComments.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                {t('comment.noComments')}
              </p>
            )}
          </div>

          {/* 分页导航 */}
          {totalCommentPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCommentPage(p => Math.max(1, p - 1))}
                disabled={commentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t('comment.prevPage')}
              </button>
              {Array.from({ length: totalCommentPages }, (_, i) => i + 1)
                .filter(p => {
                  if (p === 1 || p === totalCommentPages) return true;
                  if (Math.abs(p - commentPage) <= 1) return true;
                  return false;
                })
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => 
                  typeof p === 'string' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCommentPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                        commentPage === p 
                          ? 'bg-[#1b887a] text-white shadow-md' 
                          : 'border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a]'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )
              }
              <button
                onClick={() => setCommentPage(p => Math.min(totalCommentPages, p + 1))}
                disabled={commentPage === totalCommentPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t('comment.nextPage')}
              </button>
            </div>
          )}
        </div>

        {/* Prev/Next Section */}
        {(prevArticle || nextArticle) && (
          <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link to={`/${langPrefix}/articles/${prevArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-left">
                {prevArticle.thumbnail && <img src={prevArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('article.prev')}</span>
                  <h4 className="font-bold text-gray-900 line-clamp-2">
                    {getI18n(prevArticle, 'title') || prevArticle.title || prevArticle.titleEn || ''}
                  </h4>
                </div>
              </Link>
            ) : <div />}
            {nextArticle ? (
              <Link to={`/${langPrefix}/articles/${nextArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-right justify-end">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('article.next')}</span>
                  <h4 className="font-bold text-gray-900 line-clamp-2">
                    {getI18n(nextArticle, 'title') || nextArticle.title || nextArticle.titleEn || ''}
                  </h4>
                </div>
                {nextArticle.thumbnail && <img src={nextArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
              </Link>
            ) : <div />}
          </div>
        )}

        </div>{/* End flex-1 left content column */}

        {/* Right Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 mt-12 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            {/* Recommendations Section */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                {t('guide.recommend')}
              </h3>
              <div className="space-y-6">
                {recommendedArticles.map((item, i) => (
                  <Link key={item._id} to={`/${langPrefix}/articles/${item._id}`} className="block group">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm border border-gray-100">
                      <img 
                        src={item.thumbnail || 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400'} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                        <h4 className="text-white font-bold text-sm leading-tight text-center w-full">
                          {getI18n(item, 'title') || item.title || item.titleEn || ''}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
                {recommendedArticles.length === 0 && (
                  <p className="text-sm text-gray-400">{t('guide.noArticles')}</p>
                )}
              </div>
            </section>

            {/* City Rankings */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">
                {t('guide.recommendCity')}
              </h3>
              <div className="space-y-4">
                {recommendedCities.map((city, i) => (
                  <Link key={city.id} to={`/${langPrefix}/cities/${city.id}`} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 grayscale-[0.5] group-hover:grayscale-0 transition-all border border-gray-100">
                        <img src={city.listCover || city.heroImage} alt={getI18n(city, 'name')} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 leading-none mb-1">{getI18n(city, 'name')}</h4>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{language === 'zh' ? city.enName : city.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-full">{city.stats?.recommended || 0} {t('city.stats.recommended')}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  // Full client-side render (fallback when SSR is not available)

  return (
    <div className="w-full bg-white">
      {/* Article Header Section */}
      <section className="bg-[#005043] pt-32 pb-16 text-white">
        <div className="max-w-[1240px] mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <nav className="flex items-center gap-2 text-white/60 text-[13px] overflow-x-auto whitespace-nowrap scrollbar-hide">
               <Link to={`/${langPrefix}`} className="hover:text-white transition-colors flex items-center gap-1">
                 <ChevronRight className="w-4 h-4" /> {t('nav.home')}
               </Link>
               <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
               <Link to={`/${langPrefix}/articles`} className="hover:text-white transition-colors">{t('discover.guides')}</Link>
               <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
               <span className="text-white/40 truncate">{displayTitle}</span>
            </nav>
            <ShareButton title={displayTitle} url={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mb-10 leading-[1.1] tracking-tight max-w-4xl"
          >
            {displayTitle}
          </motion.h1>

          <div className="flex flex-wrap gap-y-4 gap-x-8 items-center text-white/70 text-[13px] font-medium border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 opacity-50" />
              <span>{t('guide.author')}: <span className="text-white font-bold">{article.author || 'TripCNGO'}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-50" />
              <span>{t('guide.updated')}: {new Date(article.createdAt).toISOString().split('T')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderIcon className="w-4 h-4 opacity-50" />
              <span>{t('guide.inCategory')} {article.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 opacity-50" />
              <span>{article.views || 0} {t('guide.views')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1240px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
         <div className="flex-1 min-w-0">
            {/* Article Body */}
            <div className="markdown-body">
               <Markdown>{displayContent}</Markdown>
            </div>

            {/* Useful Section */}
            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center">
               <button 
                  onClick={handleLike}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1b887a] group-hover:bg-[#1b887a]/5 transition-all text-gray-300 group-hover:text-[#1b887a]">
                    <ThumbsUp className={`w-6 h-6 ${article.likes && article.likes > 0 ? 'fill-[#1b887a] text-[#1b887a]' : ''}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#1b887a] transition-colors">
                    {article.likes || 0} {t('guide.helpful')}
                  </span>
               </button>
            </div>

            {/* Comments Section */}
            <div className="mt-16 pt-12 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#1b887a]" />
                {t('comment.title')}
                <span className="text-sm font-normal text-gray-500 ml-2">({comments.length})</span>
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="bg-gray-50 p-6 rounded-xl mb-12">
                <h4 className="font-bold text-gray-800 mb-4">{t('comment.leaveComment')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder={t('comment.yourName')}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1b887a] outline-none"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                  />
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <canvas 
                      ref={captchaCanvasRef} 
                      className="rounded cursor-pointer h-10" 
                      title={t('comment.captchaRefresh') || 'Click to refresh'}
                      onClick={generateCaptcha}
                    />
                    <input 
                      type="text" 
                      placeholder={t('comment.captchaPlaceholder') || 'Code'}
                      className="w-full outline-none uppercase"
                      value={captcha.userAns}
                      onChange={(e) => setCaptcha(prev => ({ ...prev, userAns: e.target.value }))}
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
                <textarea 
                  rows={4}
                  placeholder={t('comment.yourThoughts')}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1b887a] outline-none mb-4"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
                <button 
                  type="submit"
                  disabled={submittingComment}
                  className="bg-[#1b887a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#156d61] transition-colors disabled:opacity-50"
                >
                  {submittingComment 
                    ? t('comment.submitting')
                    : t('comment.submit')}
                </button>
              </form>

              {/* Comments List - 楼层式 + 分页 */}
              <div className="space-y-0">
                {paginatedComments.map((comment, idx) => {
                  const replies = getReplies(comment.id);
                  const floor = floorOffset + idx + 1;
                  const isTranslated = !!translatedComments[comment.id];
                  const isTranslating = translatingIds.has(comment.id);
                  return (
                    <div key={comment.id} className="border-b border-gray-100 py-6">
                      {/* 主评论（楼层） */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1b887a] to-[#0d6b5e] flex-shrink-0 flex items-center justify-center text-white font-bold uppercase text-sm shadow-sm">
                          {comment.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-900 text-sm">{comment.name}</span>
                            <span className="text-[11px] font-bold text-[#1b887a] bg-[#1b887a]/8 px-2 py-0.5 rounded-full">
                              {floor}F
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-1">{comment.content}</p>
                          {/* 翻译结果 */}
                          {isTranslated && (
                            <div className="mt-2 pl-3 border-l-2 border-blue-300 bg-blue-50/50 rounded-r-lg py-2 pr-3">
                              <p className="text-blue-700/80 text-sm leading-relaxed">{translatedComments[comment.id]}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-3">
                            <button 
                              onClick={() => handleTranslate(comment.id, comment.content)}
                              disabled={isTranslating}
                              className="text-xs text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                              {isTranslating 
                                ? t('comment.translating')
                                : isTranslated 
                                  ? t('comment.hideTranslation')
                                  : t('comment.translate')}
                            </button>
                            <button 
                              onClick={() => setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id, name: comment.name })}
                              className="text-xs text-gray-400 hover:text-[#1b887a] transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              {t('comment.reply')}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 回复列表 */}
                      {replies.length > 0 && (
                        <div className="ml-14 mt-3 space-y-3 pl-4 border-l-2 border-[#1b887a]/10">
                          {replies.map(reply => {
                            const isReplyTranslated = !!translatedComments[reply.id];
                            const isReplyTranslating = translatingIds.has(reply.id);
                            return (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold uppercase text-xs">
                                  {reply.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-800 text-xs">{reply.name}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-gray-500 text-sm leading-relaxed">{reply.content}</p>
                                  {isReplyTranslated && (
                                    <div className="mt-1.5 pl-2 border-l-2 border-blue-300 bg-blue-50/50 rounded-r-lg py-1.5 pr-2">
                                      <p className="text-blue-700/80 text-xs leading-relaxed">{translatedComments[reply.id]}</p>
                                    </div>
                                  )}
                                  <button 
                                    onClick={() => handleTranslate(reply.id, reply.content)}
                                    disabled={isReplyTranslating}
                                    className="text-[10px] text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 mt-1.5 disabled:opacity-50"
                                  >
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                                    {isReplyTranslating 
                                      ? t('comment.translating')
                                      : isReplyTranslated 
                                        ? t('comment.hideTranslation')
                                        : t('comment.translate')}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 回复输入框 */}
                      {replyTo?.id === comment.id && (
                        <div className="ml-14 mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 mb-3">
                            {t('comment.replyTo')} <span className="font-bold text-[#1b887a]">{replyTo.name}</span>
                          </p>
                          <div className="flex gap-3 mb-3">
                            <input 
                              type="text" 
                              placeholder={t('comment.yourName')}
                              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1b887a] outline-none"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-3">
                            <input 
                              type="text" 
                              placeholder={t('comment.writeReply')}
                              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1b887a] outline-none"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && replyText.trim() && replyName.trim()) { e.preventDefault(); handleReply(comment.id); } }}
                            />
                            <button 
                              onClick={() => handleReply(comment.id)}
                              disabled={submittingReply || !replyText.trim() || !replyName.trim()}
                              className="bg-[#1b887a] text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#156d61] transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {submittingReply ? t('comment.submitting') : t('comment.reply')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {topLevelComments.length === 0 && (
                  <p className="text-center text-gray-400 py-8">
                    {t('comment.noComments')}
                  </p>
                )}
              </div>

              {/* 分页导航 */}
              {totalCommentPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCommentPage(p => Math.max(1, p - 1))}
                    disabled={commentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t('comment.prevPage')}
                  </button>
                  {Array.from({ length: totalCommentPages }, (_, i) => i + 1)
                    .filter(p => {
                      // 显示首页、末页、当前页附近
                      if (p === 1 || p === totalCommentPages) return true;
                      if (Math.abs(p - commentPage) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | string)[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => 
                      typeof p === 'string' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCommentPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                            commentPage === p 
                              ? 'bg-[#1b887a] text-white shadow-md' 
                              : 'border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a]'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )
                  }
                  <button
                    onClick={() => setCommentPage(p => Math.min(totalCommentPages, p + 1))}
                    disabled={commentPage === totalCommentPages}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t('comment.nextPage')}
                  </button>
                </div>
              )}
            </div>

            {/* Prev/Next Section */}
            {(prevArticle || nextArticle) && (
              <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link to={`/${langPrefix}/articles/${prevArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-left">
                    {prevArticle.thumbnail && <img src={prevArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('article.prev')}</span>
                      <h4 className="font-bold text-gray-900 line-clamp-2">
                        {getI18n(prevArticle, 'title') || prevArticle.title || prevArticle.titleEn || ''}
                      </h4>
                    </div>
                  </Link>
                ) : <div />}
                {nextArticle ? (
                  <Link to={`/${langPrefix}/articles/${nextArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-right justify-end">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('article.next')}</span>
                      <h4 className="font-bold text-gray-900 line-clamp-2">
                        {getI18n(nextArticle, 'title') || nextArticle.title || nextArticle.titleEn || ''}
                      </h4>
                    </div>
                    {nextArticle.thumbnail && <img src={nextArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                  </Link>
                ) : <div />}
              </div>
            )}

          </div>

         {/* Right Sidebar */}
         <div className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-12">
               {/* Recommendations Section */}
               <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                     {t('guide.recommend')}
                  </h3>
                  <div className="space-y-6">
                     {recommendedArticles.map((item, i) => (
                       <Link key={item._id} to={`/${langPrefix}/articles/${item._id}`} className="block group">
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm border border-gray-100">
                           <img 
                            src={item.thumbnail || 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400'} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                              <h4 className="text-white font-bold text-sm leading-tight text-center w-full">
                                 {getI18n(item, 'title') || item.title || item.titleEn || ''}
                              </h4>
                           </div>
                          </div>
                       </Link>
                     ))}
                     {recommendedArticles.length === 0 && (
                       <p className="text-sm text-gray-400">{t('guide.noArticles')}</p>
                     )}
                  </div>
               </section>

               {/* City Rankings */}
               <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">
                     {t('guide.recommendCity')}
                   </h3>
                   <div className="space-y-4">
                      {recommendedCities.map((city, i) => (
                        <Link key={city.id} to={`/${langPrefix}/cities/${city.id}`} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 grayscale-[0.5] group-hover:grayscale-0 transition-all border border-gray-100">
                                <img src={city.listCover || city.heroImage} alt={getI18n(city, 'name')} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-gray-700 leading-none mb-1">{getI18n(city, 'name')}</h4>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{language === 'zh' ? city.enName : city.name}</span>
                             </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-full">{city.stats?.recommended || 0} {t('city.stats.recommended')}</span>
                        </Link>
                      ))}
                   </div>
               </section>
            </div>
         </div>
      </section>
    </div>
  );
}
