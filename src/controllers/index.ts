import { Application } from "express";

export abstract class BaseController {
    abstract route(app: Application): void
}