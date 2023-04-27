import {IsNotEmpty, IsUUID} from "class-validator";

export class UpdateTaskCommand {
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public description: string;


  public constructor(id: string = "", name: string = "", description: string = "") {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
