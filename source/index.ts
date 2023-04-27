import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { attachController } from "./decorators";

import {TaskController} from "./task/controllers/task.controller";
import {TaskRepository} from "./task/task.repository";
import {InMemoryRepository} from "./task/repositiories/in-memory.repository";
import {NotFoundError} from "./task/not-found.error";
import {ValidationError} from "class-validator";


container.register("TaskRepository", {
  useClass: InMemoryRepository
});

const app = express();
app.use(express.json());

attachController(app, container, [TaskController]);

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({
      error: error.error,
      message: error.message,
      details: error.details,
    });
  } else if (error instanceof Array<ValidationError>) {
    return res.status(422).json({
      error: "x-422",
      message: "Validation error",
      details: error,
    });
  } else {
    return res.status(500).json({
      error: "x-500",
      message: "Unknown server error",
      details: [error.name, error.message, error.stack],
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on 3000 port");
});
