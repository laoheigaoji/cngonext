import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL : null) || 'https://cxegaqhwexiidezycbyg.supabase.co';
const serviceRoleKey = (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY : null) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

// Service role client bypasses RLS
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
