---
layout: post
title: "Fedora 下安装 mingw32 以交叉编译"
description: ""
category: linix 
tags: [C, gcc, mingw, fedora, wine]
---
{% include JB/setup %}
Qian Hong 在 [wine-zh 邮件列表][1] 里发表了[分享: 如何入门 WIne 的开发调试?][2]，提到了要尝试使用 mingw 交叉编译代码为 exe，然后尝试 [debug channel][3]。兜了一个圈子，总算在我的 Fedora 16上装好了 mingw.

首先，要去 [fedora packages][4] 搜索 mingw 的包。搜完以后，把看着舒服的装上吧（我不太清楚哪些必要就装了一大堆。。。反正 mingw-gcc 肯定是必要的）。

装好后，我尝试输入 `mingw`, `mingw32`, `gcc-mingw` 等，但都提示“找不到命令”。最后解决的方法很简单： 输入 `ls /usr/bin | grep mingw` ， 在里面找到需要的命令就可以了。在我的电脑上，就是 `i686-pc-mingw32-gcc`。

接着，就是 Hello World 的时间了：

$ i686-pc-mingw32-gcc hello.c -o hello.exe

$ wine hello.exe

Hello, MingW!

<font size="0" color="#F3F3F3">距上一次写日志已经很久很久了吧。。。</font>

[1]: http://www.freelists.org/list/wine-zh
[2]: http://www.freelists.org/post/wine-zh/-WIne
[3]: http://wiki.winehq.org/DebugChannels
[4]: https://apps.fedoraproject.org/packages/

