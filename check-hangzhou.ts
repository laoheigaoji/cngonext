import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('cities').select('*').eq('id', 'XxxHqxEftFPTAfw09w37').single();
  if (error) {
    console.error("Error fetching:", error);
  } else {
    console.log("Hangzhou keys:", Object.keys(data));
    console.log("worldHeritage:", data.worldHeritage ? "yes" : "no");
    console.log("intangibleHeritage:", data.intangibleHeritage ? "yes" : "no");
    console.log("history:", data.history ? "yes" : "no");
    console.log("attractions:", data.attractions ? "yes" : "no", data.attractions);
    console.log("food:", data.food ? "yes" : "no");
  }
}
check();