---
title: Win11+WSL2 搭建工作站，Windows软件生态和Linux开发体验我全都要！
slug: win11-wsl2-debian
category: 'zheteng'
publishDate: '2025-6-29'
tags: ['wsl', 'debian']
coverImage: /blog/wsl/win11-wsl.png
featured: true
---

## 前言：
 本文主要介绍为何选择 Windows 11 + WSL2 作为开发工作站的环境， WSL2 运行Debian 的安装步骤，以及笔者为了提升开发体验做的一些配置个使用心得，包括：

1. Debian换源
2. Oh My ZSH安装
3. Windows Terminal美化
4. VS Code连接WSL
5. 一些基于WSL开发的注意事项和小技巧



## Win11果然是最好的Linux发行版🤣
:::info
**（本章主要是在唠叨，废话较多，需要看安装流程的朋友可以直接跳到第下一章）**

:::

作为前端开发其实对`linux`环境的需求不是很大，毕竟写的代码大部分时候运行在浏览器环境，就算是偶尔写`Node`, win的文件系统虽然恶心但也不是不能用。

直到去年参与了一个基于go语言的cli工具的开发工作，在windows写go的体验感真的很糟糕, 于是折腾之魂在笔者心中熊熊燃烧，开始捣鼓WSL来搭建go语言开发环境。最后发现在linux系统不仅开发go很舒服，回到前端来开发也很舒服，于是再也回不去windows了（`rm -rf node_modules `一瞬间就能把`node_modules`删掉的爽感，相信在windows开发过前端或者node的朋友都能理解🤣）。

## 在Win11上安装WSL
接下来让我们开始进入配置环节

### 启用WSL相关功能
1. 进入win11的设置界面，搜索`启用或关闭windows功能`

![](/blog/wsl/0-win11-wsl.png)

2. 打开`Virtual Machine Platform（有些版本写的是中文‘虚拟机平台’）`和` 适用于 Linux 的 Windows 子系统 `两个关键开关。点击确定后重启电脑

![](/blog/wsl/1-win11-wsl.png)

3. 重启后使用管理员权限打开`powershell`, 运行 `wsl.exe --update` 更新wsl

更新完成后应该就是WSL2，可以使用`wsl.exe --version`来确认一下

![](/blog/wsl/2-win11-wsl.png)



:::info
如果运行`wsl.exe --update` 提示403，说明你的系统可能是windows家庭版，需要升级一下系统到专业版。或者在家庭版下打开wsl，在桌面新建一个`wsl.bat`文件，将下面的代码写入，然后以管理员身份运行这个bat文件。运行成功后重启就可以了

:::

```bash
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
dism /online /enable-feature /featurename:VirtualMachinePlatform /all
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```



### 安装Debian
笔者比较喜欢`Debian`，如果你有其他偏好的linux发行版，可以先看一下有没有微软官方提供的系统镜像，选择一个喜欢的系统安装即可。

使用在powershell运行`wsl -l -o`，查看可用的linux发行版

![](/blog/wsl/3-win11-wsl.png)

安装命令为`wsl --install -d [NAME]`这里选择安装`Debian`：`wsl --install -d Debian`

也可以到微软的应用商店直接搜索对应的linux发行版进行安装

![](/blog/wsl/4-win11-wsl.png)



安装之后会进入linux系统的初始终端，设置好用户名和密码就可以正常使用`Debian`了。接下来我们给Debian换一个国内源。这里笔者换的是阿里云的源。



Debian安装好之后可以在开始面板搜索到，点击打开即可

![](/blog/wsl/5-win11-wsl.png)

也可以在windows terminal中找到它，使用`win+R`打开运行面板，输入wt然后回车，打开windows terminal面板。

![](/blog/wsl/6-win11-wsl.png)



打开终端后，我们先备份一下旧的源配置文件

```bash
sudo cp /etc/apt/sources.list   /etc/apt/sources.list.bak
```

使用nano编辑器写入阿里云的源

```bash
sudo nano /etc/apt/sources.list
```

将文件内容替换为下面这个然后保存

