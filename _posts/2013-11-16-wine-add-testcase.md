---
layout: post
title: "为 wine 添加 testcase"
description: ""
category: linux 
tags: [wine]
---
{% include JB/setup %}

之前处理一个 [QQ2013安装程序无法完成的 bug][qqbug]，经过分析，问题锁定在了 `SHFileOperation` 函数上。[MSDN 的函数介绍][msdn]

QQ 的安装程序会尝试删去 `C:\Program Files\qqtest`。文件不存在时，`SHFileOperation` 函数会有一个返回值（XP 和 Vista 及以后不同）。但是 wine 并没有正确的提供改返回值，所以 QQ 的安装程序就认为发生了错误，而停止了安装。

###Wine Test
要保证 Wine 的函数实现和 windows 下的表现一样，就需要一些测试。进入 wine 的源代码目录下的 dlls 文件夹，然后选定一个 dll（本例是 shell32），然后里面会有一个 tests 文件夹。里面，就有了一些 test case。

例如 `shlfileop.c`，里面有许多 static 函数。在函数内，大量的调用了 `ok` 宏。它了用法很简单，就像 `assert` 宏一样。如果某句假定不成立，那就可以在前面一行加上 `todo_wine`。这样的话，该 ok 宏会在 windows 下测试，而不会在 wine 下测试。

编辑好后，在 tests 目录下运行 `make test`。然后，就能看到对 wine 的运行情况的反馈。

####Test bot
一个人要测试 windows API 在不同版本下的表现是很繁琐的，所以，有了 [WineTestBot][wiki]。把自己的补丁提交到 <newtestbot.winehq.org> 上，就会自动进行测试，并在结束后把结果发送到你的邮箱里（为什么想到了OJ？） 

附：[我们在邮件列表里进行的讨论][talk]

[talk]: http://www.freelists.org/post/wine-zh/SHFileOperationW-about-Bug-34324
[wiki]: http://wiki.winehq.org/WineTestBot
[qqbug]: http://bugs.winehq.org/show_bug.cgi?id=34324
[msdn]: http://msdn.microsoft.com/en-us/library/windows/desktop/bb762164%28v=vs.85%29.aspx
