---
layout: post
title: "Git Submodule 从本地源初始化"
description: ""
category: tool
tags: [git]
---

#### 背景介绍
在使用 Wine 运行 [Magic: The Gathering Arena][MTGA] 的过程中，我想自行编译 [Wine-Mono][wmono]。[Wine-Mono][wmono] 用 `git submodule` 将 Mono 的 codebase 囊括了进来。  

在此之前，我在电脑上已经下载过了 Mono 的代码 (`git clone https://github.com/mono/mono.git --depth=1`)。与其重复访问 GitHub，我希望能从本地的代码库初始化 submodule。


#### 使用本地源



```
git clone https://github.com/madewokherd/wine-mono.git
cd wine-mono
git submodule init
git submodule set-url mono  /home/lizhenbo/src/mono
git submodule update mono 
```


在完成初始化后，再还原该设置
```
git submodule set-url mono https://github.com/madewokherd/wine-mono.git
```

#### 切换回上游代码

因为硬盘空间紧缺，我删掉了原有的 `/home/lizhenbo/src/mono` 。想要编辑上游代码，可以运行

```
cd wine-mono/mono
git remote add upstream https://github.com/mono/mono.git
git fetch upstream master 
git checkout upstream/master
git submodule update --recursive --depth=1
```

在工作完成后，可以再[恢复 submodule 配置](https://stackoverflow.com/a/61751340/1166518)。
```
git restore . --recurse-submodules
```

#### 番外：获取更深的历史记录

初次下载项目代码使用了 `--depth=1` 。如果想要看稍微久一些的历史记录，不需要 `git fetch --unshallow` 下载完整内容，而可以用 `git fetch origin master --deepen=10`。
 
我尝试了 `shallow-exclude`，但遇到了如下问题




```
$ git fetch origin master --shallow-exclude=fad8c19d8600b34e46984ba6dbb600f9343cd773 -v
POST git-upload-pack (306 bytes)
POST git-upload-pack (400 bytes)
error: RPC failed; curl 92 HTTP/2 stream 0 was not closed cleanly: Unknown error code (err 2)
fatal: error reading section header 'acknowledgments'

# https://stackoverflow.com/a/59474908/1166518   
$ git config http.version HTTP/1.1
$ git fetch origin master --shallow-exclude=fad8c19d8600b34e46984ba6dbb600f9343cd773 -v
POST git-upload-pack (306 bytes)
POST git-upload-pack (400 bytes)
error: RPC failed; curl 18 transfer closed with outstanding read data remaining
fatal: error reading section header 'acknowledgments'
```
	

 

[MTGA]: https://appdb.winehq.org/objectManager.php?sClass=version&iId=37229
[wmono]: https://github.com/madewokherd/wine-mono
