import { Elysia, t } from "elysia";
import { createDb } from "./db";
import { faker } from "@faker-js/faker";
import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import swagger from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";

dotenv.config({ path: "../.env" });

const port = process.env.PORT || 3000;

const serverSetup = async () => {
  const db = await createDb();

  const app = new Elysia()
    .use(swagger())
    .use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://trigger-awareness-app-frontend.onrender.com",
        ],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    )
    .use(
      jwt({
        name: "jwt",
        secret:
          process.env.JWT_SECRET || "your-secret-key-change-in-production",
      })
    )
    .derive(({ headers, jwt, set }) => {
      return {
        authenticate: async () => {
          const authHeader = headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            set.status = 401;
            return null;
          }

          const token = authHeader.split(" ")[1];
          const payload = await jwt.verify(token);

          if (!payload) {
            set.status = 401;
            return null;
          }

          return payload;
        },
      };
    })
    .decorate("db", db)
    .get("/ping", () => "pong")
    .get("/", () => "Hello Elysia")
    .post(
      "/auth/signup",
      async ({ db, body, set }) => {
        try {
          const existingUser = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [body.email]
          );

          if (existingUser.rows.length > 0) {
            set.status = 400;
            return { error: "User already exists" };
          }

          const passwordHash = await Bun.password.hash(body.password);

          const result = await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [body.username, body.email, passwordHash]
          );

          return result.rows[0];
        } catch (error) {
          console.error("Error creating user:", error);
          set.status = 500;
          return { error: "Server error" };
        }
      },
      {
        body: t.Object({
          username: t.String(),
          email: t.String(),
          password: t.String(),
        }),
      }
    )
    .post(
      "/auth/login",
      async ({ db, body, jwt, set }) => {
        try {
          const result = await db.query(
            `SELECT id, username, email, password_hash FROM users WHERE email = $1`,
            [body.email]
          );

          if (result.rows.length === 0) {
            set.status = 401;
            return { error: "Invalid credentials" };
          }

          const user = result.rows[0];

          const isMatch = await Bun.password.verify(
            body.password,
            user.password_hash
          );
          if (!isMatch) {
            set.status = 401;
            return { error: "Invalid credentials" };
          }

          const token = await jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
          });

          return {
            token,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
            },
          };
        } catch (error) {
          console.error("Error during login:", error);
          set.status = 500;
          return { error: "Server error" };
        }
      },
      {
        body: t.Object({
          email: t.String(),
          password: t.String(),
        }),
      }
    )
    .get("/users/me", async ({ authenticate, db }) => {
      const user = await authenticate();
      if (!user) return { error: "Unauthorized" };

      try {
        const result = await db.query(
          "SELECT id, username, email FROM users WHERE id = $1",
          [user.id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Error fetching user:", error);
        return {
          status: 500,
          message: "Internal Server Error",
        };
      }
    })
    .post("/seed", async ({ db, authenticate }) => {
      const user = await authenticate();
      if (!user) return { error: "Unauthorized" };

      console.log("Seeding database with test data for user", user.id);

      const client = await db.connect();

      try {
        await client.query("BEGIN");

        const insertTriggerQuery = `
        INSERT INTO triggers (user_id, trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name, intensity) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`;

        for (let i = 0; i < 10; i++) {
          await client.query(insertTriggerQuery, [
            user.id,
            faker.lorem.sentence(),
            faker.lorem.paragraph(),
            JSON.stringify([faker.lorem.words(3), faker.lorem.words(3)]),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.word(),
            faker.number.int({ min: 1, max: 10 }),
          ]);
        }

        await client.query("COMMIT");

        return { message: "Database seeded successfully" };
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    })
    .get(
      "/triggers",
      async ({ db, query, authenticate }) => {
        const user = await authenticate();
        if (!user) return { error: "Unauthorized" };

        const limit = query.limit ?? 10;
        console.log("Fetching triggers with limit", limit);

        try {
          const result = await db.query(
            `
            SELECT * FROM triggers
            WHERE user_id = $1
            AND trigger_event IS NOT NULL
            AND factual_description IS NOT NULL
            AND emotions IS NOT NULL
            AND meaning IS NOT NULL
            AND past_relationship IS NOT NULL
            AND trigger_name IS NOT NULL
            AND intensity IS NOT NULL
            ORDER BY id DESC
            LIMIT $2
          `,
            [user.id, limit]
          );

          return result.rows;
        } catch (error) {
          console.error("Error fetching triggers:", error);
          return {
            status: 500,
            message: "Internal Server Error",
          };
        }
      },
      {
        query: t.Object({
          limit: t.Optional(t.Numeric()),
        }),
      }
    )
    .post(
      "/triggers",
      async ({ db, body, authenticate }) => {
        const user = await authenticate();
        if (!user) return { error: "Unauthorized" };

        console.log("Posting new trigger", body);

        const insertTriggerQuery = `
        INSERT INTO triggers (user_id, trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name, intensity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

        try {
          const result = await db.query(insertTriggerQuery, [
            user.id,
            body.triggerEvent,
            body.factualDescription,
            JSON.stringify(body.emotions),
            body.meaning,
            body.pastRelationship,
            body.triggerName,
            body.intensity,
          ]);

          return result.rows[0];
        } catch (error) {
          console.error("Error inserting trigger:", error);
          return {
            status: 500,
            message: "Internal Server Error",
          };
        }
      },
      {
        body: t.Object({
          triggerEvent: t.String(),
          factualDescription: t.String(),
          emotions: t.Array(t.String()),
          meaning: t.String(),
          pastRelationship: t.String(),
          triggerName: t.String(),
          intensity: t.Number(),
        }),
      }
    )
    .get("/triggers/:id", async ({ db, params, authenticate }) => {
      const user = await authenticate();
      if (!user) return { error: "Unauthorized" };

      console.log("Fetching trigger with id", params.id);

      try {
        const result = await db.query(
          `
          SELECT * FROM triggers WHERE id = $1 AND user_id = $2
        `,
          [params.id, user.id]
        );

        return result.rows[0];
      } catch (error) {
        console.error("Error fetching trigger:", error);
        return {
          status: 500,
          message: "Internal Server Error",
        };
      }
    })
    .delete(
      "/triggers/:id",
      async ({ db, params, authenticate }) => {
        const user = await authenticate();
        if (!user) return { error: "Unauthorized" };

        console.log("Deleting trigger with id", params.id);

        try {
          const result = await db.query(
            `
            DELETE FROM triggers WHERE id = $1 AND user_id = $2
            RETURNING *
          `,
            [params.id, user.id]
          );

          return result.rows[0];
        } catch (error) {
          console.error("Error deleting trigger:", error);
          return {
            status: 500,
            message: "Internal Server Error",
          };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )
    .patch(
      "/triggers/:id",
      async ({ db, params, body, authenticate }) => {
        const user = await authenticate();
        if (!user) return { error: "Unauthorized" };

        console.log("Updating trigger with id", params.id, body);
        const updateTriggerQuery = `
        UPDATE triggers
        SET trigger_event = COALESCE($1, trigger_event),
            factual_description = COALESCE($2, factual_description),
            emotions = COALESCE($3, emotions),
            meaning = COALESCE($4, meaning),
            past_relationship = COALESCE($5, past_relationship),
            trigger_name = COALESCE($6, trigger_name),
            intensity = COALESCE($7, intensity)
        WHERE id = $8 AND user_id = $9
        RETURNING *`;
        try {
          const result = await db.query(updateTriggerQuery, [
            body.triggerEvent,
            body.factualDescription,
            body.emotions ? JSON.stringify(body.emotions) : null,
            body.meaning,
            body.pastRelationship,
            body.triggerName,
            body.intensity,
            params.id,
            user.id,
          ]);

          return result.rows[0];
        } catch (error) {
          console.error("Error updating trigger:", error);
          return {
            status: 500,
            message: "Internal Server Error",
          };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          triggerEvent: t.Optional(t.String()),
          factualDescription: t.Optional(t.String()),
          emotions: t.Optional(t.Array(t.String())),
          meaning: t.Optional(t.String()),
          pastRelationship: t.Optional(t.String()),
          triggerName: t.Optional(t.String()),
          intensity: t.Optional(t.Number()),
        }),
      }
    )
    .listen(port);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
};

serverSetup().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
