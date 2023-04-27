import {IsNotEmpty, IsUUID} from "class-validator";

export class RemoveTaskCommand {
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  public constructor(id: string = "") {
    this.id = id;
  }
}
