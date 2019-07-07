import { computed, observable, reaction } from 'mobx';

export function checkRoute(
  path: string,
  { regex, paramsList }: Router.IRouteDef): { [idx: string]: string } {
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

class RouteDef implements Router.IRouteDef {
  @observable.ref router: Router.IRouter = null;
  @observable path: string = '';
  @observable isExact: boolean = false;
  prevParams: {} = {};

  constructor(router: Router.IRouter, path: string, isExact: boolean = false) {
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
  router: Router.IRouter,
  path: string,
  isExact: boolean = false): Router.IRouteDef {
  const params = [];

  let newPath = path.replace(/:([^/]+)/gi, (_, firstGroup) => {
    params.push(firstGroup);
    return '([^/]+)';
  });

  newPath = `^${newPath}${isExact ? '$' : '.*'}`;

  return new RouteDef(router, path, isExact);
}
