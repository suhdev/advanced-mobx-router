import * as React from 'react';
import { IRouteDef } from './utilities';
import { IRouter } from './irouter';
export interface IInnerRouteProps {
    onEnter?: (router: IRouter) => void;
    onExit?: (router: IRouter) => void;
    routeDef?: IRouteDef;
    params?: any;
    children: React.ReactNode;
}
export interface IRouteProps extends IInnerRouteProps {
    path: string;
    isExact?: boolean;
}
export declare function useRouter(): IRouter;
export declare const RouteContext: React.Context<{}>;
export declare function useRouteParams(): {};
export declare function Route({ path, onEnter, onExit, isExact, children }: IRouteProps): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
export declare function BrowserRouter({ router, children }: {
    router: IRouter;
    children: React.ReactNode;
}): JSX.Element;
