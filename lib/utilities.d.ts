export interface IRouteDef {
    paramsList: string[];
    regex: RegExp;
    dataParams?: {};
    getParams(path: string): any;
}
export declare function checkRoute(path: string, { regex, paramsList }: IRouteDef): {
    [idx: string]: string;
};
export declare function parsePath(path: string, isExact?: boolean): IRouteDef;
