// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dfrukwuixptdzujadief.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcnVrd3VpeHB0ZHp1amFkaWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMjgyMzQsImV4cCI6MjA1NTkwNDIzNH0.L7Dw7cVMLZ4z-U7nzLTb7TAXbQmZ3yFmQKz9t7L7uOs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);