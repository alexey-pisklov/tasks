import {TaskEntity} from "./entity/task.entity";

export interface TaskRepository {
  create(task: TaskEntity): Promise<TaskEntity>
  removeById(id: string): Promise<TaskEntity>
  get(): Promise<TaskEntity[]>
  getById(id: string): Promise<TaskEntity>
  save(task: TaskEntity): Promise<TaskEntity>
}
