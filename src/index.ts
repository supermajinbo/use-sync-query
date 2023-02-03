import { Ref, ref, watch } from 'vue';
import { isWhiteSpace } from './utils';

export type IQuery = Record<string, string | string[]>;

export interface IEncodeDecode {
  key: string;
  value: any;
  query: IQuery;
}

export interface IUseSyncQuery {
  key: string;
  value?: any;
  ignoreWhiteSpace?: boolean;
  decode?: (options: IEncodeDecode) => any;
  encode?: (options: IEncodeDecode) => Record<string, string>;
}

export interface IOptions {
  ignoreWhiteSpace?: boolean;
}

/**
 * 同步搜索条件到query
 * @param config
 * @returns
 */
function useSyncQuery(
  config: IUseSyncQuery[],
  options: IOptions = { ignoreWhiteSpace: true }
): Ref<any>[] {
  let _queryMap: { [props: string]: any } = {};
  const _config = config;
  const _refMap: { [props: string]: Ref<any> } = {};

  // 默认配置
  const defaultConfig = {
    defaultEncode: ({ key, value }: IEncodeDecode) => ({ [key]: value }),
    defaultDecode: ({ key, query }: IEncodeDecode) => query[key]
  };

  const addParams = (
    urlParams: URLSearchParams,
    key: string,
    value: string
  ) => {
    // 忽略空白参数
    if (options?.ignoreWhiteSpace === true && isWhiteSpace(value)) return;
    urlParams.append(key, encodeURI(value));
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
          addParams(urlParams, key, item);
        });
      } else {
        addParams(urlParams, key, value);
      }
    });
    const queryStr = urlParams.toString();
    return queryStr ? `?${queryStr}` : '';
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
    const q = (search || hash).replace(/^#\//, '').replace(/\?/, '');
    const urlParams = new URLSearchParams(q);

    for (const key of urlParams.keys()) {
      const values = urlParams.getAll(key).map((e) => decodeURI(e));
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
          // 将 Proxy 代理的 Array ,转换为 Array
          const tempVal = Array.isArray(newVal) ? Array.from(newVal) : newVal;
          _queryMap = {
            ..._queryMap,
            ...encode({ query: _queryMap, value: tempVal, key })
          };
          _syncToQuery();
        }
      },
      { deep: true }
    );
    return _ref;
  }

  const result = config.map((conf) => _registerSyncQuery({ ...conf }));
  _syncFromQuery();
  _syncToQuery();
  return result;
}

export default (conf: IUseSyncQuery[], options?: IOptions): Ref<any>[] =>
  new (useSyncQuery as any)(conf, options);
