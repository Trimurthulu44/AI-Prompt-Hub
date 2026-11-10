-- AI PROMPT HUB - PostgreSQL Schema with pgvector
-- Extracted from Project Report Appendix 1 [4]

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS organization (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    workspace_slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS application (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    project_id UUID NOT NULL REFERENCES project(id),
    name VARCHAR(200) NOT NULL,
    environment VARCHAR(50) NOT NULL DEFAULT 'Production',
    api_key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prompt (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    project_id UUID NOT NULL REFERENCES project(id),
    application_id UUID REFERENCES application(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prompt_version (
    id UUID PRIMARY KEY,
    prompt_id UUID NOT NULL REFERENCES prompt(id),
    version_no INT NOT NULL,
    content TEXT NOT NULL,
    change_instruction TEXT,
    created_by VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(30) NOT NULL,
    embedding vector(384),
    UNIQUE (prompt_id, version_no)
);

CREATE TABLE IF NOT EXISTS test_dataset (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    prompt_id UUID REFERENCES prompt(id),
    name VARCHAR(200) NOT NULL,
    case_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS test_case (
    id UUID PRIMARY KEY,
    dataset_id UUID NOT NULL REFERENCES test_dataset(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    expected_behavior TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evaluation_run (
    id UUID PRIMARY KEY,
    prompt_version_id UUID NOT NULL REFERENCES prompt_version(id),
    dataset_id UUID REFERENCES test_dataset(id),
    quality_score DOUBLE PRECISION NOT NULL,
    correctness DOUBLE PRECISION NOT NULL,
    relevance DOUBLE PRECISION NOT NULL,
    instruction_following DOUBLE PRECISION NOT NULL,
    format_score DOUBLE PRECISION NOT NULL,
    tested_cases INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS security_result (
    id UUID PRIMARY KEY,
    prompt_version_id UUID NOT NULL REFERENCES prompt_version(id),
    passed BOOLEAN NOT NULL,
    failed_probes_count INT NOT NULL,
    total_probes_count INT NOT NULL DEFAULT 20,
    failed_probe_name VARCHAR(120),
    reason TEXT,
    recommendation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gate_decision (
    id UUID PRIMARY KEY,
    prompt_version_id UUID NOT NULL REFERENCES prompt_version(id),
    passed BOOLEAN NOT NULL,
    status VARCHAR(30) NOT NULL,
    delta DOUBLE PRECISION NOT NULL,
    reasons TEXT,
    recommendations TEXT,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_event (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    developer VARCHAR(120) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_metadata (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization(id),
    prompt_id UUID REFERENCES prompt(id),
    version_id UUID REFERENCES prompt_version(id),
    model_name VARCHAR(100) NOT NULL,
    avg_tokens INT NOT NULL,
    cost_per_1k_rs DOUBLE PRECISION NOT NULL,
    latency_ms INT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
