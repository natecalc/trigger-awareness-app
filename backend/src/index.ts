import { Elysia, t } from "elysia";
import { createDb } from "./db";
import { faker } from "@faker-js/faker";
import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import swagger from "@elysiajs/swagger";

dotenv.config({ path: "../.env" });

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const port = process.env.PORT || 3000;

const serverSetup = async () => {
  const db = await createDb();

  const app = new Elysia()
    .use(swagger())
    .use(
      cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
        INSERT INTO triggers (trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`;

        for (let i = 0; i < 10; i++) {
          await client.query(insertTriggerQuery, [
            faker.lorem.sentence(),
            faker.lorem.paragraph(),
            JSON.stringify([faker.lorem.words(3), faker.lorem.words(3)]),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.word(),
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

        const result = await db.query(
          `
        SELECT * FROM triggers
        WHERE trigger_event IS NOT NULL
        AND factual_description IS NOT NULL
        AND emotions IS NOT NULL
        AND meaning IS NOT NULL
        AND past_relationship IS NOT NULL
        AND trigger_name IS NOT NULL
        ORDER BY id DESC
        LIMIT $1
      `,
          [limit]
        );

        if (!result.rows || result.rows.length === 0) {
          return {
            status: 404,
            message: "Triggers not found",
          };
        }

        return result.rows;
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
        INSERT INTO triggers (trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

        const result = await db.query(insertTriggerQuery, [
          body.triggerEvent,
          body.factualDescription,
          JSON.stringify(body.emotions),
          body.meaning,
          body.pastRelationship,
          body.triggerName,
        ]);

        if (!result.rows || result.rows.length === 0) {
          return {
            status: 404,
            message: "Cannot create trigger",
          };
        }

        return result.rows[0];
      },
      {
        body: t.Object({
          triggerEvent: t.String(),
          factualDescription: t.String(),
          emotions: t.Array(t.String()),
          meaning: t.String(),
          pastRelationship: t.String(),
          triggerName: t.String(),
        }),
      }
    )
    .get("/triggers/:id", async ({ db, params }) => {
      console.log("Fetching trigger with id", params.id);

      const result = await db.query(
        `
      SELECT * FROM triggers WHERE id = $1
    `,
        [params.id]
      );

      if (!result.rows || result.rows.length === 0) {
        return {
          status: 404,
          message: "Trigger not found",
        };
      }

      return result.rows[0];
    })
    .delete(
      "/triggers/:id",
      async ({ db, params }) => {
        console.log("Deleting trigger with id", params.id);

        const result = await db.query(
          `
        DELETE FROM triggers WHERE id = $1
        RETURNING *
      `,
          [params.id]
        );

        if (!result.rows || result.rows.length === 0) {
          return {
            status: 404,
            message: "Cannot delete trigger",
          };
        }

        return result.rows[0];
      },
      {
        params: t.Object({
          id: t.String(),
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
