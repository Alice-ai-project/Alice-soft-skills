import sys
import os
import uuid

# Aseguramos que Python encuentre la carpeta backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.core.db import get_supabase_client

def test_user_not_found():
    print("\n🔍 PRUEBA 3: Verificando validación de existencia (Error 404)...")
    
    supabase = get_supabase_client()
    
    # Generamos un UUID aleatorio que sabemos que NO existe en tu tabla 'profiles'
    random_id = str(uuid.uuid4())
    
    print(f"Buscando un perfil inexistente con ID: {random_id}")
    
    try:
        # Intentamos buscar en la tabla 'profiles'
        response = supabase.table("profiles").select("*").eq("id", random_id).execute()
        
        # Si la lista de datos está vacía, es que el usuario no existe (Éxito del test)
        if len(response.data) == 0:
            print(f"✅ ÉXITO: El sistema confirmó que el usuario no existe.")
            print("Lógica sugerida: Retornar HTTP 404 Not Found al Frontend.")
        else:
            print("❌ ERROR: ¡Se encontró un usuario! (Esto no debería pasar con un UUID aleatorio).")
            
    except Exception as e:
        print(f"❌ ERROR TÉCNICO: Falló la consulta a Supabase: {e}")

if __name__ == "__main__":
    test_user_not_found()