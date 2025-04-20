import Database from "bun:sqlite";

import { migrate, getMigrations } from "bun-sqlite-migrations";

export const createDb = () => {
  console.log("Creating database");
  const db = new Database("trigger-tracking.db");
  migrate(db, getMigrations("./migrations"));
  return db;
};
