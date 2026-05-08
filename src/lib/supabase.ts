import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase configuration missing! Check your environment variables.");
}

// Lazy-initialized singleton to avoid SSR issues
let _supabase: ReturnType<typeof createClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    if (typeof window === 'undefined') {
      // During SSR, return a no-op that resolves to empty data
      if (typeof prop === 'string') {
        return () => Promise.resolve({ data: null, error: null });
      }
      return undefined;
    }
    if (!_supabase) {
      _supabase = createClient(supabaseUrl, supabaseKey);
    }
    const val = (_supabase as any)[prop];
    return typeof val === 'function' ? val.bind(_supabase) : val;
  }
});
