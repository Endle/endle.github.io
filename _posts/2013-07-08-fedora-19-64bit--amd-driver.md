---
layout: post
title: "Fedora 19 64bit 解决开源 AMD 显卡驱动问题"
description: ""
category: linux 
tags: [fedora, wine, video, driver]
---
{% include JB/setup %}

自从装上了 64 位的 Fedora，就没能用 wine 带起过 3D 游戏。设置上`LIBGL_DEBUG=verbose`，用 crossover 测试，有这样的提示
{% highlight c %}
libGL: OpenDriver: trying /usr/lib/dri/tls/r600_dri.so
libGL: OpenDriver: trying /usr/lib/dri/r600_dri.so
libGL error: dlopen /usr/lib/dri/r600_dri.so failed (/usr/lib/dri/r600_dri.so: cannot open shared object file: No such file or directory)
libGL error: unable to load driver: r600_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: r600
libGL: OpenDriver: trying /usr/lib/dri/tls/swrast_dri.so
libGL: OpenDriver: trying /usr/lib/dri/swrast_dri.so
libGL error: dlopen /usr/lib/dri/swrast_dri.so failed (/usr/lib/dri/swrast_dri.so: cannot open shared object file: No such file or directory)
libGL error: unable to load driver: swrast_dri.so
libGL error: failed to load driver: swrast
{% endhighlight %}
我的电脑上，只有 `/usr/lib64/dri/r600_dri.so`。很显然，我缺的是 32 位的驱动。第一反应，是建一个软链接。但这次，提示变成了

`libGL error: dlopen /usr/lib/dri/r600_dri.so failed (/usr/lib/dri/r600_dri.so: cannot open shared object file: Too many levels of symbolic links)`

那我拷贝过去呢？很遗憾，没这么简单。 `libGL error: dlopen /usr/lib/dri/r600_dri.so failed (/usr/lib/dri/r600_dri.so: wrong ELF class: ELFCLASS64)`

这里，我就只好用一个笨方法了：我从网上下载了 Fedora 19 32bit 的 ISO，然后装到了虚拟机里，再把这个文件拷贝了出来（后面我会提供链接）。

问题是，最后还是出了一点小问题
{% highlight c%}
libGL: OpenDriver: trying /usr/lib/dri/tls/r600_dri.so
libGL: OpenDriver: trying /usr/lib/dri/r600_dri.so
libGL error: dlopen /usr/lib/dri/r600_dri.so failed (libLLVM-3.3.so: cannot open shared object file: No such file or directory)
libGL error: unable to load driver: r600_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: r600
libGL: OpenDriver: trying /usr/lib/dri/tls/swrast_dri.so
libGL: OpenDriver: trying /usr/lib/dri/swrast_dri.so
libGL error: dlopen /usr/lib/dri/swrast_dri.so failed (/usr/lib/dri/swrast_dri.so: cannot open shared object file: No such file or directory)
libGL error: unable to load driver: swrast_dri.so
libGL error: failed to load driver: swrast
{% endhighlight %}

到这里，问题就简单多了。`yum install llvm.i686`，搞定。

32 位驱动下载链接：<https://skydrive.live.com/redir?resid=902E5583A63BC02B!120>

sha1sum: `86351d2d73e63c7088e90d442969643f7ad79111`

PS DOTA里的神灵果然是一个（虐AI）强大的英雄。
