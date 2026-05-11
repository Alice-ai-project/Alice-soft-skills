import sys
import os

# Asegura que Python encuentre la carpeta 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.db import get_supabase_client

def test_connection():
    print("\n🔍 PRUEBA 1: Verificando conexión a Supabase...")
    try:
        supabase = get_supabase_client()
        # Intentamos leer la tabla document_types que creamos por SQL
        response = supabase.table("document_types").select("*").limit(1).execute()
        
        if hasattr(response, 'data'):
            print("✅ ÉXITO: El Backend está conectado a Supabase.")
            print(f"📊 Datos recibidos de la tabla: {response.data}")
        else:
            print("⚠️ ADVERTENCIA: Conexión lograda, pero no se recibieron datos.")
            
    except Exception as e:
        print(f"❌ ERROR: No se pudo conectar. Revisa el archivo .env.")
        print(f"Detalle: {e}")

if __name__ == "__main__":
    test_connection()