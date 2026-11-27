// Deliberately unsafe cache consistency example for PR-Norms.
type Cache = { get(key: string): Promise<string | null>; set(key: string, value: string): Promise<void> };
export async function updateTaskUnsafe(id: number, title: string, save: (id: number, title: string) => Promise<void>, cache: Cache) {
  await save(id, title);
  await cache.set("task:" + id, title);
}
export async function deleteTaskUnsafe(id: number, remove: (id: number) => Promise<void>) {
  await remove(id);
}
