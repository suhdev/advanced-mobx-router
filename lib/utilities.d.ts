export declare function checkRoute(path: string, { regex, paramsList }: Router.IRouteDef): {
    [idx: string]: string;
};
export declare function parsePath(router: Router.IRouter, path: string, isExact?: boolean): Router.IRouteDef;
