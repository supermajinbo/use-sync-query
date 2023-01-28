> 用于将查询参数同步到 url 的参数中,该组件基于 vue3 实现

### Install

```bash
npm install use-sync-query
# or
yarn add use-sync-query
```

### use

HTML:

> NOTE: el-input、el-select、el-date-picker 为 element-plus 组件库提供的组件，需自行安装或使用其他组件库

```jsx
<template>
  <div class="main">
    <el-input v-model="value1" />
    <el-select v-model="value2">
      <el-option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </el-option>
    </el-select>
    <el-date-picker
      v-model="value3"
      type="daterange"
      value-format="YYYY-MM-DD"
    />
    <el-date-picker
      v-model="value4"
      type="daterange"
      value-format="YYYY-MM-DD"
    />
    <div>重复参数：{{ value5.join(',') }}</div>
  </div>
</template>
```

JS:

```jsx
<script setup lang="tsx">
  import useSyncQuery from 'use-sync-query'

  const options = [
    { label: 'label1', value: 1 },
    { label: 'label2', value: 2 },
    { label: 'label3', value: 3 }
  ]

  const [value1, value2, value3, value4, value5] = useSyncQuery([
    { key: 'a', value: '123' },
    {
      key: 'b',
      value: 2,
      encode: ({ value }) => {
        return { b: value ? String(value) : '' }
      },
      decode: ({ query }) => {
        return query.b !== '' ? Number(query.b) : undefined
      }
    },
    {
      // 将 dateRange 在url中显示为: start=2023-01-01&end=2023-01-10
      key: 'dateRange',
      value: ['2023-01-01', '2023-01-10'],
      encode: ({ value }) => {
        const [start, end] = value ?? ['', '']
        // 这里的参数（start、end）可以任意写，只要和其他的参数不重复即可，不一定要和 key 一致
        return {
          start,
          end
        }
      },
      decode: ({ query }) => {
        // start, end 取决于 encode 函数的返回值中的 keys
        const { start, end } = query
        return [start ?? '', end ?? '']
      }
    },
    {
      // 将 date 在url中显示为: c=2023-01-11%2C2023-01-20
      key: 'date',
      value: ['2023-01-11', '2023-01-20'],
      encode: ({ value }) => {
        // 这里的参数（c）可以任意写，只要和其他的参数不重复即可，不一定要和 key 一致
        // 但是如果只有 1 个参数的时候，建议和 key 保持一致
        return { c: value?.join(',') ?? '' }
      },
      decode: ({ query }) => {
        return (query.c as string).split(',')
      }
    },
    {
      key: 'd',
      value: ['1', '2', '3']
    }
  ])
</script>
```

### 参数说明

```jsx
interface IEncodeDecode {
  // config 中的 key
  key: string;
  // 当前配置项对应的 value，url 参数的优先级高于 config 中设置的默认值
  value: any;
  // 所有的 query 字段
  query: IQuery;
}

interface IUseSyncQuery {
  // 关键字，如果没有指定 encode，key 将作为 url 中的参数名
  key: string;
  // 默认值
  value?: any;
  // 将 value 转换成 url 中的参数
  decode?: (options: IEncodeDecode) => any;
  // 将 ulr 中的参数转换成 value
  encode?: (options: IEncodeDecode) => Record<string, string>;
}

export interface IOptions {
  // 忽略空的参数，设置为true,空字符串对应的 key 将不会同步到 url
  // 默认：true
  ignoreWhiteSpace?: boolean;
}

const config: IUseSyncQuery[] = [这里是你的配置];
const options: IOptions = { ignoreWhiteSpace: true };
const [...res] = useSyncQuery(config, options);
```

> 如果指定了 encode 函数，那么该函数必须返回一个 Object 对象


### 变更日志

[变更日志](./CHANGELOG.md)