```bash
deb https://mirrors.aliyun.com/debian/ bookworm main non-free non-free-firmware contrib
deb-src https://mirrors.aliyun.com/debian/ bookworm main non-free non-free-firmware contrib
deb https://mirrors.aliyun.com/debian-security/ bookworm-security main
deb-src https://mirrors.aliyun.com/debian-security/ bookworm-security main
deb https://mirrors.aliyun.com/debian/ bookworm-updates main non-free non-free-firmware contrib
deb-src https://mirrors.aliyun.com/debian/ bookworm-updates main non-free non-free-firmware contrib
deb https://mirrors.aliyun.com/debian/ bookworm-backports main non-free non-free-firmware contrib
deb-src https://mirrors.aliyun.com/debian/ bookworm-backports main non-free non-free-firmware contrib
```



接下来我们再更新本地软件包的索引

```bash
sudo apt update
```



### 切换WSL的网络模式为 Mirrored   （非必需）
WSL的默认网络模式是NAT，这个模式下WSL实例会被分配一个独立的ip，与宿主机之间通过ip来通信。安全性较高，缺点是外部网络没法直接访问到WSL实例，最重要的一点是宿主机挂🪜对WSL不生效🤡，且前端开发常用的`whistle`也没办法在WSL内使用。



我们将网络模式切换成mirrored，镜像宿主机的网络，实现一个你中有我我中有你的效果。

在win11的开始面板（就是按下`win`键弹出来的那个面板）搜索WSL Settings，打开

![](/blog/wsl/7-win11-wsl.png)



找到网络那一栏，将网络模式切换成Mirrored

![](/blog/wsl/8-win11-wsl.png)



也可以到c盘的用户目录下找到`.wslconfig`文件（如果没有就新建一个），打开后将下面这个配置写入即可

```bash
[wsl2]
networkingMode=Mirrored
```



接下来我们重启一下wsl，管理员模式打开powershell，关闭wsl

```bash
wsl --shutdown
```

在输入一次`wsl`启动重新启动wsl

![](/blog/wsl/9-win11-wsl.png)



这个时候WSL就能正常与宿主机共享网络了，在里面开启`Whistle`, 主机也是可以通过localhost访问到的。



## 安装Oh My ZSH
接下来我们安装Oh My ZSH

