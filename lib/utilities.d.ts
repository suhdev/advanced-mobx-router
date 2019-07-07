import { IRouter } from './irouter';
export interface IRouteDef {
    params: {};
    paramsList: string[];
    regex: RegExp;
    dataParams?: {};
}
export declare function checkRoute(path: string, { regex, paramsList }: IRouteDef): {
    [idx: string]: string;
};
export declare function parsePath(router: IRouter, path: string, isExact?: boolean): IRouteDef;
