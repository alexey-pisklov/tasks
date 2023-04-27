import express, {NextFunction} from "express";
import {injectable} from "tsyringe";
import {Action, Controller, HttpMethod} from "../../decorators";
import {TaskManager} from "../managers/task.manager";
import {TaskToResponse} from "./mappers/task.mapper";
import {CreateTaskCommand} from "../managers/commands/create-task.command";
import {TaskEntity} from "../entity/task.entity";
import {RemoveTaskCommand} from "../managers/commands/remove-task.command";
import {UpdateTaskCommand} from "../managers/commands/update-task.command";


@Controller({ route: "/tasks" })
@injectable()
export class TaskController {
  private taskManager: TaskManager;

  public constructor(manager: TaskManager) {
    this.taskManager = manager;
  }


  @Action({
    route: "/",
    method: HttpMethod.GET,
  })
  public async getAllTasks(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const tasks: TaskEntity[] = await this.taskManager.getAllTasks();


      res.status(200)
        .send(tasks.map(TaskToResponse));
    } catch (err) {
      next(err);
    }
  }

  @Action({
    route: "/",
    method: HttpMethod.POST,
  })
  public async createTask(req: express.Request, res: express.Response, next: NextFunction) {
    try {
    const createTaskCommand = new CreateTaskCommand();
    createTaskCommand.name = req.body.name;
    createTaskCommand.description = req.body.description;
    createTaskCommand.due = new Date(req.body.due);


    const task = await this.taskManager.createNewTask(createTaskCommand);


    res.status(201)
       .send(TaskToResponse(task));
    } catch (err) {
      next(err);
    }
  }

  @Action({
    route: "/:id",
    method: HttpMethod.DELETE,
  })
  public async removeTask(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const createTaskCommand = new RemoveTaskCommand();
      createTaskCommand.id = req.params.id;

      const task = await this.taskManager.removeTask(createTaskCommand);


      res.status(200)
        .send(TaskToResponse(task));
    } catch (err) {
      next(err);
    }
  }

  @Action({
    route: "/:id",
    method: HttpMethod.PUT,
  })
  public async updateTask(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const updateTaskCommand = new UpdateTaskCommand();
      updateTaskCommand.id = req.params.id;
      updateTaskCommand.name = req.body.name;
      updateTaskCommand.description = req.body.description;


      const task = await this.taskManager.updateTask(updateTaskCommand);


      res.status(200)
        .send(TaskToResponse(task));
    } catch (err) {
      next(err);
    }
  }
}
