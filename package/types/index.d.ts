import { Ref } from 'vue';
export type IQuery = Record<string, string | string[]>;
export interface IEncodeDecode {
    key: string;
    value: any;
    query: IQuery;
}
export interface IUseSyncQuery {
    key: string;
    value?: any;
    decode?: (options: IEncodeDecode) => any;
    encode?: (options: IEncodeDecode) => Record<string, string>;
}
declare const _default: (conf: IUseSyncQuery[]) => Ref<any>[];
export default _default;
//# sourceMappingURL=index.d.ts.map