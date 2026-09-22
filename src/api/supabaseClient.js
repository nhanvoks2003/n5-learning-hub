import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dfztdnegyzqolmbsseup.supabase.co';
const supabaseAnonKey = 'sb_publishable_MTbNpHmfgPjGwLxdgR1ytA_S2siqOa0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);