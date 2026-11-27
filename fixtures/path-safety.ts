// Deliberately unsafe path handling examples for PR-Norms.
import path from "node:path";
import fs from "node:fs/promises";
export async function readUserFileUnsafe(root: string, supplied: string): Promise<string> {
  const target = path.join(root, supplied);
  return fs.readFile(target, "utf8");
}
