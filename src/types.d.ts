declare module Router {
  export interface IRouterHistory {
    listen(fn: (path: string) => void): () => void;
    getDefaultValue(): string;
  }

  export interface IRouter {
    path: string;
  }

  export interface IRouteDef {
    params: {};
    paramsList: string[];
    regex: RegExp;
    dataParams?: {};
  }
}
