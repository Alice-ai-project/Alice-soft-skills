import os
from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from supabase.client import ClientOptions
except ImportError:
    from supabase.lib.client_options import ClientOptions

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase_client: Client | None = None
supabase_auth_client: Client | None = None

try:
    client_options = ClientOptions(
        auto_refresh_token=False,
        persist_session=False,
    )

    if SUPABASE_URL and SUPABASE_ANON_KEY:
        supabase_auth_client = create_client(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            options=client_options,
        )

    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        supabase_client = create_client(
            SUPABASE_URL,
            SUPABASE_SERVICE_KEY,
            options=client_options,
        )
except Exception as error:
    # Log error but don't crash the app on startup
    print(f"Warning: Could not initialize Supabase client: {error}")
