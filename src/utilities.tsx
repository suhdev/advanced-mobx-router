import { computed, observable } from 'mobx';
import { IRouter } from './irouter';

export interface IRouteDef {
  params: {};
  paramsList: string[];
  regex: RegExp;
  dataParams?: {};
}

export function checkRoute(
  path: string,
  { regex, paramsList }: IRouteDef): { [idx: string]: string } {
  regex.lastIndex = 0;
  const data = path.match(regex);
  if (!data) {
    return null;
  }
  return paramsList.map((e, i) => data[i + 1])
    .reduce(
      (prev, curr, idx) => {
        prev[paramsList[idx]] = curr;
        return prev;
      },
      {});
}

class RouteDef implements IRouteDef {
  @observable.ref router: IRouter = null;
  @observable path: string = '';
  @observable isExact: boolean = false;
  prevParams: {} = {};

  constructor(router: IRouter, path: string, isExact: boolean = false) {
    this.router = router;
    this.path = path;
    this.isExact = isExact;

  }

  @computed get regex() {
    let newPath = this.path.replace(/:([^/]+)/gi, (_, firstGroup) => {
      return '([^/]+)';
    });

    newPath = `^${newPath}${this.isExact ? '$' : '.*'}`;
    return new RegExp(newPath);
  }

  @computed get paramsList() {
    const params: string[] = [];
    this.path.replace(/:([^/]+)/gi, (_, firstGroup) => {
      params.push(firstGroup);
      return '([^/]+)';
    });
    return params;
  }

  @computed get params() {
    const newParams = checkRoute(this.router.path, this);
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

export function parsePath(
  router: IRouter,
  path: string,
  isExact: boolean = false): IRouteDef {
  const params = [];

  let newPath = path.replace(/:([^/]+)/gi, (_, firstGroup) => {
    params.push(firstGroup);
    return '([^/]+)';
  });

  newPath = `^${newPath}${isExact ? '$' : '.*'}`;

  return new RouteDef(router, path, isExact);
}
