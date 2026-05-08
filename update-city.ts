
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const deepseekKey = 'sk-59621d871ea2481ebb5cef488b8137be';
const deepseek = new OpenAI({
  apiKey: deepseekKey,
  baseURL: 'https://api.deepseek.com'
});

const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function askDeepSeek(prompt: string) {
  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'You are a professional travel curator. Responsive only with valid JSON.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' }
  });
  return response.choices[0].message.content || '{}';
}

function cleanJSON(jsonContent: string) {
  let jsonString = jsonContent.trim();
  const start = jsonString.indexOf('{');
  const end = jsonString.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    jsonString = jsonString.substring(start, end + 1);
  }
  return jsonString;
}

async function run() {
  const cityId = process.argv[2];
  if (!cityId) {
    console.error("No city ID provided");
    process.exit(1);
  }

  const { data: city, error } = await supabase.from('cities').select('id, name').eq('id', cityId).single();
  if (error) throw error;
  
  console.log(`Generating data for ${city.name} (${city.id})...`);
  
  const prompt = `You are a world-class travel curator. Generates a deep, high-value city guide for '${city.name}' in China.
      Output requirements:
      - Comprehensive introduction (paragraphs & enParagraphs), MUST be exactly 4 distinct paragraphs:
          1. Geographical location and climate (approx 100 words).
          2. Historical significance and unique city charm (approx 100 words).
          3. Cultural atmosphere, food specialties, and local lifestyle (approx 100 words).
          4. Modern development, international standing, and future vision (approx 100 words).
      - Best Travel Time (bestTravelTime.paragraphs & enParagraphs), MUST be exactly 3 distinct paragraphs:
          1. Detailed description of the best months and why they are recommended.
          2. Comprehensive guide for visiting in Spring (specific weather, recommended parks/scenes).
          3. Comprehensive guide for visiting in Autumn (weather conditions, key activities/festivals).
      - Comprehensiveness Requirements:
          - Attractions: Provide 5 major attractions, covering historical, cultural, and modern sites.
          - Food: Provide 5 local specialties, including main dishes, street foods, and traditional desserts.
          - Transportation: Provide a highly detailed guide for Plane, Train, and Bus/Local Metro.
          - History: Provide 5 key historical milestones.
          - Highlights: Include 2 World Heritage sites (if any) and 2 Intangible Cultural Heritages.
      - Every field must have its corresponding 'en' field filled.
      - DO NOT mix both languages in a single field.
      - DO NOT provide any image URLs. Leave heroImage, listCover, and all imageUrl fields as empty strings.

      Format: {
        name: string,
        enName: string,
        paragraphs: string[],
        enParagraphs: string[],
        tags: [{text: string, enText: string, color: string}],
        info: {area: string, population: string},
        stats: {wantToVisit: number, recommended: number},
        bestTravelTime: {strongText: string, enStrongText: string, paragraphs: string[], enParagraphs: string[]},
        history: [{year: string, enYear: string, title: string, enTitle: string, desc: string, enDesc: string}],
        attractions: [{name: string, enName: string, desc: string, enDesc: string, price: string, enPrice: string, season: string, enSeason: string, time: string, enTime: string}],
        worldHeritage: [{name: string, enName: string, year: string, enYear: string, desc: string, enDesc: string}],
        intangibleHeritage: [{name: string, enName: string, year: string, enYear: string, desc: string, enDesc: string, imageUrl: string}],
        transportation: [{iconName: "Plane"|"Train"|"Bus", title: string, enTitle: string, desc: string, enDesc: string, price: string, enPrice: string}],
        food: [{name: string, enName: string, pinyin: string, price: string, desc: string, enDesc: string, ingredients: string, enIngredients: string}]
      }`;

    try {
        const resString = await askDeepSeek(prompt);
        const cleaned = cleanJSON(resString);
        const data = JSON.parse(cleaned);
        
        const { error: updateError } = await supabase.from('cities').update(data).eq('id', city.id);
        if (updateError) {
            console.error(`Error updating ${city.name}:`, updateError);
        } else {
            console.log(`Updated ${city.name} successfully.`);
        }
    } catch (err) {
        console.error(`Error processing ${city.name}:`, err);
    }
}
run();
