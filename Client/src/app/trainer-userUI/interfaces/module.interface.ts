import { Stage } from "./stage.interface";

export interface Module {
    _id: string,
    name: string,
    description: string,
    code: string,
    locked: boolean;
    sorted: boolean;
    stages: Stage[],
    image_url: string,
    image_id: string

    completed?: boolean;
  }