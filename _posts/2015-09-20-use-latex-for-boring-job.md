---
layout: post
title: "用牛刀 LaTeX 完成简单的排版任务"
description: ""
category: tool
tags: [LaTeX]
---
{% include JB/setup %}

假期里，我们被布置了一篇报告作为作业。排版要求如下：
```
正文为宋体、小四号、1.25倍行距。标题号第一层用一、二……第二层用1、2……第三层用（1）、（2）……。
```

同时，我们的报告要求写在特定纸张上。换句话说，是要用特定的页眉页脚。如图：
![Example](/images/LaTeX/for-use-latex-for-boring-job/example.png)

在布置作业时，我们也得到了一个[Word 模板][template]。刚刚读完 [《LaTex 入门》][book]，就想着用 LaTeX 来完成这项工作。

####自定义纸张
自定义纸张可以用 [wallpaper 宏包](https://www.ctan.org/pkg/wallpaper) 来处理。这个包的功能很简单，刚好符合本例的需求。将原有的模板导出成 pdf，然后使用该宏包加载即可。


```
\CenterWallPaper{1}{background.pdf}
```

####自定义章节标题格式
新的 [CTeX 套件][CTeX] 已经能完善地支持标题格式。本例中，可以使用
{% highlight LaTeX %}
\ctexset {
	section = {
		name = {,、},
		number = \chinese{section}
	},
	subsection = {
		name = {,、},
		number = \arabic{subsection},
	},
	subsubsection = {
		name = {（,）、},
		numbering = true,
		number = \arabic{subsubsection}
	}
}
{%endhighlight %}
不过，这一功能比较新。如果使用的是较旧的套件，可能就无法正确编译。因此，建议首先升级至 texlive 2015.

[template]: /downloads/LaTeX/example/template-for-use-latex-for-boring-job.docx
[book]: http://www.amazon.cn/gp/product/B00D1APK0G/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B00D1APK0G&linkCode=as2&tag=blo-23
[CTeX]: https://www.tug.org/texlive//Contents/live/texmf-dist/doc/latex/ctex/ctex.pdf
