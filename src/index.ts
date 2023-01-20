import { Ref, ref, watch } from 'vue';

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

// 获取 query 中的 key
// const keys = (): string[] => {
//   const { href } = window.location;
//   const query = (href.split('?')[1] ?? '').split('&');
//   const set = new Set<string>();
//   query.forEach((item) => {
//     const [key] = item.split('=');
//     set.add(key);
//   });
//   return Array.from(set);
// };

// @ts-ignore
// URLSearchParams.prototype.keys = URLSearchParams.prototype.keys ?? keys;

/**
 * 同步搜索条件到query
 * @param config
 * @returns
 */
function useSyncQuery(config: IUseSyncQuery[]): Ref<any>[] {
  let _queryMap: { [props: string]: any } = {};
  const _config = config;
  const _refMap: { [props: string]: Ref<any> } = {};

  // 默认配置
  const defaultConfig = {
    defaultEncode: ({ key, value }: IEncodeDecode) => ({ [key]: value }),
    defaultDecode: ({ key, query }: IEncodeDecode) => query[key]
  };

  /**
   * 将 json 转换成 ?a=1&b=2 的格式
   * @param json json数据
   * @returns
   */
  const _jsonToQuery = (json: IQuery) => {
    const urlParams = new URLSearchParams();
    Object.entries(json).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          urlParams.append(key, item);
        });
      } else {
        urlParams.append(key, value);
      }
    });
    return `?${urlParams.toString()}`;
  };

  // 将 query 数据同步到浏览器 url 的 query 中
  const _syncToQuery = (query: IQuery = {}) => {
    const {
      history: { state },
      location: { href }
    } = window;
    _queryMap = { ..._queryMap, ...query };
    const queryStr = href.split('?')[0] + _jsonToQuery(_queryMap);
    window.history.replaceState(state, '', queryStr);
  };

  /**
   * 获取 url 的 query
   */
  const _syncFromQuery = () => {
    const query: IQuery = {};
    const { search, hash } = window.location;
    const q = (search || hash).replace(/#\//, '').replace(/\?/, '');
    const urlParams = new URLSearchParams(q);
    //@ts-ignore
    for (const key of urlParams.keys()) {
      const values = urlParams.getAll(key);
      query[key] = values?.length === 1 ? values[0] : values;
    }

    const mergeQuery = { ..._queryMap, ...query };
    _config.forEach(({ key, value, decode = defaultConfig.defaultDecode }) => {
      const decodeValue = decode({ query: mergeQuery, key, value });
      _refMap[key].value = decodeValue;
    });
  };

  // 注册需要同步的 query
  function _registerSyncQuery({
    key,
    value,
    encode = defaultConfig.defaultEncode
  }: IUseSyncQuery): Ref<any> {
    const _ref = ref(value);
    _refMap[key] = _ref;
    _queryMap = { ..._queryMap, ...encode({ query: _queryMap, value, key }) };
    watch(
      () => _ref.value,
      (newVal: any, oldValue: any) => {
        if (newVal !== oldValue) {
          _queryMap = {
            ..._queryMap,
            ...encode({ query: _queryMap, value: newVal, key })
          };
          _syncToQuery();
        }
      }
    );
    return _ref;
  }

  const result = config.map((conf) => _registerSyncQuery({ ...conf }));
  _syncFromQuery();
  _syncToQuery();
  return result;
}

export default (conf: IUseSyncQuery[]): Ref<any>[] =>
  new (useSyncQuery as any)(conf);
