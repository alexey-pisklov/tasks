import { RequestHandler, Express } from "express";
import { DependencyContainer, InjectionToken } from "tsyringe";

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
  ALL = "all"
}

const ControllersRegistry = new Array<Function>();

export interface ControllerInfo {
  route: string
}

export interface ActionInfo {
  route: string,
  method: HttpMethod,
  middlewares?: RequestHandler[]
}

export const EXPRESS_CONTROLLER = Symbol.for("express:controller");
export const EXPRESS_ACTION = Symbol.for("express:action");

export function Controller(info: ControllerInfo): Function {
  return function(target: Function) {
    // injectable()(<any> target);
    Reflect.defineMetadata(EXPRESS_CONTROLLER, info, target)
    if (ControllersRegistry.indexOf(target) != -1) {
      ControllersRegistry.push(target);
    }
  }
}

export function Action(info: ActionInfo): Function {
  return function(target: any, propertyKey: string) {
    if (target.constructor) {
      Reflect.defineMetadata(EXPRESS_ACTION, info, target.constructor, propertyKey);
    }
  }
}

function _join_routes(...routes: string[]): string {
  let route = "";
  routes.forEach( r => route = route + "/" + r.trim().replace(/^\//, '').replace(/\/$/, ''));
  return route;
}

export function attachController(app: Express, di: DependencyContainer, controllers: Function[] = []) {
  if (controllers.length == 0) {
    controllers = ControllersRegistry;
  }
  controllers.forEach( controller => {
    let controllerInfo: ControllerInfo = Reflect.getMetadata(EXPRESS_CONTROLLER, controller);
    if (!controllerInfo) return; // Pass to next controller
    let instance = di.resolve(<InjectionToken<any>> controller);
    // Get all methods from the controller
    let controllerMethods = Object.getOwnPropertyNames(controller.prototype);
    controllerMethods.forEach( actionKey => {
      let actionInfo: ActionInfo = Reflect.getMetadata(EXPRESS_ACTION, controller, actionKey);
      if (!actionInfo) return; // pass to next method

      // Attach to controller
      let route = _join_routes(controllerInfo.route, actionInfo.route);
      if (actionInfo.middlewares) {
        app[actionInfo.method](route, ...actionInfo.middlewares, (req, res, next) => instance[actionKey](req, res, next));
      } else {
        app[actionInfo.method](route, (req, res, next) => instance[actionKey](req, res, next));
      }
    })
  })
}
