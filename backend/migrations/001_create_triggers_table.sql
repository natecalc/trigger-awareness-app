
CREATE TABLE IF NOT EXISTS triggers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
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

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  possibly add 'setting / location' ?