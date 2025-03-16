---
layout: post
title: "用 distcc 加快编译"
description: ""
category: 
tags: [distcc, GCC]
---

我的卧室迎来了新成员 - 拥有双 Xeon E5649 的工作站。在安顿好后，我就第一时间开始研究用 `distcc` 来加快编译速度了。毕竟，与其让我的 XPS 15 被折磨，不如把这个工作交给局域网内的工作站。官网提供了一份 [60-second instructions][distcc] ，不妨一试。如果你是在60秒内完成了配置的幸运儿，那请关掉本页面。如果你遇到了阻碍，那么请看下一节。  


### Server / Slaves / 工作站设置  
为了方便地调试，我选择在工作站上运行 `distccd --no-detach  --daemon  --allow 192.168.1.0/24 --log-stderr --verbose -j 1`  
在新版本的 `distcc` 里，`--allow`参数已经是必选项了。在完成了调试后，我在生产环境中设置成了 `-j 10`，避免将 12 核都跑满后，ssh访问工作站会有一定延迟。另一种解决方法是，通过设置 `nice` 避免吃光资源。

### 本地设置  

#### 支线任务 - SSH name  
通过`~/.ssh/config` 可以给自己局域网中的电脑分配一个简单易记的名字。我将我的工作站命名为了 `beddp`。不设置不影响使用。如果第一次接触这一概念，可以阅读 <https://serverfault.com/a/215027>  
 
#### 主线任务  
首先要设置环境变量 `export DISTCC_HOSTS="@beddp,lzo,cpp"`  
`@beddp` 的意思是，通过 ssh 连接到名为 `beddp` 的主机。`,lzo,cpp` 这两个设置是为了开启 pump模式。详情可以阅读 [Arch Wiki](https://wiki.archlinux.org/index.php/Distcc#For_use_without_makepkg)  

测试代码选择  
{% highlight C %}
#include <stdio.h>
int main(){
    puts(__VERSION__); return 0;
}
{% endhighlight %}

在本地运行 `gcc k.c -o local.out && ./local.out` 的结果是 `8.1.1 20180712 (Red Hat 8.1.1-5)`  
在服务器运行 `gcc k.c -o server.out && ./server.out` 的结果是 `4.8.4`  

gcc 版本的差异可能会导致各类潜在的问题。但现阶段，可以以此测试 `distcc` 是否正常工作

在本机运行 `DISTCC_VERBOSE=1 pump distcc gcc -c k.c -o k.o && gcc k.o -o server.out && ./server.out` 结果是 `4.8.4`。简单来说，添加了 `pump` 指令，意味着测试文件和涉及到的头文件会被发送到了工作站上，进行预处理以及编译，并在本地完成了最终的链接。我们也可以运行 `distcc gcc -c k.c -o k.o && gcc k.o -o server_nopump.out && ./server_nopump.out` 结果就变为了 `8.1.1 20180712 (Red Hat 8.1.1-5)`。 可以看到，没有了 `pump` 指令，预处理工作是在本地处理的    

在本机也可以运行 `distccmon-text 2`。这会启动一个两秒钟刷新一次的监视器，显示任务的分配状态。

### 项目实战  

让我们开一瓶香槟，选一个项目实战一下。按照教程，我们只需要把运行 `make -j8 CC=distcc`即可。不过，很遗憾，我在 wine 项目上的测试失败了。即便 [Wine Wiki](https://wiki.winehq.org/Gcc) 显示 gcc 4.8.4 应当可以成功编译 wine，`distcc` 也没有顺利地接过工作。相反，它不停地显示 `(dcc_build_somewhere) Warning: failed to distribute, running locally instead`。  
我在工作站上编译安装了 gcc 8。`distccd`命令支持指定 PATH，但我选择了笨办法：在本机和工作站上，都设置了一个软链接 `/usr/local/bin/gcc-8`。在编译前，设置 `export CC="ccache distcc gcc-8"`。在 ccache 缓存失败时，`distcc` 会将任务转交给工作站进行处理。我并没有统计具体的编译耗时，但个人体验是有断崖式提升的：在配置前，如果代码变化量大，编译代码时我的 XPS 机身会变得滚烫，同时风扇狂转。而配置好 `distcc` 后，即便在 ccache 缓存清空的情况下编译，自己的笔记本依旧凉爽安静。

最后附上我用 `distcc` 编译 wine 的 workflow，比较复杂，个别地方的写法也有待商榷。欢迎大家在评论区，或是向我发送邮件进行讨论。

{% highlight bash %}
function cfgwine64()
{
    cd ~/src/wine_n_extras/wine64-build && ../wine/configure --enable-win64
}
function cfgwine32()
{
    cd ~/src/wine_n_extras/wine32-build &&\
    PKG_CONFIG_PATH=/usr/lib/pkgconfig \
    ../wine/configure --with-wine64=../wine64-build
}
function mkwine()
{
    export DISTCC_HOSTS="@beddp,lzo,cpp"
    export CC="ccache distcc gcc-8"
    export CFLAGS="-O0"
    export JOBS=16
    export DISTCC_HOSTS="@beddp,lzo"
    cdwine
    cfgwine64
    make -j$JOBS
    cfgwine32
    make -j$JOBS
}
{% endhighlight %}



[distcc]: https://cdn.rawgit.com/distcc/distcc/9a09372bd3f420cdd7021e52eda14fa536a3c10e/doc/web/index.html
