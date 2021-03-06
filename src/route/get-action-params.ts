import { getCookies, ServerRequest } from '../package.ts';

type Route = {
  actionName: string;
  params: any[], // TODO define type
  routeParams?: {[key: string]: any}
}

type ArgumentValue = any;

/**
 * Gets action params for routes 
 * @param req 
 * @param res 
 * @param route 
 */
export async function getActionParams(
  req: ServerRequest,
  res: any,
  route: Route
  ): Promise<ArgumentValue[]> {

  const args: ArgumentValue[] = [];
  
  // const body 
  const queryParams = findSearchParams(req.url);
  const cookies = getCookies(req) || {};
  const params = route.params.sort((a, b) => a.index - b.index);

  // fill params to resolve
  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    switch (param.type) {
      case 'query':
        if(queryParams){
          const paramsArgs = queryParams.get(param.name);

          if(paramsArgs) {
            args.push(paramsArgs)
          }
        } else {
          args.push(undefined);
        }
        break;

      case 'cookie':
        args.push(cookies[param.name]);
        break;

      case 'body':
        // TODO: if content type json, form, etc...
        let body = await Deno.readAll(req.body);
        const bodyString = new TextDecoder("utf-8").decode(body);
        try {
          body = JSON.parse(bodyString);
        } catch (error) {
        }
        args.push(body);
        break;

      case 'request':
        args.push(req);
        break;

      case 'response':
        args.push(res);
        break;

      case 'route-param':
          if(route.routeParams){
            args.push(route.routeParams[param.name]);
          } else {
            args.push(undefined);
          }
          break;

      default:
        args.push(undefined);
        break;
    }
  }
  return new Promise(res => res(args));
}
/**
 * Finds query search params from full url
 * @param url 
 */
function findSearchParams(url: string): URLSearchParams | undefined {
  if (url == undefined) return undefined;

  const searchs = url.split('?')[1];

  if (searchs == undefined) return undefined;

  return new URLSearchParams(searchs);
}
