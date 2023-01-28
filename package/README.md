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
  <div>
    <el-input v-model="value1" />
    <el-select v-model="value2">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    /></el-select>
    <el-date-picker
      v-model="value3"
      type="daterange"
      value-format="YYYY-MM-DD"
    />
    <div>{{ value4.join(',') }}</div>
  </div>
</template>
```


JS:

```jsx
<script setup lang="tsx">
  import useSyncQuery from 'use-sync-query'

  const options = [
    {
      label: 'label1',
      value: 1
    },
    {
      label: 'label2',
      value: 2
    },
    {
      label: 'label3',
      value: 3
    }
  ]

  // 数组解构的顺序和配置的顺序一致
  const [value1, value2, value3, value4] = useSyncQuery([
    // 值如果是 String 类型的，不需要做任何处理
    { key: 'keyword', value: '123' },
    // 值如果是 Number 类型的，需要指定 encode 和 decode 来转换类型
    {
      // 如果指定了 encode 和 decode, key 可以写成任意的字符串，它将没有任何意义
      key: 'sel',
      value: 2,
      encode: ({ value }) => {
        return { sel: value ? String(value) : '' }
      },
      decode: ({ query }) => {
        return query.sel !== '' ? Number(query.sel) : undefined
      }
    },
    {
      // 将一个数组映射成两个参数 start 和 end
      key: 'date',
      value: ['2023-01-18', '2023-01-19'],
      encode({ value }) {
        const [start, end] = value
        return {
          start,
          end
        }
      },
      decode({ query }) {
        if (query.start && query.end) {
          return [query.start, query.end]
        } else if (query.start) {
          return [query.start]
        } else if (query.end) {
          return [, query.end]
        }
        return []
      }
    },
    // 将数组映射成 url 中的重复参数， array=1&array=2&array=3
    {
      key: 'array',
      value: ['1', '2', '3']
    }
  ])
</script>
```

### config

```jsx
interface IEncodeDecode {
  // config 中的 key
  key: string;
  // 当前配置项对应的 value，url 参数的优先级高于 config 中设置默认值 
  value: any; 
  // 所有的 query 字段
  query: IQuery; 
}

interface IUseSyncQuery {
  // 关键字，如果没有指定 encode，key 将作为 url 中的参数名
  key: string;
  // 默认值
  value?: any; 
  // 将 value 转换成url中的参数
  decode?: (options: IEncodeDecode) => any; 
  // 将ulr的参数转换成 value
  encode?: (options: IEncodeDecode) => Record<string, string>; 
}

export interface IOptions {
  // 忽略空的参数，设置为true,空字符串对应的 key 将不会同步到 url
  // 默认：true
  ignoreWhiteSpace?: boolean;
}

const config: IUseSyncQuery[] = [这里是你的配置]
const options: IOptions = { ignoreWhiteSpace: true }
const [...res] = useSyncQuery(config, options)
```

> 如果指定了 encode 函数，那么该函数必须返回一个 Object 对象