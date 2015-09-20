---
layout: post
title: "Fedora 22 下安装 TeXStudio 与 TeXLive 2015"
description: ""
category: linux
tags: [fedora, LaTex]
---
{% include JB/setup %}

写这篇文章的起因，是我要使用 CTeX 宏集中的 `\ctexset` 指令自定义显示效果。但是，编译时，却总是提示 `Undefined control sequence. \ctexset`。在 Google 上搜索了一下，发现 `\ctexset` 是新版本的 `ctex` 引入的，而 Fedora 软件源中的 `texlive-ctex` 很旧，因此无法编译。最简单的解决办法，就是放弃 Fedora 的包管理系统，而统一使用 TeXLive 的 `tlmgr` 来管理宏包，并手动安装 TeXStudio。现将安装步骤记录如下：

###卸载原有的 (La)TeX 软件包
{% highlight sh %}
$ rpm -qa | egrep ^tex > rpm_tex
$ sudo dnf remove `cat rpm_tex`
{% endhighlight %}

###安装 TeXLive 2015
#### 安装依赖
{% highlight sh %}
$ sudo dnf install perl-Digest-MD5
{% endhighlight %}
#### 下载安装包
官网上提供了[多种下载方式][texlive]，例如便捷的在线安装包。不过，因为网络不太稳定，所以我选择了直接下载 ISO 的方式。中科大的镜像链接 <http://mirrors.ustc.edu.cn/CTAN/systems/texlive/Images/>

#### 运行安装程序
{% highlight sh %}
$ mkdir /dev/shm/tex
$ su
# mount -o loop texlive2015.iso  /dev/shm/tex
# cd /dev/shm/tex
# ./install-tl
# umount /dev/shm/tex
{% endhighlight %}
安装时，可以按 D 设置安装路径。为了便于维护，我设为了 `/opt/texlive2015`

#### 升级软件包
{% highlight sh %}
$ cd /opt/texlive2015/bin/x86_64-linux
$ su
# ./tlmgr update --self
# ./tlmgr update --all
# ./mktexlsr
{% endhighlight %}
最后一步是为了重建数据库。

#### 安装 TeXStudio
TeXStudio 是跨平台软件，但并没有提供编译好的 bin 包。Fedora 软件源里有编译好的 TeXStudio，但依赖软件源自带的 TeXLive。所以，我们要手动从[ koji 上下载软件包][koji]并处理依赖关系。
{% highlight sh %}
$ su
# dnf install perl-Tk libpaper qtlockedfile-qt5 qtsingleapplication-qt5 zziplib
# wget https://kojipkgs.fedoraproject.org//packages/texstudio/2.9.4/3.fc22/x86_64/texstudio-2.9.4-3.fc22.x86_64.rpm
# rpm -ivh --nodeps texstudio-2.9.4-3.fc22.x86_64.rpm
{% endhighlight %}

#### 设置环境变量
如果在安装 TeXLive 的时候没有让安装程序自动创建快捷方式的话，就要手动编辑环境变量了。在 `~/.bashrc` 中加入
{% highlight sh %}
export MANPATH=${MANPATH}:/opt/texlive2015/texmf-dist/doc/man
export INFOPATH=${INFOPATH}:/opt/texlive2015/texmf-dist/doc/info
export PATH=${PATH}:/opt/texlive2015/bin/x86_64-linux
{% endhighlight %}

同时，为了让 TeXStudio 能正确加载我们安装的 TeXLive，我们要移动 `/bin/texstudio`，并创建新的 `/bin/texstudio` 文件。
{% highlight sh %}
#!/bin/bash

export MANPATH=${MANPATH}:/opt/texlive2015/texmf-dist/doc/man
export INFOPATH=${INFOPATH}:/opt/texlive2015/texmf-dist/doc/info
export PATH=${PATH}:/opt/texlive2015/bin/x86_64-linux

/bin/texstudio.bak #指向原有的二进制文件

{% endhighlight %}
接着，`chmod +x /bin/texstudio` 就可以运行 TeXStudio 了。

####推荐阅读
[Linux下安装TeXLive 2015 by SeisMan](http://seisman.info/install-texlive-under-linux.html)  
[CTeX宏集手册 v2.2](ftp://ftp.fu-berlin.de/tex/CTAN/language/chinese/ctex/ctex.pdf)  
<a href="http://www.amazon.cn/gp/product/B00D1APK0G/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B00D1APK0G&linkCode=as2&tag=blo-23">《LaTeX入门》</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=blo-23&l=as2&o=28&a=B00D1APK0G" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


[koji]: http://koji.fedoraproject.org/koji/buildinfo?buildID=638712



[texlive]: http://www.tug.org/texlive/
