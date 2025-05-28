---
title: TS学习-04-keyof和in操作符
slug: ts-04-keyof&in
category: 'frontend'
publishDate: '2024-1-28'
tags: ['前端', 'TypeScript']
coverImage: /icons/typescript.svg
---

## 前言

`keyof`和`in`操作符的使用方式看着有些相像，其实有很大的不同，keyof一般对对象类型使用，表示获取对象中的属性名。而in用于对象类型的定义中，右边跟一个联合类型，用来"迭代"联合类型简化对象类型的声明。本章介绍keyof和in操作符的用法，同时记录两个相关的实战案例。

## 一、keyof操作符的使用

### 1.1 基本使用

我们如果需要获取对象类型中的属性名，通常需要使用keyof。如下图，key可以使用"name"和"age"进行赋值，但是不能用"sex"，因为Person类型中没有定义sex属性。

![](/blog/ts/0-ts-04-keyof-in.png)

### 1.2 对对象索引签名使用

如果对声明了索引签名的对象使用keyof，会直接返回索引签名中的类型：

![](/blog/ts/1-ts-04-keyof-in.png)

需要注意的是，<font style="background-color:#FBDE28;">如果索引签名的类型是string，那么使用keyof推导出的类型是number|string</font>，原因是js中，使用数字作为属性名会被转换成字符串，SomeType[1] 和 SomeType["1"]是等价的。

![](/blog/ts/2-ts-04-keyof-in.png)

### 1.3 对泛型对象使用

对泛型参数使用keyof时需要注意，在js中允许使用数字、字符串、和Symbol类型来作为属性名，因此对泛型类型和any类型使用keyof时，推导出的类型为`string|number|symbol`

![](/blog/ts/3-ts-04-keyof-in.png)![](/blog/ts/4-ts-04-keyof-in.png)

如果确定了对象只有某个类型的属性名，可以使用Extract关键字将类型提取出来：

![](/blog/ts/5-ts-04-keyof-in.png)

### 1.4 实战

> 商场做的会员等级分为C、B、A、S四个等级，用户购买之后根据出示的会员卡计算折扣

根据描述我们很容易能写出如下的式子，但是ts会提示discountStrategy有确定的属性名，传入string是不合法的。

![](/blog/ts/6-ts-04-keyof-in.png)

这个时候就可以借助keyof来获取discountStrategy的属性名，并声明VIPLevel只属于这个属性名范围：

![](/blog/ts/7-ts-04-keyof-in.png)

实现步骤如下：

1. 我们首先用typeof discountStrategy来获取discountStrategy的类型
2. 再用keyof获取该类型的所有属性名
3. 使用extends约束泛型T的对象上需要有discountStrategy的类型对于的属性名
4. 最后将泛型T赋值给VIPLevel参数

## 二、in操作符的使用

in操作符比较简单，一般用在对象类型的声明中, 右边跟一个联合类型。常用方法如下：

可以看到，使用了in关键字后，ts自动推断出了CarValue的属性名和类型，不需要我们手动写。

![](/blog/ts/8-ts-04-keyof-in.png)

上一章的实战使用in操作符，我们可以进行如下的优化：

![](/blog/ts/9-ts-04-keyof-in.png)

实现步骤如下：

1. 我们首先定义一个VIPLevel联合类型，列举所有会员等级
2. 再申明一个VIPDiscountStrategy对象类型，使用in操作符来统一定义这个对象的属性值
3. 最后在calculate函数上将参数VIPLevel的类型声明成VIPLevel联合类型即可实现相同效果

## 三、综合实战

原题地址： [实现Pick关键字](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.zh-CN.md)

![](/blog/ts/10-ts-04-keyof-in.png)

具体实现：

```typescript
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
};
```

实现思路：

1. 我们定义两个泛型参数T和K,其中约束K的类型扩展T的属性名
2. 再用`key in K: T[key]`来取出Pick出来的属性名

使用示例：

![](/blog/ts/11-ts-04-keyof-in.png)
