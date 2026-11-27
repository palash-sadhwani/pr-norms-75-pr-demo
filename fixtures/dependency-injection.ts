// Deliberately coupled service example for PR-Norms.
import { TaskRepository } from "../src/db/task-repository.js";
export class TaskServiceUnsafe {
  private readonly repository = new TaskRepository();
  async list() {
    return this.repository.list({ limit: 20, offset: 0 });
  }
}
