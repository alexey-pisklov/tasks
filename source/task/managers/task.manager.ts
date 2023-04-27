import {TaskEntity} from "../entity/task.entity";
import {CreateTaskCommand} from "./commands/create-task.command";
import {TaskRepository} from "../task.repository";
import {inject, injectable} from "tsyringe";
import {RemoveTaskCommand} from "./commands/remove-task.command";
import {UpdateTaskCommand} from "./commands/update-task.command";
import {validateOrReject} from "class-validator";
import {TaskStatus} from "../entity/task-status.enum";

@injectable()
export class TaskManager {
  private taskRepository: TaskRepository;

  public constructor(@inject("TaskRepository") repository: TaskRepository) {
    this.taskRepository = repository;
  }


  public async createNewTask(command: CreateTaskCommand): Promise<TaskEntity> {
    await validateOrReject(command);

    const task = new TaskEntity();
    task.name = command.name;
    task.description = command.description;
    task.dueDate = command.due;
    task.status = TaskStatus.IN_PROGRESS;

    return this.taskRepository.create(task);
  }

  public async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.get();
  }

  public async removeTask(command: RemoveTaskCommand): Promise<TaskEntity> {
    await validateOrReject(command);

    return this.taskRepository.removeById(command.id);
  }

  public async updateTask(command: UpdateTaskCommand): Promise<TaskEntity> {
    await validateOrReject(command);

    const task = await this.taskRepository.getById(command.id);
    task.name = command.name;
    task.description = command.description;

    return this.taskRepository.save(task);
  }
}
