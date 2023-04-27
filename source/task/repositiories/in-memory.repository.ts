import {TaskRepository} from "../task.repository";
import {TaskEntity} from "../entity/task.entity";
import {v4 as uuid} from "uuid";
import {NotFoundError} from "../not-found.error";

export class InMemoryRepository implements TaskRepository {

  private tasks: Map<string, TaskEntity> = new Map<string, TaskEntity>();


  public async create(task: TaskEntity): Promise<TaskEntity> {
    task.id = uuid();
    this.tasks.set(task.id, task);
    return task;
  }

  public async get(): Promise<TaskEntity[]> {
    return Array.from(this.tasks.values());
  }

  public async getById(id: string): Promise<TaskEntity> {
    if (this.tasks.has(id) === false) {
      throw new NotFoundError(404, "x-404", "Not found",[`Cannot find task with id: ${id}`]);
    }
    return this.tasks.get(id)!;
  }

  public async removeById(id: string): Promise<TaskEntity> {
    if (this.tasks.has(id)) {
      const task: TaskEntity = this.tasks.get(id)!;
      this.tasks.delete(task.id);
      return task;
    } else {
      throw new NotFoundError(404, "x-404", "Not found",[`Cannot find task with id: ${id}`]);
    }
  }

  public async save(task: TaskEntity): Promise<TaskEntity> {
    if (this.tasks.has(task.id) === false) {
      throw new NotFoundError(404, "x-404", "Not found",[`Cannot find task with id: ${task.id}`]);
    }
    this.tasks.set(task.id, task);
    return task;
  }
}
