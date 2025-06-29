---
title: TS学习-05-索引类型
slug: ts-05-idx
category: 'frontend'
publishDate: '2024-1-28'
tags: ['前端', 'TypeScript']
coverImage: /icons/typescript.svg
---

大白话就是用index的类型去索引value的类型。

用的最多的地方应该是一个对象数组，要想获取对象数组里的对象的类型，就可以用

`type objectType = objectArr[numver]`来获取到

```typescript
/**
 * 索引访问类型
 */

// 1. 索引数组
const nums = [1, 2, 3, 4, 5] as const;
// * str = 1 | 2 | 3 | 4 | 5
type str = (typeof nums)[number];

// 2. 索引对象

type person = {
  name: string;
  age: number;
};

type age = person['age']; // number

// 3. 对象数组

type personList = {
  name: string;
  age: number;
}[];

type name = personList[number]['name']; // string

// 实战

// 1. 应用有三种类型: "native", "web", "weex", 根据这三种类型做不同的处理

const app = ['native', 'web', 'weex'] as const;
type appType = 'native' | 'web' | 'weex';

function createApp(type: appType) {
  if (type === 'native') {
    // do something
  } else if (type === 'web') {
    // do something
  } else if (type === 'weex') {
    // do something
  }
}

// 2. 用索引访问类型优化后可以防止重复定义

type newAppType = (typeof app)[number];
function newCreateApp(type: newAppType) {
  if (type === 'native') {
    // do something
  } else if (type === 'web') {
    // do something
  } else if (type === 'weex') {
    // do something
  }
}
```
