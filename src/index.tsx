import * as React from 'react';

import { useObserver } from 'mobx-observer-hook';
import { parsePath } from './utilities';

// tslint:disable-next-line: variable-name
const RouterContext = React.createContext<Router.IRouter>(null);

export interface IInnerRouteProps {
  onEnter?: (router: Router.IRouter) => void;
  onExit?: (router: Router.IRouter) => void;
  routeDef?: Router.IRouteDef;
  params?: any;
  children: React.ReactNode;
}

export interface IRouteProps extends IInnerRouteProps {
  path: string;
  isExact?: boolean;
}

export function useRouter() {
  return React.useContext(RouterContext);
}

// tslint:disable-next-line: variable-name
export const RouteContext = React.createContext<{}>(null);

export function useRouteParams() {
  const params = React.useContext(RouteContext);
  return params;
}

function InnerRoute({ children, onExit, onEnter, params }: IInnerRouteProps) {
  const router = React.useContext(RouterContext);

  React.useEffect(
    () => {
      onEnter && onEnter(router);
      return () => {
        onExit && onExit(router);
      };
    },
    [router, onEnter, onExit]);

  return <RouteContext.Provider value={params}>{children}</RouteContext.Provider>;
}

export function Route({ path, onEnter, onExit, isExact, children }: IRouteProps) {
  const router = React.useContext(RouterContext);
  const [routeDef] = React.useState(() => parsePath(router, path, isExact));

  return useObserver(
    () => routeDef.params ? <InnerRoute
      onExit={onExit}
      params={routeDef.params}
      onEnter={onEnter}>
      {children}</InnerRoute> : null,
    [router, routeDef]);
}

export function BrowserRouter({ router, children }: {
  router: Router.IRouter,
  children: React.ReactNode,
}) {
  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>;
}
