
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('cities').select('id, name');
  if (error) throw error;
  
  for (const city of data) {
    const { data: fullData, error: fullError } = await supabase.from('cities').select('*').eq('id', city.id).single();
    if (!fullError && !fullData.worldHeritage) {
        console.log(`${city.id}`);
    }
  }
}
check();
