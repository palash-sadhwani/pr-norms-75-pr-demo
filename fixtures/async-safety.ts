// Deliberately unsafe asynchronous examples for PR-Norms.
export function saveLater(save: () => Promise<void>): void {
  save();
}

export async function refreshAll(refresh: () => Promise<void>[]): Promise<void> {
  const jobs = refresh();
  jobs.forEach((job) => job);
}
