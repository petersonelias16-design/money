import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://donohfnkhooxneeytvsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbm9oZm5raG9veG5lZXl0dnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzU5NzIsImV4cCI6MjA3OTA1MTk3Mn0.OrB1wPx8aJbrWdMdO2j3vGz-RsWwaGTnN7P5QGNQnaw';

export const supabase = createClient(supabaseUrl, supabaseKey);