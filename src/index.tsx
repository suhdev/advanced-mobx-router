import * as React from 'react';

import { useObserver } from 'mobx-observer-hook';
import { parsePath, IRouteDef } from './utilities';
import { IRouter } from './irouter';
import { reaction } from 'mobx';

// tslint:disable-next-line: variable-name
const RouterContext = React.createContext<IRouter>(null);
const RouterPathContext = React.createContext<string>(null);

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

export function useRouter() {
  return React.useContext(RouterContext);
}

// tslint:disable-next-line: variable-name
export const RouteContext = React.createContext<{}>(null);

export function useRouteParams() {
  const params = React.useContext(RouteContext);
  return params;
}

function InnerRoute({ children, onExit, onEnter, routeDef }: IInnerRouteProps) {
  const router = React.useContext(RouterContext);

  React.useEffect(
    () => {
      onEnter && onEnter(router);
      return () => {
        onExit && onExit(router);
      };
    },
    [router, onEnter, onExit]);

  return <RouteContext.Provider
    value={routeDef.getParams(router.path)}>{children}</RouteContext.Provider>
}

export function Route({ path, onEnter, onExit, isExact, children }: IRouteProps) {
  const currentPath = React.useContext(RouterPathContext);
  const [routeDef] = React.useState(() => parsePath(path, isExact));
  const [isActive, setActive] = React.useState(() => {
    routeDef.regex.lastIndex = 0;
    return routeDef.regex.test(currentPath);
  });

  React.useEffect(() => {
    routeDef.regex.lastIndex = 0;
    setActive(routeDef.regex.test(currentPath));
  }, [currentPath]);


  return isActive ? <InnerRoute
    onExit={onExit}
    routeDef={routeDef}
    onEnter={onEnter}>
    {children}</InnerRoute> : null
}

export function BrowserRouter({ router, children }: {
  router: IRouter,
  children: React.ReactNode,
}) {
  return useObserver(() => <RouterContext.Provider value={router}>
    <RouterPathContext.Provider value={router.path}>
      {children}
    </RouterPathContext.Provider>
  </RouterContext.Provider>, [router]);
}
