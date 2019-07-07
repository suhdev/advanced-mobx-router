export interface IRouterHistory {
    listen(fn: (path: string) => void): () => void;
    getDefaultValue(): string;
}
export declare class HashHistory implements IRouterHistory {
    getDefaultValue(): string;
    listen(fn: (path: string) => void): () => void;
}
