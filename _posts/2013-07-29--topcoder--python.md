---
layout: post
title: "在 Topcoder 上使用 python"
description: ""
category: algorithm 
tags: [python, topcoder, 算法竞赛]
---

据 [人人上的消息][rr], topcoder 的 SRM 已经开始支持 python 了。今天没事，就测试了一下。
[rr]: http://renren.com/acmicpc

题目： SRM 568 Div2 250 （很水T_T）
代码如下
{% highlight python %}
import sys
class TheSimilarNumbers:
    def find(self, lower, upper):
        ans = 0
        x = lower
        while x <= upper:
            ans += 1
            x = x * 10 + 1
        print sys.version
        return ans
"""
Standard Output:
2.6.6 (r266:84292, Feb 22 2013, 00:00:18) 
[GCC 4.4.7 20120313 (Red Hat 4.4.7-3)]
"""
{% endhighlight %}

可以看出，Topcoder 官方提供的 python 版本非常旧，仅为 2.6.6 （我学的是 python3 怎么办QAQ）。同时，python 的常数比起 C++ 来也差了不少。如此简单的代码，C++ 每个点都是 1ms 以内，但 python 跑出 15ms 很正常。不知道在某些题目上是否会被常数坑。

此外，很多插件还不支持 python。比赛的时候，可能不太方便。
<P STYLE="margin-bottom: 0in"><FONT COLOR="#e6e6e6"><FONT FACE="WenQuanYi Zen Hei Sharp"><FONT SIZE=2 STYLE="font-size: 10pt"><SPAN LANG="zh-CN">本来挺想写个插件的，但这样我就要去学
</SPAN></FONT></FONT>Java<FONT FACE="WenQuanYi Zen Hei Sharp"><FONT SIZE=2 STYLE="font-size: 10pt"><SPAN LANG="zh-CN">。看看桌子上的书，额，我还是算了吧</SPAN></FONT></FONT></FONT></P>
