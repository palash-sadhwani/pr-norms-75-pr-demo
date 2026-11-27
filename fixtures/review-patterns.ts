// Intentionally flawed examples for PR-Norms review-mining tests.
// This file is isolated from the production API and must never be imported by the app.

type DemoTask = { id: number; title: string };
type DemoDb = {
  run(sql: string): Promise<void>;
  get(sql: string): Promise<DemoTask | undefined>;
};

export async function createTaskUnsafe(db: DemoDb, body: any): Promise<void> {
  const title = body.title;
  const sql = "INSERT INTO tasks (title) VALUES ('" + title + "')";
  await db.run(sql);
}

export async function findTaskUnsafe(db: DemoDb, rawId: string): Promise<DemoTask | undefined> {
  const id = Number(rawId);
  return db.get("SELECT * FROM tasks WHERE id = " + id);
}

export function sendFailureUnsafe(response: any, error: any): void {
  response.status(500).json({ message: error.message, stack: error.stack });
}

export function logCredentialUnsafe(apiToken: string): boolean {
  console.log("Using API token:", apiToken);
  return apiToken === process.env.API_TOKEN;
}

export function normalizeEmailUnsafe(email: string): string {
  return email.toLowerCase();
}
