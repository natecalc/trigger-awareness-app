# Trigger Tracking App

A web application for tracking emotional triggers and their impacts.

## 🚀 Features

- Create and manage emotional trigger entries
- Track trigger events, factual descriptions, associated emotions, meanings, and past relationships
- RESTful API built with Elysia.js
- PostgreSQL database for data persistence
- Responsive frontend (refer to frontend repository)

## 📋 Prerequisites

- [Bun](https://bun.sh/) runtime environment
- PostgreSQL database
- Node.js and npm/yarn (for frontend dependencies)

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/trigger-tracking-app.git
   cd trigger-tracking-app
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/trigger_map
   ```

   Replace `username`, `password` with your PostgreSQL credentials.

4. Run database migrations:
   ```bash
   bun run migrate
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
bun run dev
```

The API will be available at http://localhost:3000.

### Production Mode

```bash
bun run start
```

## 📚 API Documentation

### Endpoints

- `GET /triggers` - Get all triggers
- `GET /triggers/:id` - Get a specific trigger
- `POST /triggers` - Create a new trigger
- `DELETE /triggers/:id` - Delete a trigger

### Example Request

```bash
curl -X POST http://localhost:3000/triggers \
  -H "Content-Type: application/json" \
  -d '{
    "triggerEvent": "Example event",
    "factualDescription": "Detailed description",
    "emotions": ["anxiety", "frustration"],
    "meaning": "What this means to me",
    "pastRelationship": "How this relates to my past",
    "triggerName": "Brief name"
  }'
```

## 🔄 Database Schema

The application uses a PostgreSQL database with the following schema:

```sql
CREATE TABLE IF NOT EXISTS triggers (
    id SERIAL PRIMARY KEY,
    trigger_event TEXT NOT NULL,
    factual_description TEXT NOT NULL,
    emotions JSONB NOT NULL,
    meaning TEXT NOT NULL,
    past_relationship TEXT,
    trigger_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Running Tests

```bash
bun test
```

## 🚢 Deployment

This application is designed to be deployed on Vercel with a PostgreSQL database.

1. Set up a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Connect your GitHub repository to Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

Project Link: [https://github.com/natecalc/trigger-tracking-app](https://github.com/natecalc/trigger-tracking-app)
