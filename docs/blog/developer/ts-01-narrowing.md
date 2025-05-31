---
title: TS学习-01-类型收窄
slug: ts-01-narrowing
category: 'frontend'
publishDate: '2024-1-28'
tags: ['前端', 'TypeScript']
coverImage: /icons/typescript.svg
featured: true
---


## 前言

本文是对于<font style="color:rgb(31, 31, 31);">冴羽大佬的文章 </font>[<font style="color:rgb(31, 31, 31);">TypeScript 之 Narrowing</font>](https://juejin.cn/post/7029618407108509704)<font style="color:rgb(31, 31, 31);"> 的学习笔记。既然是学习笔记，那么将文章照搬过来是没有意义的，本文是笔者对大佬的文章学习之后结合自己的理解做的总结。</font>

类型收窄，让ts能更好的判断某个值的类型，比如一个值可能是number、string、null等类型，通过类型缩窄让ts能准确判断出当前值的类型。

## 一、类型保护（type guards）

在ts中最常用的收窄就是类型保护，通过判断一个值是否为该类型，让ts能准确知晓该值的类型。可以看到下图，判断arg为string之后，ts能够准确知道arg就是一个string类型并给出string类型的相关提醒。

![](/blog/ts/0-ts-01-narrowing.png)

## 二、真值缩窄

js中，`0 、NaN、""、null、undefined` 这些值都会被转为 false，针对这一特性，可以把这些值给过滤掉

如下图，arg的类型已经从原先的number|null|string 被缩窄为了 string|number

![](/blog/ts/1-ts-01-narrowing.png)

当然使用这一特性时也需要额外关注`0、""`的情况，如下代码会把arg为0或空字符串的情况过滤掉，因此需要谨慎使用以下方式做真值缩窄

![](/blog/ts/2-ts-01-narrowing.png)

## 三、等值缩窄

如果一个参数与另一个参数全等，即（a === b），那么ts解析器就会认为a和b不仅值相等，类型也相等。

可以看到下图，原先的x:unknown, 在if分支中，编辑器提示x为string类型

![](/blog/ts/3-ts-01-narrowing.png)

## 四、in操作符缩窄

js中in可以判断对象是否有某个属性名，通过这个操作符也能让ts进行类型缩窄。

下图通过判断arg有run属性名，让ts将arg的类型缩窄为了Cat

![](/blog/ts/4-ts-01-narrowing.png)

## 五、instanceof 收窄

很好理解，通过instanceof来收窄类型

![](/blog/ts/5-ts-01-narrowing.png)

## 六、控制流分析

一个值的可能类型是number和string，那么ts断定如果这个值不是number就一定会是string

在下图中，我们判断arg为number时return，因此在if后面的语句，ts认为arg就是一个string类型

![](/blog/ts/6-ts-01-narrowing.png)

## 七、类型判断式

使用 is Type的语法来自己定义一个类型保护

如下图isCat函数，通过返回`arg is Cat` 来定义一个类型保护，使用isCat之后ts就知道某个值是不是Cat类型

![](/blog/ts/7-ts-01-narrowing.png)

## 八、可辩别联合

设想一下有一个动物Animal类型，不同的动物都有不同的行为，比如鱼能游泳(swim)但不能飞(fly)，猫能跑(run)但不能游泳（swim）。因此这个Animal类型可能会写成这样：

![](/blog/ts/8-ts-01-narrowing.png)

这样做的弊端也很明显，当我们判断类型为bird时，它应该具备能飞(fly)的能力，但是ts会报错，因为fly我们定义的是个可选类型。

![](/blog/ts/9-ts-01-narrowing.png)

要解决这个问题可以使用联合类型

![](/blog/ts/10-ts-01-narrowing.png)

然而使用时仍然会报错，因为ts不知道Animal类型具体是Cat、Fish、还是Bird

![](/blog/ts/11-ts-01-narrowing.png)

这时候依靠type属性名就能让ts正确识别Animal的具体类型，

![](/blog/ts/12-ts-01-narrowing.png)

## 九、穷尽检查

如果一个值它声明时类型为number|string，如果还有其他情况（如下图），这时候ts就会认为这个值的类型为never。

:::info
never表示一个不存在的类型，never可以赋值给任何值，但不能被赋值（同为never类型除外）

![](/blog/ts/13-ts-01-narrowing.png)

:::

![](/blog/ts/14-ts-01-narrowing.png)

使用穷尽检查有什么用呢？设想一下第八章联合类型的例子，如果新增了一个Dog类型，那么在对应的函数里就要加上处理逻辑，这时候要添加处理逻辑的地方过多,有个别地方忘记做处理怎么办？这就可以使用穷尽检查让ts提示一个编译错误

如下图，我们在最后做了兜底，将arg赋值给never类型的finalArg，没有任何错误。

![](/blog/ts/15-ts-01-narrowing.png)

现在新增一个Dog类型， 这个时候ts就会体贴的提示我们这里有编译错误，记得把Dog类型的处理也加上。

![](/blog/ts/16-ts-01-narrowing.png)
