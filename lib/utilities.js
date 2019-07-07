"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
function checkRoute(path, { regex, paramsList }) {
    regex.lastIndex = 0;
    const data = path.match(regex);
    if (!data) {
        return null;
    }
    return paramsList.map((e, i) => data[i + 1])
        .reduce((prev, curr, idx) => {
        prev[paramsList[idx]] = curr;
        return prev;
    }, {});
}
exports.checkRoute = checkRoute;
class RouteDef {
    constructor(path, isExact = false) {
        this.path = '';
        this.isExact = false;
        this.prevParams = {};
        this.path = path;
        this.isExact = isExact;
    }
    get regex() {
        let newPath = this.path.replace(/:([^/]+)/gi, (_, firstGroup) => {
            return '([^/]+)';
        });
        newPath = `^${newPath}${this.isExact ? '$' : '.*'}`;
        return new RegExp(newPath, 'ig');
    }
    get paramsList() {
        const params = [];
        this.path.replace(/:([^/]+)/gi, (_, firstGroup) => {
            params.push(firstGroup);
            return '([^/]+)';
        });
        return params;
    }
    getParams(routerPath) {
        const newParams = checkRoute(routerPath, this);
        if (!newParams || !this.prevParams) {
            return this.prevParams = newParams;
        }
        for (const key in newParams) {
            if (Object.prototype.hasOwnProperty.call(newParams, key)) {
                if (newParams[key] !== this.prevParams[key]) {
                    return this.prevParams = newParams;
                }
            }
        }
        return this.prevParams;
    }
}
__decorate([
    mobx_1.observable
], RouteDef.prototype, "path", void 0);
__decorate([
    mobx_1.observable
], RouteDef.prototype, "isExact", void 0);
__decorate([
    mobx_1.computed
], RouteDef.prototype, "regex", null);
__decorate([
    mobx_1.computed
], RouteDef.prototype, "paramsList", null);
function parsePath(path, isExact = false) {
    const params = [];
    let newPath = path.replace(/:([^/]+)/gi, (_, firstGroup) => {
        params.push(firstGroup);
        return '([^/]+)';
    });
    newPath = `^${newPath}${isExact ? '$' : '.*'}`;
    return new RouteDef(path, isExact);
}
exports.parsePath = parsePath;
