---
title: NodeJS的异步IO
slug: nodejs-async-io
category: 'programming'
publishDate: '2025-5-25'
tags: ['前端', 'NodeJS', 'Nodejs']
featured: true
coverImage: https://nodejs.org/static/images/node-mascot.svg
cardCoverClassName: object-contain
articleCoverClassname: object-contain
---

## 异步IO

1. libuv是做什么的？
2. 同步io有哪两种形式
3. nodejs的异步模型为什么有非阻塞、事件驱动的特点？

## 为什么需要异步IO

要搞清楚什么是异步IO，首先得了解一下什么是同步IO。很简单，就是让操作系统去做事，程序等在原地，等操作系统完成任务了再继续执行主线程。同步IO有两种表现形式：

1. 串行的单线程：

一个线程里做很多事情，每个事情都一个个做。很显然这种行为当任务量大的时候会出现最新的任务要等到所有任务都完成才轮到他，效率不够高

2. 多线程并行完成

为了处理串行执行的单线程的效率问题，提高效率，可以开设多个处理线程来处理IO任务，提高效率。但是需要处理多线程带来的死锁、状态同步的问题，非常难处理。

> 在复杂的业务中，多线程编程经常面临锁、状态同步等问题，这是多线程被诟病的主要原因。但是多线程在多核CPU上能够有效提升CPU的利用率，这个优势是毋庸置疑的。

为了解决同步IO的痛点，Node采用了异步IO的模型。具有非阻塞、事件驱动、高并发的特点。

## NodeJS的异步IO模型

通过下图可以很好的理解非阻塞和事件驱动的意思：主线程不会等到IO任务完成再继续走（非阻塞），IO事件完成后调用回调函数告知主线程任务完成（事件驱动）

![](/blog/developer/nodejs/0-async-io.png)

由于不同操作系统对于上述这套异步模型的支持有区别，为了统一上层nodejs的调用方式，因此有了`libuv` ，将win和unix的异步模型抽象统一起来。unix平台下libuv使用自己封装的多线程模型，而win下采用的是win的IOCP

![](/blog/developer/nodejs/1-async-io.png)

## Nodejs的事件循环（EventLoop）模型

- 什么时候进入事件循环？

nodejs初始化完成，开始执行同步的js代码，同步代码执行完成后，进入事件循环

- 事件循环经历那几个阶段？

事件循环模型：

![](/blog/developer/nodejs/2-async-io.png)

### 进入eventloop前

1. 执行js的同步代码
2. 执行nextTick
3. 执行微任务

### timer阶段

1. 检查计时器setTimeout和setimxx是否到期，到期了就取出回调函数来执行
2. 执行nextTick
3. 执行微任务

### IO callback阶段

1. 检查是否有IO任务完成后的回调，如果有就执行，然后退出这个阶段
2. 执行nextTick
3. 执行微任务

### idle和prepare阶段

这个不需太关注

### <span style="background-color:#FBDE28;">Poll</span>

这个阶段比较重要，这个阶段会有两种情况

1. 存在可以执行的回调函数
   1. 取出所有回调函数来执行
   2. 运行nextTick和微任务
   3. 退出Poll阶段
2. 没有可执行的回调函数
   1. 检查有没有immediate回调，有就退出Poll阶段，进入下一阶段。如果没有immediate回调，阻塞在这里等待事件触发
   2. 执行nextTick
   3. 执行微任务

### check阶段

1. 如果有immediate回调，就执行所有可以执行的immediate回调函数
2. 执行nextTick
3. 执行微任务

### close阶段

1. 执行一些收尾的操作，比如关闭数据库连接什么的
2. 执行nextTick
3. 执行微任务
