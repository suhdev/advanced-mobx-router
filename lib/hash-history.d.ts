export declare class HashHistory implements Router.IRouterHistory {
    getDefaultValue(): string;
    listen(fn: (path: string) => void): () => void;
}
