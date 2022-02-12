import { Module } from "./module.interface";

export interface Flow {
    _id: string,
    name: string,
    description: string,
    assistant: string,
    sorted: { type: Boolean, required: true },
    image_url: string,
    image_id: string,
    createdAt: string,
    updatedAt: string,
    modules?: Module[]
  }