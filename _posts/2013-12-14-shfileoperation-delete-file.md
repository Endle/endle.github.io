---
layout: post
title: "SHFileOperation 删除文件的小测试"
description: ""
category: linux 
tags: [wine, shell32]
---
{% include JB/setup %}

这段时间处理 [Wine bug 34324: QQ2013 SP1 can't install][34324]， 发现问题没有想象的简单。把之前取得的成果先记录下来，希望能给同样遇到这个问题的人一点提示，也算给自己留下一点笔记。

**注意： 以下的所有结果是通过包括 [Wine Testbot][bot] 等黑箱测试得到的，没有任何反汇编的内容。如果你对 Wine 开发感兴趣，也请不要参考类似的资料**

bug 简介
---
QQ2013 SP1 安装时，会调用 `SHFileOperation` 删除 `C:\\Program Files\\qqtest`。但如果该目录不存在，这次函数调用就会失败。  
在 WinXP 下，返回值时 `0x402`。而在 Vista 及以后版本中，返回值就是 `ERROR_FILE_NOT_FOUND` (`0x2`)。  
但是，在当前的版本(wine-1.7.8)中，返回值为 `ERROR_PATH_NOT_FOUND`(`0X3`)。所以，在 QQ2013 Installer 看来，这不符合预期，就拒绝继续安装。

测试进程
---
为了完成这个 hack，我研究了一下 Wine 原有的 testcase (`dlls/shell32/tests/shlfileop.c`, `commit a1762ba8a46eca5c7ef1e`)  
在 `test_delete()` 函数里，主要的情况是：  
1. delete a nonexistent file  
事实上，如果找不到文件，系统是无法区分 file 和 dictionary 的。在 XP 下，返回值是 `0x402`，而 Vista 及以后，返回值都是 `ERROR_FILE_NOT_FOUND`  
2. delete a nonexistent file in an existent dir or a nonexistent dir  
对于前者(existend dir)，结果与 delete nonexistent file 是一样的。  
对于后者，XP 的返回值依旧是`0x402`，而 Vista 及以后的版本中，返回值是 `DE_INVALIDFILES`(`0x7c`)。  
3. delete a dir, and then a file inside the dir  
这是一个比较旧的 tetscase，当时 Vista 是最新的 Windows 版本。有人留下了说明， *Vista would throw up a dialog box that we can't suppress*。但他的 hack 方式 `ret != ERROR_FILE_NOT_FOUND` 会忽略掉 Win 7/8。我提交了一个 [patch](http://source.winehq.org/patches/data/100895)，在经过 Wine-devel 中的 [讨论](http://www.winehq.org/pipermail/wine-devel/2013-December/102211.html) 后，这个 patch 还是被拒绝了。Qian Hong 的解释是：  
*根据Windows版本来区分api的特性是不靠谱的，因为Microsoft会不断地发布service pack，每次发布都会修复一些bug，表面上看，某个特性可能在Windows XP和Windows 7上是不同的，可是经过更新打上某个service pack之后，Windows XP的特性和Windows 7可能就相同了。因此，要根据feature来决定要不要skip某个test。*

附上我的补丁核心部分：  
{% highlight c %}
+        ok(ret == ERROR_PATH_NOT_FOUND  ||  /* XP */
+           broken(ret == ERROR_SUCCESS) ||  /* NT4 */
+           ret == DE_INVALIDFILES,          /* Win 7 or 8 */
+           "Expected ERROR_PATH_NOT_FOUND or DE_INVALIDFILES, got 0x%x\n", ret);
{% endhighlight %}

我还做了一个测试（补丁找不到了）：删除同一个文件两次，运行结果和情况 3 是一样的。

接下来的任务
--
在 Wine 的实现里，`SHFileOperation` 会调用 `BOOL DeleteFileW`。而 `DeleteFileW` 是靠 `SetLastError()` 抛出异常的。([MSDN][]) 我看了一下 kernel32 的相关测试，覆盖的并不是很好。我的 [patch 101039][101039] 被 reject 掉了，[相关讨论](http://www.winehq.org/pipermail/wine-devel/2013-December/102265.html) 里提到，kernel32 的很多 testcase 比较旧。接下来，我打算花时间完善一下这些 testcase。



[101039]: http://source.winehq.org/patches/data/101039
[34324]: http://bugs.winehq.org/show_bug.cgi?id=34324
[bot]: http://wiki.winehq.org/WineTestBot

