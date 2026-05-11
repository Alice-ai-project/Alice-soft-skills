import sys
import os

# Aseguramos que Python encuentre la carpeta backend desde la raíz
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from pydantic import ValidationError
# Usamos el nombre exacto de tu clase en interview.py
from app.schemas.interview import InterviewFullRequest 

def test_pydantic_shield():
    print("\n🛡️ PRUEBA 2: Verificando el Escudo de Seguridad (Pydantic)...")
    
    # Caso de prueba: Datos basura
    # 1. profile_id: texto corto (no es UUID)
    # 2. document_type: un tipo que NO está en tu Enum
    # 3. transcript: muy corto (menos de 10 caracteres)
    invalid_data = {
        "profile_id": "no-soy-uuid", 
        "document_type": "carnet_de_conducir", 
        "transcript": "Hola"
    }

    try:
        print("Intentando enviar datos inválidos al esquema InterviewFullRequest...")
        InterviewFullRequest(**invalid_data)
        
        print("❌ ERROR: El escudo falló. Pydantic dejó pasar datos incorrectos.")
    
    except ValidationError as e:
        print(f"✅ ÉXITO: El escudo de Pydantic funcionó.")
        print(f"Detectó {len(e.errors())} errores de validación en los datos.")
        
        # Listamos los errores para que veas cómo Pydantic protege tu API
        for error in e.errors():
            campo = error['loc'][0]
            mensaje = error['msg']
            print(f"   -> Campo '{campo}': {mensaje}")

if __name__ == "__main__":
    test_pydantic_shield()