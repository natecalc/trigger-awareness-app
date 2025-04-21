CREATE TABLE IF NOT EXISTS triggers 
(
    id INTEGER PRIMARY KEY,
    trigger_event TEXT NOT NULL,
    factual_description TEXT NOT NULL,
    emotions TEXT NOT NULL,
    meaning TEXT NOT NULL,
    past_relationship TEXT,
    trigger_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
)