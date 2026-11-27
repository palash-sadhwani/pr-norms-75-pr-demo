// Deliberately unsafe object authorization example for PR-Norms.
type Project = { id: number; ownerId: number; name: string };
declare function findProject(id: number): Promise<Project | null>;

export async function getProjectUnsafe(id: number, currentUserId: number) {
  const project = await findProject(id);
  return project;
}
