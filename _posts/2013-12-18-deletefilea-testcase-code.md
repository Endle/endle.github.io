---
layout: post
title: "DeleteFileA 的 testcase 的代码阅读笔记"
description: ""
category: wine
tags: [wine, kernel32, git]
---
{% include JB/setup %}

为了处理 [Wine bug 34324](http://bugs.winehq.org/show_bug.cgi?id=34324)，我看了 `kernel32.dll` 里 `DeleteFileA()` 和其 testcase 的代码，发现埋藏了不少的坑。考虑到最近我会比较忙，就先做一些简单的记录，回头再进一步的处理。

坑有哪些
---
个人以为，这段代码历史 **悠久** 是问题的关键。  
1. Windows API 的变化  
很多组 testcase 是 2002 年左右加上去的。当时 XP 刚刚面世。这么多个版本过来，很多 Win API 的行为都变了，尤其是非法情况下的返回值。  
2. Wine 的代码质量  
翻了 git log，发现 Wine 的一些旧代码的质量真不敢恭维。欠缺了很多的注释，git commit 时写的 comment 也不准确，这给后来的工作带来了一些障碍。  

如何去做
--
我的设想是这样的：  
1. DeleteFileA 的 testcase  
2. DeleteFileA (要把很多组 todo_wine 解决掉)  
3. hack SHFileOperation (in shell32.dll)  

阅读笔记
----
好了，现在到正题了。我看到的是这段代码
{% highlight c %}
    ret = DeleteFileA(NULL);
    ok(!ret && (GetLastError() == ERROR_INVALID_PARAMETER ||
                GetLastError() == ERROR_PATH_NOT_FOUND),
       "DeleteFileA(NULL) returned ret=%d error=%d\n",ret,GetLastError());

    ret = DeleteFileA("");
    ok(!ret && (GetLastError() == ERROR_PATH_NOT_FOUND ||
                GetLastError() == ERROR_BAD_PATHNAME),
       "DeleteFileA(\"\") returned ret=%d error=%d\n",ret,GetLastError());
{% endhighlight %}
这来自于  e948ad1fc7e18a2，由 Francois Gouget 在 2002 年 12 月提交。

还有这段  
{% highlight c %}
    ret = DeleteFileA("nul");
    ok(!ret && (GetLastError() == ERROR_FILE_NOT_FOUND ||
                GetLastError() == ERROR_INVALID_PARAMETER ||
                GetLastError() == ERROR_ACCESS_DENIED ||
                GetLastError() == ERROR_INVALID_FUNCTION),
       "DeleteFileA(\"nul\") returned ret=%d error=%d\n",ret,GetLastError());
{% endhighlight %}

`ERROR_INVALID_PARAMETER` 来自 c49b9485，由 Jakob Eriksson 在 2004 年 4 月提交。 至于 `ERROR_INVALID_FUNCTION` 来自 6cb97534 Jacek Caban， 在 2005 年 6 月提交。


PS `git blame file.c > /dev/shm/log` 真神器。

