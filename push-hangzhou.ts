import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function push() {
  const content = fs.readFileSync('hangzhou-data.json', 'utf-8');
  const data = JSON.parse(content);
  
  const id = 'XxxHqxEftFPTAfw09w37';
  const { error } = await supabase.from('cities').update(data).eq('id', id);
  if (error) {
    console.error("Error updating:", error);
  } else {
    console.log("Updated Hangzhou successfully.");
  }
}
push();