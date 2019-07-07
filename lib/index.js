"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_observer_hook_1 = require("mobx-observer-hook");
const utilities_1 = require("./utilities");
// tslint:disable-next-line: variable-name
const RouterContext = React.createContext(null);
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
    return mobx_observer_hook_1.useObserver(() => React.createElement(exports.RouteContext.Provider, { value: routeDef.params }, children), [
        routeDef
    ]);
}
function Route({ path, onEnter, onExit, isExact, children }) {
    const router = React.useContext(RouterContext);
    const [routeDef] = React.useState(() => utilities_1.parsePath(router, path, isExact));
    return mobx_observer_hook_1.useObserver(() => routeDef.isActive ? React.createElement(InnerRoute, { onExit: onExit, routeDef: routeDef, onEnter: onEnter }, children) : null, [router, routeDef]);
}
exports.Route = Route;
function BrowserRouter({ router, children }) {
    return React.createElement(RouterContext.Provider, { value: router }, children);
}
exports.BrowserRouter = BrowserRouter;
