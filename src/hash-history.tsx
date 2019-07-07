export interface IRouterHistory {
  listen(fn: (path: string) => void): () => void;
  getDefaultValue(): string;
}

export class HashHistory implements IRouterHistory {
  getDefaultValue() {
    return location.hash.replace('#/', '/');
  }

  listen(fn: (path: string) => void): () => void {
    const callback = () => fn(location.hash.replace('#/', '/'));
    window.addEventListener('hashchange', callback);
    return () => {
      window.removeEventListener('hashchange', callback);
    };
  }

}
