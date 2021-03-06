import { getMetadataArgsStorage, container } from "../mod.ts";
import { getParamInfo } from '../injection/reflection-helpers.ts';
import { typeInfo } from '../injection/dependency-container.ts';

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed when request come.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 */
export function Controller(baseRoute?: string): Function {
    return function (object: any) {
        typeInfo.set(object, getParamInfo(object));
        getMetadataArgsStorage().controllers.push({
            type: "default",
            target: object,
            route: baseRoute
        });
    };
}