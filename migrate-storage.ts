import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function run() {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';
  const supabase = createClient(supabaseUrl, supabaseKey);

  async function downloadAndUpload(url: string): Promise<string> {
    if (!url.includes('firebasestorage.googleapis.com')) return url;
    
    try {
      const cleanUrl = url.replace(/\\"/g, '').replace(/\\\\/g, '');
      console.log(`Downloading: ${cleanUrl.substring(0, 50)}...`);
      const response = await fetch(cleanUrl);
      
      if (!response.ok) {
        console.error(`Failed to download: ${response.statusText}`);
        return url;
      }
      
      const buffer = await response.arrayBuffer();
      
      let fullPath = `migrated_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      try {
        const urlObj = new URL(cleanUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
        if (pathMatch) {
          fullPath = decodeURIComponent(pathMatch[1]);
          fullPath = fullPath.replace(/[^a-zA-Z0-9.\-\_\/]/g, '_');
        }
      } catch (e) {
        // Fallback
      }
      
      const { data, error } = await supabase.storage.from('images').upload(fullPath, buffer, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });
      
      if (error) {
        console.error('Error uploading to Supabase:', error.message);
        return url;
      }
      
      return supabase.storage.from('images').getPublicUrl(fullPath).data.publicUrl;
    } catch (e: any) {
      console.error('Migration failed for url:', url.substring(0, 50), e.message);
      return url;
    }
  }

  const traverseAndUpdateURLs = async (obj: any): Promise<any> => {
    if (typeof obj === 'string') {
      const regex = /https:\/\/firebasestorage\.googleapis\.com[^\s"'\)\(\]]+/g;
      const urls = obj.match(regex);
      if (urls) {
        let newStr = obj;
        for (const url of [...new Set(urls)]) {
          const newUrl = await downloadAndUpload(url);
          if (newUrl !== url) {
            newStr = newStr.split(url).join(newUrl);
          }
        }
        return newStr;
      }
      return obj;
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = await traverseAndUpdateURLs(obj[i]);
      }
    } else if (obj !== null && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        obj[key] = await traverseAndUpdateURLs(obj[key]);
      }
    }
    return obj;
  };

  // Migrate Cities
  try {
    const citiesSnap = await getDocs(collection(db, 'cities'));
    const allowedCityKeys = ['id', 'name', 'enName', 'img', 'listCover', 'heroImage', 'tags', 'paragraphs', 'enParagraphs', 'stats'];
    
    for (const doc of citiesSnap.docs) {
      const raw = doc.data();
      const city: any = { id: doc.id };
      for (const k of allowedCityKeys) {
        if (raw[k] !== undefined) city[k] = raw[k];
      }
      
      const updatedCity = await traverseAndUpdateURLs(JSON.parse(JSON.stringify(city)));
      const { error } = await supabase.from('cities').upsert(updatedCity);
      if (error) console.error(`Error upserting city ${city.id}:`, error.message);
      else console.log(`Migrated city: ${city.id}`);
    }
  } catch (e: any) {
    console.error("fetch cities error:", e.message);
  }

  // Migrate Articles
  try {
    const articlesSnap = await getDocs(collection(db, 'articles'));
    const allowedArticleKeys = ['id', 'title', 'titleEn', 'subtitle', 'subtitleEn', 'thumbnail', 'content', 'contentEn', 'category', 'views', 'likes', 'createdAt'];
    
    for (const doc of articlesSnap.docs) {
      let raw = doc.data();
      if(raw.createdAt && raw.createdAt.toDate) {
        raw.createdAt = raw.createdAt.toDate().toISOString();
      }
      const article: any = { id: doc.id };
      for (const k of allowedArticleKeys) {
        if (raw[k] !== undefined) article[k] = raw[k];
      }
      
      const updatedArticle = await traverseAndUpdateURLs(JSON.parse(JSON.stringify(article)));
      const { error } = await supabase.from('articles').upsert(updatedArticle);
      if (error) console.error(`Error upserting article ${article.id}:`, error.message);
      else console.log(`Migrated article: ${article.id}`);
    }
  } catch (e: any) {
    console.error("fetch articles error:", e.message);
  }
}

run();
