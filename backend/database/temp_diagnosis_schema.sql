-- =============================================================================
-- TEMPORAL — Borrador DDL diagnóstico (sintaxis MySQL)
-- =============================================================================
-- Este archivo es provisional para revisión de producto/DBA.
-- Alice usa PostgreSQL (docker-compose: pgvector/pg16). Antes de migrar a
-- producción, convertir: AUTO_INCREMENT → GENERATED/BIGSERIAL, ENUM → CHECK
-- o tipo custom, TIMESTAMP → TIMESTAMPTZ, etc.
-- No ejecutar tal cual contra el contenedor alice-db sin adaptar.
-- =============================================================================

-- =====================================================
-- 1. DIMENSIONES CONDUCTUALES
-- =====================================================

CREATE TABLE behavioral_dimensions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =====================================================
-- 2. PREGUNTAS DEL DIAGNÓSTICO
-- =====================================================

CREATE TABLE diagnostic_questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    question_text TEXT NOT NULL,
    
    order_index INT NOT NULL,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =====================================================
-- 3. OPCIONES DE RESPUESTA
-- =====================================================

CREATE TABLE question_options (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    question_id BIGINT NOT NULL,
    
    option_text VARCHAR(500) NOT NULL,
    
    option_order INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_question_options_question
        FOREIGN KEY (question_id)
        REFERENCES diagnostic_questions(id)
        ON DELETE CASCADE
);



-- =====================================================
-- 4. SEÑALES CONDUCTUALES POR OPCIÓN
-- =====================================================

CREATE TABLE option_behavioral_signals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    option_id BIGINT NOT NULL,
    
    dimension_id BIGINT NOT NULL,
    
    signal_weight DECIMAL(5,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_option_behavioral_signals_option
        FOREIGN KEY (option_id)
        REFERENCES question_options(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_option_behavioral_signals_dimension
        FOREIGN KEY (dimension_id)
        REFERENCES behavioral_dimensions(id)
        ON DELETE CASCADE
);



-- =====================================================
-- 5. SESIONES DEL DIAGNÓSTICO
-- =====================================================

CREATE TABLE diagnostic_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    user_id BIGINT NOT NULL,
    
    status ENUM(
        'in_progress',
        'completed',
        'abandoned'
    ) DEFAULT 'in_progress',
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    completed_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =====================================================
-- 6. RESPUESTAS DEL USUARIO
-- =====================================================

CREATE TABLE user_question_answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    session_id BIGINT NOT NULL,
    
    question_id BIGINT NOT NULL,
    
    selected_option_id BIGINT NOT NULL,
    
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_answers_session
        FOREIGN KEY (session_id)
        REFERENCES diagnostic_sessions(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_user_answers_question
        FOREIGN KEY (question_id)
        REFERENCES diagnostic_questions(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_user_answers_option
        FOREIGN KEY (selected_option_id)
        REFERENCES question_options(id)
        ON DELETE CASCADE
);



-- =====================================================
-- 7. RESULTADO FINAL DEL SCORING
-- =====================================================

CREATE TABLE session_dimension_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    session_id BIGINT NOT NULL,
    
    dimension_id BIGINT NOT NULL,
    
    raw_score DECIMAL(10,2) NOT NULL,
    
    normalized_score DECIMAL(5,4) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_session_scores_session
        FOREIGN KEY (session_id)
        REFERENCES diagnostic_sessions(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_session_scores_dimension
        FOREIGN KEY (dimension_id)
        REFERENCES behavioral_dimensions(id)
        ON DELETE CASCADE
);
