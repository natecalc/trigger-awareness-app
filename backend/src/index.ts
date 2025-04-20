import { Elysia, t } from "elysia";
import { createDb } from "./db";
import { faker } from "@faker-js/faker";

const app = new Elysia()
  .get("/ping", () => "pong")
  .decorate("db", createDb())
  .get("/", () => "Hello Elysia")
  .post("/seed", ({ db }) => {
    console.log("Seeding database with test data");

    const insertTriggerQuery = db.prepare(/* sql */ `
      INSERT INTO triggers ( trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name, ai_analysis, follow_up_questions, user_insights) VALUES (
        $trigger_event,
        $factual_description,
        $emotions,
        $meaning,
        $past_relationship,
        $trigger_name,
        $ai_analysis,
        $follow_up_questions,
        $user_insights
      ) RETURNING *
      `);
    for (let i = 0; i < 10; i++) {
      insertTriggerQuery.run({
        $trigger_event: faker.lorem.sentence(),
        $factual_description: faker.lorem.paragraph(),
        $emotions: faker.lorem.words(3),
        $meaning: faker.lorem.sentence(),
        $past_relationship: faker.lorem.sentence(),
        $trigger_name: faker.lorem.word(),
        $ai_analysis: faker.lorem.sentence(),
        $follow_up_questions: faker.lorem.sentence(),
        $user_insights: faker.lorem.sentence(),
      });
    }
  })
  .get(
    "/triggers",
    ({ db, query }) => {
      const limit = query.limit ?? 10;
      console.log("Fetching triggers with limit", limit);

      // TODO: Update sql
      const triggers = db
        .query(
          /* sql */ `
        SELECT * FROM triggers
        WHERE trigger_event IS NOT NULL
        AND factual_description IS NOT NULL
        AND emotions IS NOT NULL
        AND meaning IS NOT NULL
        AND past_relationship IS NOT NULL
        AND trigger_name IS NOT NULL
        AND ai_analysis IS NOT NULL
        AND follow_up_questions IS NOT NULL
        AND user_insights IS NOT NULL
        ORDER BY id DESC
        LIMIT $limit
        `
        )
        .all({
          $limit: limit,
        });

      if (!triggers) {
        return {
          status: 404,
          message: "Triggers not found",
        };
      }

      return triggers;
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
      }),
    }
  )
  .post(
    "/triggers",
    ({ db, body }) => {
      console.log("Posting new trigger", body);

      const insertTriggerQuery = db.prepare(/* sql */ `
       INSERT INTO triggers (trigger_event, factual_description, emotions, meaning, past_relationship, trigger_name, ai_analysis, follow_up_questions, user_insights) VALUES (
        $trigger_event,
        $factual_description,
        $emotions,
        $meaning,
        $past_relationship,
        $trigger_name,
        $ai_analysis,
        $follow_up_questions,
        $user_insights
      ) RETURNING *
        `);

      const insertTrigger = insertTriggerQuery.get({
        $trigger_event: body.trigger_event,
        $factual_description: body.factual_description,
        $emotions: body.emotions,
        $meaning: body.meaning,
        $past_relationship: body.past_relationship,
        $trigger_name: body.trigger_name,
        $ai_analysis: body.ai_analysis,
        $follow_up_questions: body.follow_up_questions,
        $user_insights: body.user_insights,
      });

      if (!insertTrigger) {
        return {
          status: 404,
          message: "Cannot create trigger",
        };
      }
      return insertTrigger;
    },
    {
      body: t.Object({
        trigger_event: t.String(),
        factual_description: t.String(),
        emotions: t.String(),
        meaning: t.String(),
        past_relationship: t.String(),
        trigger_name: t.String(),
        ai_analysis: t.String(),
        follow_up_questions: t.String(),
        user_insights: t.String(),
      }),
    }
  )
  .get("/triggers/:id", ({ db, params }) => {
    console.log("Fetching trigger with id", params.id);
    const trigger = db
      .query(
        /* sql */ `
        SELECT * FROM triggers WHERE id = $id
        `
      )
      .get({
        $id: params.id,
      });
    if (!trigger) {
      return {
        status: 404,
        message: "Trigger not found",
      };
    }
    return trigger;
  })
  .delete(
    "/triggers/:id",
    ({ db, params }) => {
      console.log("Deleting trigger with id", params.id);
      const deleteTriggerQuery = db.prepare(/* sql */ `
        DELETE FROM triggers WHERE id = $id
        `);

      const deleteTrigger = deleteTriggerQuery.run({
        $id: params.id,
      });

      if (!deleteTrigger) {
        return {
          status: 404,
          message: "Cannot delete trigger",
        };
      }
      return deleteTrigger;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
