---
layout: post
title: "借助 KawigiEdit 在 Topcoder 上用 python"
description: ""
category: algorithm 
tags: [python, topcoder, 算法竞赛]
---

在 [上篇文章][last] 里，我提到 *很多插件还不支持 python。比赛的时候，可能不太方便*，但我在 [Topcoder 官方论坛][bbs] 上逛了一圈，发现我要收回这句话。KawigiEdit 有一个 [非官方版][unoffi]，提供了 Python support。下载链接：<http://dl.dropboxusercontent.com/u/95690732/KawigiEdit/pf/2.2.2/KawigiEdit.jar>

这个插件使用起来还是很简单的。删掉本地的 `contestapplet.conf` 和 `contestapplet.conf.bak` ，然后进 Topcoder 重新添加该插件，接着使用默认配置即可。

相比于其他插件，KawigiEdit 的更新速度还是相当给力的。集成了语法高亮，本地测试等功能，用起来也很舒服。以后有时间，还要进一步发掘一下。

**小缺陷**

可能是插件不完善，也可能是 OpenJDK 的问题，如果写了死循环的代码，选择 Kill 的话可能会让 Topcoder Arena 卡死。明天上午就有比赛了，现在能做的，也就是尽量避免写出这样的代码吧。

祝大家都能涨 RATING！
[last]: http://endle.gitcafe.com/2013/07/29/-topcoder--python/
[bbs]: http://apps.topcoder.com/forums/?module=Main
[unoffi]: http://apps.topcoder.com/forums/?module=Thread&threadID=794920&start=0&mc=8
