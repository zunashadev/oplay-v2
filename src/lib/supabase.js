import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usiluuzsrawbybmslrml.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaWx1dXpzcmF3YnlibXNscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTg4MjYsImV4cCI6MjA1ODM5NDgyNn0.5qeHemuUgN0tkkuxytjDSAT3ctp-tfWMr6lDVUExFmQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
