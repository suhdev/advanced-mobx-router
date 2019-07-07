"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_observer_hook_1 = require("mobx-observer-hook");
const utilities_1 = require("./utilities");
// tslint:disable-next-line: variable-name
const RouterContext = React.createContext(null);
const RouterPathContext = React.createContext(null);
function useRouter() {
    return React.useContext(RouterContext);
}
exports.useRouter = useRouter;
// tslint:disable-next-line: variable-name
exports.RouteContext = React.createContext(null);
function useRouteParams() {
    const params = React.useContext(exports.RouteContext);
    return params;
}
exports.useRouteParams = useRouteParams;
function InnerRoute({ children, onExit, onEnter, routeDef }) {
    const router = React.useContext(RouterContext);
    React.useEffect(() => {
        onEnter && onEnter(router);
        return () => {
            onExit && onExit(router);
        };
    }, [router, onEnter, onExit]);
    return React.createElement(exports.RouteContext.Provider, { value: routeDef.getParams(router.path) }, children);
}
function Route({ path, onEnter, onExit, isExact, children }) {
    const currentPath = React.useContext(RouterPathContext);
    const [routeDef] = React.useState(() => utilities_1.parsePath(path, isExact));
    const [isActive, setActive] = React.useState(() => {
        routeDef.regex.lastIndex = 0;
        return routeDef.regex.test(currentPath);
    });
    React.useEffect(() => {
        routeDef.regex.lastIndex = 0;
        setActive(routeDef.regex.test(currentPath));
    }, [currentPath]);
    return isActive ? React.createElement(InnerRoute, { onExit: onExit, routeDef: routeDef, onEnter: onEnter }, children) : null;
}
exports.Route = Route;
function BrowserRouter({ router, children }) {
    return mobx_observer_hook_1.useObserver(() => React.createElement(RouterContext.Provider, { value: router },
        React.createElement(RouterPathContext.Provider, { value: router.path }, children)), [router]);
}
exports.BrowserRouter = BrowserRouter;
