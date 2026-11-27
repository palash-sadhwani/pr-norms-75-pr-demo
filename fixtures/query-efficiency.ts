// Deliberately inefficient data access for PR-Norms.
type User = { id: number };
declare function listUsers(): Promise<User[]>;
declare function loadTasks(userId: number): Promise<unknown[]>;
export async function allTasksUnsafe() {
  const users = await listUsers();
  const result = [];
  for (const user of users) {
    result.push(...await loadTasks(user.id));
  }
  return result;
}
