import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yekchkfacataeesevada.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlla2Noa2ZhY2F0YWVlc2V2YWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzQ4NDMsImV4cCI6MjA2ODExMDg0M30.4bVXl8kstAeMAYTGMGKbDmMW6LdBSr4tgb2pl9JvoG4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
