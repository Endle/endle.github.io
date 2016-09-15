---
layout: post
title: "jekyll下用pygment设置语法高亮"
description: ""
category: jekyll 
tags: [jekyll, pygments]
---
{% include JB/setup %}

刚装上 jekyll 的时候，语法高亮是无效的。虽然加了
    % highlight c %
但并没有高亮效果。
<a href="http://s1152.beta.photobucket.com/user/letusdo_photos/media/blog%20of%20endle/pygments1_zps45e63b67.png.html" target="_blank"><img src="http://i1152.photobucket.com/albums/p481/letusdo_photos/blog%20of%20endle/pygments1_zps45e63b67.png" border="0" alt=" photo pygments1_zps45e63b67.png"/></a>
最初，我用发芽网提供的在线高亮<br />
<a href="http://s1152.beta.photobucket.com/user/letusdo_photos/media/blog%20of%20endle/pygments0_zpsee5aab59.png.html" target="_blank"><img src="http://i1152.photobucket.com/albums/p481/letusdo_photos/blog%20of%20endle/pygments0_zpsee5aab59.png" border="0" alt=" photo pygments0_zpsee5aab59.png"/></a>
<br />但这实在是不美观。经过漫长的Google之路，找到了这篇文章 [用Jekyll和Pygments配置代码高亮](http://zyzhang.github.com/blog/2012/08/31/highlight-with-Jekyll-and-Pygments/) 。我按提示下载了pygments.css 后，对下一句
>在layout中引用刚刚加的pygments.css

就没能理解。查到的一些资料说要把
{% highlight html %}
<link href="{{ ASSET_PATH }}/css/pygments.css?body=1" rel="stylesheet" type="text/css" media="all">
{% endhighlight %}
添加到*default.html*里，但大家可以看我的 [\_layouts/default.html](https://endle.gitcafe.com/endle/endle/blob/gitcafe-pages/_layouts/default.html) ，根本没有传统的html标签。显然，网页加载的不仅有*\_layouts*文件夹，应当还有一个皮肤文件夹。在那里，应该有一个完整的html页面。
最后，我找到了 [\_includes/themes/twitter/default.html](https://endle.gitcafe.com/endle/endle/blob/gitcafe-pages/_includes/themes/twitter/default.html) 找到head标签，把代码插入进去，问题就解决了。

PS [这个页面](http://stackoverflow.com/questions/9652490/do-i-need-to-generate-a-css-file-from-pygments-for-my-jekyll-blog-to-enable-col) 中提问的人实在是让人恼火。我跟他遇到了貌似相同的问题。但是，经过了提示，扔下一句
>Thanks, I figure it out! 

这是一种很不负责任的行为啊。既没有解释如何*figure*，也没有说明最后的解决方案。就把他当作反面典型，引以为戒吧。

