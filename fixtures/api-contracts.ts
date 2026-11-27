// Deliberately inconsistent API response examples for PR-Norms.
export function missingTask(response: any): void {
  response.status(200).json({ data: null });
}

export function deleteTask(response: any): void {
  response.status(204).json({ deleted: true });
}

export function validationFailure(response: any, message: string): void {
  response.status(400).json({ message });
}
