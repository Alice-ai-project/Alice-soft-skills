import sys
import os
import uuid

# Configuración de rutas
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.schemas.interview import InterviewFullRequest, InterviewResultResponse

def test_full_diagnostic_workflow():
    print("\n🎭 PRUEBA 4: Simulando flujo completo de Alice (End-to-End)...")
    
    # 1. Simula los datos que vendrían del Frontend
    # IMPORTANTE: Usa un ID de perfil que sepas que existe en la tabla 'profiles'
    # o usa este aleatorio para probar el flujo lógico.
    mock_data = {
        "profile_id": str(uuid.uuid4()),
        "document_type": "document_national",
        "transcript": "Usuario: Me gusta trabajar en equipo. Avatar: ¿Cómo manejas el estrés?"
    }

    print("Step 1: Validando formato de entrada...")
    try:
        request_data = InterviewFullRequest(**mock_data)
        print("✅ Datos validados correctamente.")

        print("Step 2: Simulando motor de evaluación de Soft-Skills...")
        # Aquí simulamos lo que haría tu agente de IA/n8n
        mock_response = {
            "session_id": f"sess_{uuid.uuid4().hex[:8]}",
            "is_finished": True,
            "overall_score": 85.5,
            "diagnostic_summary": "El candidato muestra gran capacidad de liderazgo y empatía."
        }

        print("Step 3: Verificando contrato de respuesta...")
        response_validation = InterviewResultResponse(**mock_response)
        
        print("\n✨ RESULTADO FINAL DEL DIAGNÓSTICO:")
        print(f"Puntaje: {response_validation.overall_score}/100")
        print(f"Resumen: {response_validation.diagnostic_summary}")
        print("\n✅ PRUEBA 4 EXITOSA: El flujo de datos es consistente.")

    except Exception as e:
        print(f"❌ ERROR EN EL FLUJO: {e}")

if __name__ == "__main__":
    test_full_diagnostic_workflow()