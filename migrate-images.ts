import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadAndUpload(url: string): Promise<string> {
  // 只处理 Firebase 的图片链接
  if (!url.includes('firebasestorage.googleapis.com')) return url;
  
  try {
    // 移除 JSON stringify 可能带来的转义斜杠
    const cleanUrl = url.replace(/\\"/g, '').replace(/\\\\/g, '');
    
    console.log(`Downloading: ${cleanUrl.substring(0, 50)}...`);
    const response = await fetch(cleanUrl);
    
    if (!response.ok) {
      console.error(`Failed to download: ${response.statusText}`);
      return url;
    }
    
    const buffer = await response.arrayBuffer();
    
    // 生成新的文件名
    const filename = `migrated_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    
    // 上传到 Supabase
    const { data, error } = await supabase.storage.from('images').upload(filename, buffer, {
      contentType: response.headers.get('content-type') || 'image/jpeg',
    });
    
    if (error) {
      console.error('Error uploading to Supabase:', error.message);
      return url;
    }
    
    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filename);
    console.log(`Upload success: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (e: any) {
    console.error('Migration failed for url:', url.substring(0, 50), e.message);
    return url;
  }
}

async function migrateCities() {
  console.log("Starting cities migration...");
  const { data: cities, error } = await supabase.from('cities').select('*');
  if (error || !cities) {
    console.error("Fetch cities failed:", error);
    return;
  }

  for (const city of cities) {
    let updated = false;
    const clone = JSON.parse(JSON.stringify(city));

    const traverse = async (obj: any) => {
      if (typeof obj === 'string') {
        const regex = /https:\/\/firebasestorage\.googleapis\.com[^\s"'\)\(\]]+/g;
        const urls = obj.match(regex);
        if (urls) {
          let newStr = obj;
          for (const url of [...new Set(urls)]) {
            const newUrl = await downloadAndUpload(url);
            if (newUrl !== url) {
              newStr = newStr.split(url).join(newUrl);
              updated = true;
            }
          }
          return newStr;
        }
        return obj;
      } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          obj[i] = await traverse(obj[i]);
        }
      } else if (obj !== null && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
          obj[key] = await traverse(obj[key]);
        }
      }
      return obj;
    };

    const newCity = await traverse(clone);
    
    if (updated) {
      const { error: updateError } = await supabase.from('cities').update(newCity).eq('id', newCity.id);
      if (updateError) {
        console.error(`Failed to update city ${newCity.id}`, updateError);
      } else {
        console.log(`Updated city ${newCity.id} in database`);
      }
    }
  }
}

async function migrateArticles() {
  console.log("\nStarting articles migration...");
  const { data: articles, error } = await supabase.from('articles').select('*');
  if (error || !articles) {
    console.error("Fetch articles failed:", error);
    return;
  }

    let rawArticles;
    try {
      rawArticles = articles;
    } catch (e) {
      console.error(e);
      return;
    }

    for (const article of rawArticles) {
      let updated = false;
      const clone = JSON.parse(JSON.stringify(article));
      
      const traverse = async (obj: any) => {
        if (typeof obj === 'string') {
          // Find URLs in string
          const regex = /https:\/\/firebasestorage\.googleapis\.com[^\s"'\)\(\]]+/g;
          const urls = obj.match(regex);
          if (urls) {
            let newStr = obj;
            for (const url of [...new Set(urls)]) {
              const newUrl = await downloadAndUpload(url);
              if (newUrl !== url) {
                newStr = newStr.split(url).join(newUrl);
                updated = true;
              }
            }
            return newStr;
          }
          return obj;
        } else if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            obj[i] = await traverse(obj[i]);
          }
        } else if (obj !== null && typeof obj === 'object') {
          for (const key of Object.keys(obj)) {
            obj[key] = await traverse(obj[key]);
          }
        }
        return obj;
      };

      const newArticle = await traverse(clone);

      if (updated) {
        const { error: updateError } = await supabase.from('articles').update(newArticle).eq('id', newArticle.id);
        if (updateError) {
          console.error(`Failed to update article ${newArticle.id}`, updateError);
        } else {
          console.log(`Updated article ${newArticle.id} in database`);
        }
      }
    }
}

async function run() {
  await migrateCities();
  await migrateArticles();
  console.log('\nMigration complete!');
  process.exit(0);
}

run();
