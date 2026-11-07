const SUPABASE_URL = "https://yajbnlgtemnstrcqimhv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2S2rXFfJ5_OWwEsr7fwfAA_mwBqHn3a";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);