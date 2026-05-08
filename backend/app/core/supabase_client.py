import os
from supabase import create_client, Client
from app.core.config import settings

def get_supabase() -> Client:
    url = settings.supabase_url
    
    # IMPORTANTE: Forzamos la búsqueda de la SERVICE_KEY
    # Si settings no la cargó, la buscamos directamente en el sistema
    service_key = settings.supabase_service_key or os.getenv("SUPABASE_SERVICE_KEY")
    anon_key = settings.supabase_anon_key or os.getenv("SUPABASE_ANON_KEY")
    
    # Elegimos la mejor llave disponible
    if service_key:
        print(" Supabase Client: Usando SERVICE_ROLE_KEY (Bypass RLS)")
        key = service_key
    else:
        print(" Supabase Client: Usando ANON_KEY (RLS activo)")
        key = anon_key
    
    if not url or not key:
        print(" Supabase Client: ERROR - No hay URL o KEY configurada")
        return None
        
    return create_client(url, key)

# Instancia única
supabase: Client = get_supabase()
