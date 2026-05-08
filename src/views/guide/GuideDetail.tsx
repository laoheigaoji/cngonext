"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/router-compat';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';
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

export default function GuideDetail({ initialData }: { initialData?: any }) {
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
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, userAns: '' });

  const generateCaptcha = () => {
    setCaptcha({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1,
      userAns: ''
    });
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .select('*')
        .eq('articleId', id)
        .order('createdAt', { ascending: false });
      if (!error && data) setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) return;

    // CAPTCHA check
    if (parseInt(captcha.userAns) !== (captcha.a + captcha.b)) {
      alert(language === 'zh' ? '算术题答案错误，请重试' : 'Wrong answer for the math quiz, please try again.');
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
      alert(language === 'zh' ? '评论提交成功！' : 'Comment submitted successfully!');
    } catch (err: any) {
      alert(language === 'zh' ? '提交失败' : 'Failed to submit comment: ' + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, [id]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) return;

        // If we have initialData from SSR, skip the main article fetch
        if (initialData) {
          setLoading(false);
          // Still fetch secondary data (recommendations, prev/next, comments)
          Promise.all([
            (async () => {
              try {
                const { data: citiesData, error: citiesError } = await supabase
                  .from('cities')
                  .select('id, name, enName, listCover, heroImage, stats')
                  .limit(5);
                if (!citiesError && citiesData) {
                  setRecommendedCities(citiesData);
                }
              } catch (e) {
                console.error('Failed to fetch cities for recommendation', e);
              }
            })(),
            (async () => {
              try {
                const { data: recData, error: recError } = await supabase
                  .from('articles')
                  .select('*')
                  .neq('id', id)
                  .limit(10);
                if (!recError && recData) {
                  const mapped = recData.map(d => ({
                    _id: d.id,
                    ...d,
                    createdAt: d.createdAt || new Date().toISOString()
                  })) as Article[];
                  setRecommendedArticles(mapped.sort(() => 0.5 - Math.random()).slice(0, 3));
                }
                const { data: allDocs, error: allDocsError } = await supabase
                  .from('articles')
                  .select('id, title, titleEn, thumbnail, createdAt')
                  .order('createdAt', { ascending: false });
                if (!allDocsError && allDocs) {
                  const currentIndex = allDocs.findIndex(a => a.id === id);
                  if (currentIndex !== -1) {
                    const prev = allDocs[currentIndex - 1];
                    const next = allDocs[currentIndex + 1];
                    setPrevArticle(prev ? ({ _id: prev.id, ...prev } as any) : null);
                    setNextArticle(next ? ({ _id: next.id, ...next } as any) : null);
                  }
                }
              } catch (e) {
                console.error('Failed to fetch other articles', e);
              }
            })(),
          ]);
          return;
        }

        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        
        if (!error && data) {
          const loadedArticle = {
            _id: data.id,
            ...data,
            views: (data.views || 0) + 1,
            likes: data.likes || 0,
            createdAt: data.createdAt || new Date().toISOString()
          } as Article;

          setArticle(loadedArticle);
          setLoading(false);
          if (typeof window !== 'undefined') window.scrollTo(0, 0);

          // Non-blocking secondary fetches
          Promise.all([
            // Fetch Recommended Cities
            (async () => {
              try {
                const { data: citiesData, error: citiesError } = await supabase
                  .from('cities')
                  .select('id, name, enName, listCover, heroImage, stats')
                  .limit(5);
                if (!citiesError && citiesData) {
                  setRecommendedCities(citiesData);
                }
              } catch (e) {
                console.error('Failed to fetch cities for recommendation', e);
              }
            })(),

            // Fetch Prev/Next and Recommended Articles
            (async () => {
              try {
                // Fetch recommended (excluding current)
                const { data: recData, error: recError } = await supabase
                  .from('articles')
                  .select('*')
                  .neq('id', id)
                  .limit(10);
                
                if (!recError && recData) {
                  const mapped = recData.map(d => ({
                    _id: d.id,
                    ...d,
                    createdAt: d.createdAt || new Date().toISOString()
                  })) as Article[];
                  setRecommendedArticles(mapped.sort(() => 0.5 - Math.random()).slice(0, 3));
                }

                // Fetch all to find prev/next (this could be optimized further with indexed queries)
                const { data: allDocs, error: allDocsError } = await supabase
                  .from('articles')
                  .select('id, title, titleEn, thumbnail, createdAt')
                  .order('createdAt', { ascending: false });

                if (!allDocsError && allDocs) {
                  const currentIndex = allDocs.findIndex(a => a.id === id);
                  if (currentIndex !== -1) {
                    const prev = allDocs[currentIndex - 1];
                    const next = allDocs[currentIndex + 1];
                    setPrevArticle(prev ? ({ _id: prev.id, ...prev } as any) : null);
                    setNextArticle(next ? ({ _id: next.id, ...next } as any) : null);
                  }
                }
              } catch (e) {
                console.error('Failed to fetch other articles', e);
              }
            })(),

            // Increment Views
            (async () => {
              try {
                await supabase.from('articles').update({
                  views: (data.views || 0) + 1
                }).eq('id', id);
              } catch (e) {
                console.error('Failed to increment views', e);
              }
            })()
          ]);
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
    if (id) {
      fetchArticle();
      fetchComments();
    }
  }, [id]); // 只在 id 变化时重新获取

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1b887a]"></div>
    </div>
  );

  if (error && !article) return (
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

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
       <h1 className="text-2xl font-black text-gray-900 mb-4">{t('guide.articleNotFound')}</h1>
       <Link to={`/${langPrefix}/articles`} className="px-6 py-3 bg-[#1b887a] text-white rounded-lg font-bold">{t('guide.backToList')}</Link>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <SEO 
        title={displayTitle}
        description={displaySubtitle}
        keywords={`${article.category}, ${language === 'zh' ? '中国旅行攻略' : 'China travel tips'}, ${article.author ? article.author : ''}`}
        type="article"
        image={article.thumbnail}
        url={`https://tripcngo.com/${language === 'zh' ? 'cn' : 'en'}/articles/${id}`}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": displayTitle,
          "description": displaySubtitle,
          "image": article.thumbnail,
          "author": {
            "@type": "Person",
            "name": article.author || "tripcngo Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "tripcngo",
            "logo": {
              "@type": "ImageObject",
              "url": "https://tripcngo.com/logo.png"
            }
          },
          "datePublished": article.createdAt,
          "dateModified": article.createdAt
        }}
      />
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
                {language === 'zh' ? '社区互动' : 'Community Discussion'}
                <span className="text-sm font-normal text-gray-500 ml-2">({comments.length})</span>
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="bg-gray-50 p-6 rounded-xl mb-12">
                <h4 className="font-bold text-gray-800 mb-4">{language === 'zh' ? '发表评论' : 'Leave a Comment'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder={language === 'zh' ? '您的昵称' : 'Your Name'}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1b887a] outline-none"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                  />
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <span className="text-gray-500 font-bold whitespace-nowrap">{captcha.a} + {captcha.b} = </span>
                    <input 
                      type="number" 
                      placeholder="?"
                      className="w-full outline-none"
                      value={captcha.userAns}
                      onChange={(e) => setCaptcha(prev => ({ ...prev, userAns: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <textarea 
                  rows={4}
                  placeholder={language === 'zh' ? '分享您的想法或经验...' : 'Share your ideas or experiences...'}
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
                    ? (language === 'zh' ? '提交中...' : 'Submitting...') 
                    : (language === 'zh' ? '提交评论' : 'Post Comment')}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-8">
                {comments.map((comment, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[#1b887a] font-bold uppercase">
                      {comment.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{comment.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-gray-400 py-8">
                    {language === 'zh' ? '暂无评论，来当第一个发言的人吧！' : 'No comments yet. Be the first to share!'}
                  </p>
                )}
              </div>
            </div>

            {/* Prev/Next Section */}
            {(prevArticle || nextArticle) && (
              <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link to={`/${langPrefix}/articles/${prevArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-left">
                    {prevArticle.thumbnail && <img src={prevArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{language === 'zh' ? '上一篇' : 'Previous'}</span>
                      <h4 className="font-bold text-gray-900 line-clamp-2">
                        {getI18n(prevArticle, 'title') || prevArticle.title || prevArticle.titleEn || ''}
                      </h4>
                    </div>
                  </Link>
                ) : <div />}
                {nextArticle ? (
                  <Link to={`/${langPrefix}/articles/${nextArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-right justify-end">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{language === 'zh' ? '下一篇' : 'Next'}</span>
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
