import {TaskEntity} from "../../entity/task.entity";

export function TaskToResponse(task: TaskEntity): any {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    status: task.status,
    due: task.dueDate
  };
}
