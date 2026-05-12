from fastapi import APIRouter, HTTPException
from app.schemas.auth import UserRegister, UserLogin, UserResponse
from app.core.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/check-connection")
async def check_connection():
    try:
        supabase.table("profiles").select("count", count="exact").limit(1).execute()
        return {"status": "success", "message": "Connected to Supabase"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister):
    print(f"--- INICIANDO REGISTRO PARA: {user_data.email} ---")
    try:
        # 1. Crear usuario en Auth
        print("Paso 1: Creando usuario en Supabase Auth...")
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
        })
        
        if not auth_response.user:
            print(" Error en Auth: No se recibió usuario")
            raise HTTPException(status_code=400, detail="Error al crear usuario en Supabase Auth")
        
        user_id = auth_response.user.id
        print(f" Usuario creado con ID: {user_id}")

        # 2. Guardar en la tabla 'profiles'
        profile_data = {
            "id": user_id,
            "email": user_data.email,
            "document": user_data.document,
            "username": user_data.document,
            "display_name": f"Usuario {user_data.document}"
        }
        
        print(f"Paso 2: Guardando en tabla profiles con datos: {profile_data}")
        
        # Intentamos con upsert explícito
        try:
            profile_res = supabase.table("profiles").upsert(profile_data, on_conflict="id").execute()
            print(f"Resultado Upsert: {profile_res.data}")
            
            if not profile_res.data:
                print(" Upsert vacío, intentando update...")
                profile_res = supabase.table("profiles").update(profile_data).eq("id", user_id).execute()
                print(f"Resultado Update: {profile_res.data}")

            if not profile_res.data:
                # Si sigue vacío, es probable que no tengamos permisos o la fila no exista aún
                print(" No se pudo guardar con upsert ni update, intentando insert directo...")
                profile_res = supabase.table("profiles").insert(profile_data).execute()
                print(f"Resultado Insert: {profile_res.data}")

        except Exception as db_err:
            print(f" Error de Base de Datos: {str(db_err)}")
            raise Exception(f"Error en base de datos: {str(db_err)}")

        if not profile_res.data:
            raise Exception("La base de datos no devolvió ninguna información después de intentar guardar.")

        print(" Registro completado exitosamente")
        return profile_res.data[0]
        
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR FINAL: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })

        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        user_id = auth_response.user.id
        profile_res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not profile_res.data:
            return {
                "id": user_id,
                "email": credentials.email,
                "username": "Usuario",
                "display_name": "Usuario"
            }
            
        return profile_res.data[0]
    except Exception as e:
        print(f"Error en login: {str(e)}")
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
