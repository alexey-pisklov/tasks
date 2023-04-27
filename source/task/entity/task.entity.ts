import {v4 as uuid} from "uuid";
import {TaskStatus} from "./task-status.enum";

export class TaskEntity {
  public id: string = uuid();
  public name: string;
  public description: string;
  public status: TaskStatus;
  public dueDate: Date;

  public constructor(name: string = "", description: string = "", due: Date = new Date()) {
    this.name = name;
    this.description = description;
    this.dueDate = due;
    this.status = TaskStatus.IN_PROGRESS;
  }
}

