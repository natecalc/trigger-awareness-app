
CREATE TABLE IF NOT EXISTS triggers (
    id SERIAL PRIMARY KEY,
    trigger_event TEXT NOT NULL,
    factual_description TEXT NOT NULL,
    emotions JSONB NOT NULL,
    meaning TEXT NOT NULL,
    past_relationship TEXT,
    trigger_name TEXT NOT NULL,
    intensity TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);