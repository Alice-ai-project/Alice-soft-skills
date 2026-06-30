import os


SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
DATABASE_URL: str = os.getenv("DATABASE_URL", "")
N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")
N8N_ROADMAP_WEBHOOK_URL: str = os.getenv("N8N_ROADMAP_WEBHOOK_URL", "")

if not SUPABASE_URL:
    print("WARNING: SUPABASE_URL not detected — check your .env file")
if not SUPABASE_SERVICE_KEY and not SUPABASE_ANON_KEY:
    print("WARNING: No Supabase keys detected — check your .env file")
