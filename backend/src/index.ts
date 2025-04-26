import { Elysia, t } from "elysia";
import { createDb } from "./db";
import { faker } from "@faker-js/faker";
import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import swagger from "@elysiajs/swagger";

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
    .decorate("db", db)
    .get("/ping", () => "pong")
    .get("/", () => "Hello Elysia")
    .post("/seed", async ({ db }) => {
      console.log("Seeding database with test data");

      const client = await db.connect();

      try {
        await client.query("BEGIN");

        const insertTriggerQuery = `
        INSERT INTO triggers (trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name, intensity) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`;

        for (let i = 0; i < 10; i++) {
          await client.query(insertTriggerQuery, [
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
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    })
    .get(
      "/triggers",
      async ({ db, query }) => {
        const limit = query.limit ?? 10;
        console.log("Fetching triggers with limit", limit);

        try {
          const result = await db.query(
            `
          SELECT * FROM triggers
          WHERE trigger_event IS NOT NULL
          AND factual_description IS NOT NULL
          AND emotions IS NOT NULL
          AND meaning IS NOT NULL
          AND past_relationship IS NOT NULL
          AND trigger_name IS NOT NULL
          AND intensity IS NOT NULL
          ORDER BY id DESC
          LIMIT $1
        `,
            [limit]
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
      async ({ db, body }) => {
        console.log("Posting new trigger", body);

        const insertTriggerQuery = `
        INSERT INTO triggers (trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name, intensity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;

        try {
          const result = await db.query(insertTriggerQuery, [
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
    .get("/triggers/:id", async ({ db, params }) => {
      console.log("Fetching trigger with id", params.id);

      try {
        const result = await db.query(
          `
        SELECT * FROM triggers WHERE id = $1
      `,
          [params.id]
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
      async ({ db, params }) => {
        console.log("Deleting trigger with id", params.id);

        try {
          const result = await db.query(
            `
          DELETE FROM triggers WHERE id = $1
          RETURNING *
        `,
            [params.id]
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
      async ({ db, params, body }) => {
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
      WHERE id = $8
      RETURNING *`;
        try {
          const result = await db.query(updateTriggerQuery, [
            body.triggerEvent,
            body.factualDescription,
            JSON.stringify(body.emotions),
            body.meaning,
            body.pastRelationship,
            body.triggerName,
            body.intensity,
            params.id,
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
    // .get("/user/:id", async ({ db, params }) => {
    //   console.log("Fetching user with id", params.id);
    //   try {
    //     const result = await db.query(
    //       `
    //       SELECT * FROM users WHERE id = $1
    //     `,
    //       [params.id]
    //     );
    //     return result.rows[0];
    //   } catch (error) {
    //     console.error("Error fetching user:", error);
    //     return {
    //       status: 500,
    //       message: "Internal Server Error",
    //     };
    //   }
    // })
    // .post("/user", async ({ db, body }) => {
    //   console.log("Posting new user", body);
    //   const insertUserQuery = `
    //     INSERT INTO users (username, email, password)
    //     VALUES ($1, $2, $3)
    //     RETURNING *`;
    //   try {
    //     const result = await db.query(insertUserQuery, [
    //       body.username,
    //       body.email,
    //       body.password,
    //     ]);
    //     return result.rows[0];
    //   } catch (error) {
    //     console.error("Error inserting user:", error);
    //     return {
    //       status: 500,
    //       message: "Internal Server Error",
    //     };
    //   }
    // })
    .listen(port);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
};

serverSetup().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
