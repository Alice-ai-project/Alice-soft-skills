#!/usr/bin/env python3
"""
Script de pruebas actualizado para el Flujo Stateless de Alice.
Valida: Validaciones Pydantic, Errores 404 (Perfil) y Guardado en Supabase.
"""

import sys
import httpx

# Se ajusta la URL al prefijo que se puso en main.py
BASE_URL = "http://localhost:8000/api/v1/interview"

COLORS = {
    "green": "\033[92m", "red": "\033[91m", "yellow": "\033[93m",
    "blue": "\033[94m", "reset": "\033[0m", "bold": "\033[1m",
}

def ok(msg): print(f"  {COLORS['green']}✔{COLORS['reset']} {msg}")
def fail(msg): 
    print(f"  {COLORS['red']}✘{COLORS['reset']} {msg}")
    sys.exit(1)
def info(msg): print(f"\n{COLORS['bold']}{COLORS['blue']}▶ {msg}{COLORS['reset']}")

def run_tests():
    client = httpx.Client(base_url=BASE_URL, timeout=10.0)

    # ── 1. Prueba de Validación Pydantic (Error 422) ────────────────────────
    info("Test 1: Validación Pydantic - Datos mal formados")
    # Enviar un document_type que no existe en el Enum
    payload_bad = {
        "profile_id": "550e8400-e29b-41d4-a716-446655440000",
        "document_type": "cedula_inexistente",
        "transcript": "Texto corto"
    }
    r = client.post("/process", json=payload_bad)
    if r.status_code == 422:
        ok("Pydantic rechazó correctamente el tipo de documento inválido")
    else:
        fail(f"Se esperaba 422, se recibió {r.status_code}")

    # ── 2. Prueba de Usuario No Encontrado (Error 404) ──────────────────────
    info("Test 2: Manejo de Error 404 - Perfil inexistente")
    # Un UUID que no está en tu tabla 'profiles' de Supabase
    payload_404 = {
        "profile_id": "00000000-0000-0000-0000-000000000000",
        "document_type": "document_national",
        "transcript": "Conversación de prueba para perfil que no existe."
    }
    r = client.post("/process", json=payload_404)
    if r.status_code == 404:
        ok("API manejó correctamente el perfil inexistente")
    else:
        fail(f"Se esperaba 404, se recibió {r.status_code}")

    # ── 3. Prueba de "Camino Feliz" (Status 201) ─────────────────────────────
    info("Test 3: Procesar diagnóstico completo y guardar")
    # IMPORTANTE: Reemplaza este UUID por uno que SI exista en tu Supabase
    REAL_PROFILE_ID = "PON_AQUI_UN_ID_DE_TU_TABLA_PROFILES" 
    
    payload_ok = {
        "profile_id": REAL_PROFILE_ID,
        "document_type": "document_national",
        "transcript": "Avatar: ¿Cómo manejas el estrés? Usuario: Respiro profundo y priorizo mis tareas según impacto."
    }
    
    r = client.post("/process", json=payload_ok)
    if r.status_code == 201:
        data = r.json()
        ok(f"Diagnóstico procesado. Score: {data['overall_score']}")
        ok(f"Resumen IA: {data['diagnostic_summary']}")
    else:
        fail(f"El proceso falló con {r.status_code}: {r.text}")

    print(f"\n{COLORS['bold']}{COLORS['green']}✔ Criterios de Aceptación validados correctamente.{COLORS['reset']}\n")

if __name__ == "__main__":
    run_tests()