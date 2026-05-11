import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

# 1. Inicializa la variable del cliente (Singleton)
supabase: Client = None

def get_supabase_client() -> Client: 
    """
    Crea o devuelve el cliente de Supabase.
    Asegura que solo se cree una instancia si no existe.
    """
    global supabase
    if supabase is None:
        try:
            # Validamos que las credenciales cargadas por Pydantic no estén vacías
            if not settings.supabase_url or not settings.supabase_annon_key:
                raise ValueError("Credenciales de Supabase no configuradas en el archivo .env")
            
            # 2. Conecta con Supabase usando los nombres exactos de tu Settings
            # Usamos 'supabase_annon_key' porque así lo tienes en el .env
            supabase = create_client(settings.supabase_url, settings.supabase_annon_key)
            logger.info("✅ Conexión exitosa con el cliente de Supabase.")
            
        except Exception as e:
            logger.error(f"❌ Error al conectar con Supabase: {e}")
            raise e
    return supabase

# 3. Función auxiliar para verificar la salud de la conexión
def check_db_health():
    try:
        client = get_supabase_client()
        # Verificamos si podemos leer la tabla document_types
        client.table("document_types").select("count", count="exact").execute()
        return True
    except Exception as e:
        logger.error(f"Error de salud de la base de datos: {e}")
        return False