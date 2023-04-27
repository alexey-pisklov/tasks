import {IsDate, IsNotEmpty} from "class-validator";

export class CreateTaskCommand {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public description: string;

  @IsNotEmpty()
  @IsDate()
  public due: Date;

  public constructor(name: string = "", description: string = "", due: Date = new Date()) {
    this.name = name;
    this.description = description;
    this.due = due;
  }
}
