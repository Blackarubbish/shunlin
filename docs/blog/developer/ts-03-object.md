---
title: TS学习-03-对象篇
slug: ts-03-object
category: 'frontend'
publishDate: '2024-1-28'
tags: ['前端', 'TypeScript']
coverImage: /icons/typescript.svg
---

## 前言

本章记录的是对象类型的相关知识，包括对象的三种定义方式、三种属性修饰符、继承和交叉类型的区别、泛型对象的使用以及数组对象的定义和使用方法。由于是学习笔记，所以记录的比较简单，目的是能让自己复习的时候快速看懂，需要详细学习相关知识可以去看<font style="color:rgb(0, 0, 0);">冴羽大佬的原文</font>[<font style="color:rgb(0, 0, 0);">TypeScript 之 Object Types</font>](https://juejin.cn/post/7031715450828374052)

## 一、常用定义方式

1. 匿名定义

![](/blog/ts/0-ts-03-object.png)

2. 接口定义

![](/blog/ts/1-ts-03-object.png)

3. 类型别名定义

![](/blog/ts/2-ts-03-object.png)

## 二、属性修饰符

属性修饰符用三个：“可选、只读、索引”

### 2.1 可选类型

冒号`:`签名加个问号`?`，表示有这个属性可以有但是不一定非得有。

可以看到下图，age属性可能为空所以ts报了一个错误

![](/blog/ts/3-ts-03-object.png)

为了防止错误，使用时需要主动对undefined的情况做处理，可以是设置一个默认值，也可以判断该属性不是undefined

![](/blog/ts/4-ts-03-object.png)

### 2.2 只读（readonly）

在属性名签名添加readonly关键字，表示这个属性只能读，不能被写入

![](/blog/ts/5-ts-03-object.png)

只读说的是这个属性的值不能被写入，但是不能保证这个属性内部的东西不能更改。

![](/blog/ts/6-ts-03-object.png)

### 2.3 索引签名

如果不知道这个对象的所有属性名，但是知道这些属性的特征，就可以使用索引签名来定义对象。<font style="background-color:#FBDE28;"></font>

![](/blog/ts/7-ts-03-object.png)

<font style="background-color:#FBDE28;">索引签名的属性类型必须是number，string 和symbol</font>

![](/blog/ts/8-ts-03-object.png)

## 三、接口继承

使用`extends`关键字来继承其他的接口，在此基础上继续扩展。下图我们定义了一个Teacher接口继承Person，在Person类型的基础上扩展了school属性。<font style="background-color:#FBDE28;">ts支持多个类型的继承</font>

![](/blog/ts/9-ts-03-object.png)

<font style="background-color:#FBDE28;"></font>

## 四、交叉类型

交叉类型与继承很类似，也可以通过交叉类型对原有类型进行扩展。

![](/blog/ts/10-ts-03-object.png)

与继承不同的是，继承后的对象内的属性不允许覆盖父类型的属性

![](/blog/ts/11-ts-03-object.png)

而交叉类型是可以重写的，交叉出的类型取交集。如下图，Person与age属性类型为string的对象交叉生成的Teacher类型，age的类型为number和string类型的交集，由于这两者没有交集，所以类型为never

![](/blog/ts/12-ts-03-object.png)

## 五、泛型对象类型

与函数泛型类似，定义对象时也可以使用泛型来定义。既定义一个模板，让每个类型都通用。

![](/blog/ts/13-ts-03-object.png)

## 六、数组对象类型

### 6.1 Array

定义数组时我们常用Type[]的方式定义，这种方式其实是Array<Type>的简写形式，数组类型也是一个泛型对象。下方的两行代码是等价的。

```typescript
const strArr: string[] = [] 
const srtArr: Array<string> = []
```

### 6.2 ReadonlyArray

使用这个关键字定义的数组不允许对数组内进行更改。

```typescript
const strArr: ReadonlyArray<string> = ["1", "a", "b"]

// Index signature in type 'readonly string[]' only permits reading
strArr[2] = "1"
```

 也可以使用readonly关键字来简写定义方式，下面两行代码是等价的

```typescript
const strArr: readonly string[] = ["1", "a", "b"]
const strArr: ReadonlyArray<string> = ["1", "a", "b"]
```

使用只读数组的好处在于，在一个函数中一个参数被声明为只读数组，那么说明在函数中它不会被改变，使用方可以在使用这个函数后继续放心地使用传入的数组。

注意事项！

1. ReadonlyArray不能用做构造器函数

```typescript
// 'ReadonlyArray' only refers to a type, but is being used as a value here.
const arr = new ReadonlyArray("1", "2", "3")
```

2. ReadonlyArray与Array不能双向赋值

![](/blog/ts/14-ts-03-object.png)

### 6.3 元组类型

元组是长度确定、每个位置的元素类型确定的数组。定义了一个元组后，这个元组的长度也会被ts自动推断

![](/blog/ts/15-ts-03-object.png)

使用在确定的元素类型后面可以添加可选元素，表示这个元素可能会有。可以看到下图，声明了可选元素之后，长度变成了2或3

![](/blog/ts/16-ts-03-object.png)

还可以使用扩展语法来定义元组, 如果使用了扩展语法，ts就无法准确判断长度，这个时候length类型为number类型

```typescript
type StringNumberBool = [string, number, ...boolean[]];
const f: StringNumberBool = ["12", 1, false]
// (property) length: number
f.length
```

大部分代码中，元组只是被创建，使用之后不会被修改，因此使用readonly来约束元组是个值得推荐的行为。

```typescript
type StringNumberPair = readonly [string, number];
```

如果我们对一个数组使用const断言，ts也能自动推断为该数组为一个readonly的元组

![](/blog/ts/17-ts-03-object.png)
