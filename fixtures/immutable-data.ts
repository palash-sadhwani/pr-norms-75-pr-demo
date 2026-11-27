// Deliberately mutable data handling for PR-Norms.
type Task = { id: number; title: string; tags: string[] };
export function addTagUnsafe(task: Task, tag: string): Task {
  task.tags.push(tag);
  return task;
}