:::info
笔者的配置参考了，这位大佬写的文档：[https://www.haoyep.com/posts/zsh-config-oh-my-zsh/](https://www.haoyep.com/posts/zsh-config-oh-my-zsh/)（写的非常详细），如果需要更详细的配置教程，可以看这篇文档
:::

先安装必要的依赖：

```bash
# 更新软件源
sudo apt update && sudo apt upgrade -y
# 安装 zsh git curl
sudo apt install zsh git curl -y
```

设置zsh为默认的终端  （<font style="color:#ED740C;">这里不用使用sudo</font>）：

```bash
chsh -s /bin/zsh
```

安装Oh My ZSH

```bash
sh -c "$(curl -fsSL https://install.ohmyz.sh/)"

# 国内镜像
sh -c "$(curl -fsSL https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh)"
```

安装过程会询问你是否将默认的终端设置为zsh，输入Y同意即可，这个时候终端就会变成了zsh![](/blog/wsl/10-win11-wsl.png)



安装两个非常好用的插件：

+ 自动提示插件（**zsh -autosuggestions**）

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 国内加速
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

+ 命令高亮(**zsh-syntax-highlightin**)

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 国内加速
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```



最后我们来启用插件，编辑`.zshrc`文件

```bash
sudo nano ~/.zshrc
```

找到plugins配置，把上文的两个插件写入。这里还可以顺便启用oh-my-zsh内置的几个插件

+ web-search：直接在终端使用搜索引擎进行搜索，比如`baidu 什么是快乐星球?`就会直接打开浏览器展示搜索内容
+ z： 快速跳转目录的插件，曾经访问过的目录，只用使用`z 目录名`就可以快速跳转
+ extract：使用`x [压缩包文件]`可以根据压缩包后缀自动执行解压文件的命令，不再需要记忆各个压缩类型的指令

![](/blog/wsl/11-win11-wsl.png)

保存后重新打开终端。这个时候再输入命令就会发现有高亮效果，还会有自动提示，点击键盘上的“右方向键➡️”既可以采纳这个提示的命令

![](/blog/wsl/12-win11-wsl.png)



接着咱们来配置一个oh my zsh主题，预览oh my zsh提供的[内置主题](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)，选一个喜欢的记住它的名字。比如这里笔者选择了这个`cloud`主题

![](/blog/wsl/13-win11-wsl.png)

继续使用nano来编辑zsh的配置文件

```bash
sudo nano ~/.zshrc
```

找到`ZSH_THEME`, 将`robbyrussell`替换成`cloud`, 然后保存![](/blog/wsl/14-win11-wsl.png)

重新载入zsh的配置文件

```bash
source ~/.zshrc
```

这时候就能看到主题生效了，箭头变成了一朵云

![](/blog/wsl/15-win11-wsl.png)



:::info
除了oh my zsh内置的主题，还有很多社区支持的主题，可以前[https://www.slant.co/topics/7553/~theme-for-oh-my-zsh](https://www.slant.co/topics/7553/~theme-for-oh-my-zsh)查看，这里就不过多介绍了

:::





接下来在`.zshrc`里配置一些常用的命令配置一些简写前缀（非必需）

使用nano打开配置文件

```bash
sudo nano ~/.zshrc
```



写入命令前缀

```bash
# git相关
alias g='git'
alias gpl='git pull'
alias gps='git push'
alias gck='git checkout'
alias gcm='git commit'
alias gbr='git branch'
alias gmg='git merge'
alias grb='git rebase'
alias glog='git log'
alias gst='git status'
alias gft='git fetch'

# 前端开发相关
alias pp='pnpm'
alias ppi='pnpm install'
alias npi='npm install'
alias n='node'
```

重载`.zshrc`

```bash
source ~/.zshrc
```



配置好了之后就可以使用简写前缀直接运行命令了, 使用`ppi` 运行`pnpm install`

![](/blog/wsl/16-win11-wsl.png)



## Windows Terminal美化
win11微软已经将windows terminal（下文简称`wt`）作为默认的系统终端了。wt支持用户更灵活的配置终端，我们先来给Debian的终端换一个JetBrain家的字体



前往Jetbrain的官网下载字体：[https://www.jetbrains.com/lp/mono/](https://www.jetbrains.com/lp/mono/)，解压后全选安装所有的ttf字体文件。

使用`win+R`打开运行面板，输入wt然后回车，打开wt面板。找到`设置`的入口

![](/blog/wsl/17-win11-wsl.png)

这里我们单独为Debian配置终端外观

![](/blog/wsl/18-win11-wsl.png)

找到字体这一栏，选择`JetBrains Mono`

![](/blog/wsl/19-win11-wsl.png)



除了字体之外，还可以调整一下终端的配色方案，字体大小等，下面是笔者比较喜欢的配置：

+ 配色方案：One Half Dark
+ 字号：16
+ 背景不透明度：90%



## VS Code连接WSL
打开VS Code，搜索WSL扩展点击安装

![](/blog/wsl/20-win11-wsl.png)

安装完成后使用快捷键`ctrl + shift+ p`打开vscode命令面板，搜索wsl，就可以看到一个连接WSL的命令

![](/blog/wsl/21-win11-wsl.png)

点击后vscode就会打开一个连接了wsl的面板。这个时候打开控制台就是纯Linux环境了，接着安装对应语言的开发环境就可以愉快的 coding了！

![](/blog/wsl/22-win11-wsl.png)





## 一些注意事项和tips
1. 宿主机上的vscode的扩展需要在WSL环境再安装一遍才能生效
  ![](/blog/wsl/23-win11-wsl.png)
2. windows宿主机的文件在WSL环境内可以到`/mnt/`目录下访问
    比如宿主机的c盘，在WSL中可以通过`/mnt/c/`直接访问

3. **不建议在WSL环境内基于windows的文件系统进行开发（重要！！）**

    笔者刚玩WSL的时候，总是通过`/mnt/c`访问windows宿主机的文件进行开发，发现文件效率非常低，而且会有一些奇奇怪怪的报错。去研究了一下发现是WSL直接操作宿主机的文件会有很大的转换损耗。
    
    最好的做法是直接基于linux文件系统，直接将代码克隆到linux系统的用户目录进行开发，流畅度非常高

4. WSL可以直接使用宿主机上的命令
    这个真的是WSL最让人愉悦的地方，宿主机上的`docker`WSL内可以直接使用、使用vscode的 时候也不需要每次都打开面板连接，在WSL内的某个目录使用`code .`既可以直接打开连接了WSL的基于这个目录的vscode面板。甚至可以运行`.exe`文件，例如在命令行运行`explorer.exe .`可以直接打开windows的文件管理窗口对WSL内的文件进行管理





