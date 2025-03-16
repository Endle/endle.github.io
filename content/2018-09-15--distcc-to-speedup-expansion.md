---
layout: post
title: "用 distcc 加快编译 续篇-clang"
description: ""
category: 
tags: []
---

[上一篇文章](https://endle.github.io/2018/09/10/distcc-to-speedup/) 简单介绍了使用 `distcc` 编译 wine 代码。有人在朋友圈里问我，能不能用 `clang` 编译。我当时的回答是，为什么不能呢？这周在摸鱼的时候，我完成了测试。


#### 理论分析  
我看了一下 [`distcc` 的代码](https://github.com/distcc/distcc/blob/24f73c5cd8f839bd520eb52e91d0d26e07689373/src/distcc.c#L249)，发现其机制还是比较简单的。`distcc` 后的一个参数会被当成编译器名称。理论上，不管是 gcc 还是 clang，都应该可以用类似的机制在多台电脑间分发。  

#### 实战演练
因为这里仅仅是为了测试，而不是实际运行，我就不用麻烦地在 32-bit 和 64-bit下编译 wine 两次了。workflow如下   

{% highlight bash %}
function mkwine_clang()
{
    export CC="clang-6.0"
    export CXX="clang-6.0"
    export CFLAGS="-O0"
    export JOBS=8
    mkdir -p ~/src/wine_n_extras/wine-clang
    cd ~/src/wine_n_extras/wine-clang
    ../wine/configure --enable-win64
    make -j$JOBS
}
{% endhighlight %}

[wine 项目组对 clang 投入的精力](https://wiki.winehq.org/Clang) 是有回报的。我没有做任何额外的设置，就在本机成功编译了 wine  


[在 Ubuntu 上安装 clang](http://apt.llvm.org/) 非常简单。很有趣的是，在我的 Ubuntu 14 工作站上，`clang` 默认是指向 `clang-3.3` 到 `clang-3.5` 的软链接。不过，在工作站和笔记本上，`/usr/bin/clang-6.0` 都是可用的。因此，我们可以对编译的 workflow 稍加修改  


{% highlight bash %}
function mkwine_clang()
{
    export CC="distcc clang-6.0"
    export CXX="distcc clang-6.0"
    export CFLAGS="-O0"
    export JOBS=8
    export DISTCC_HOSTS="@beddp,lzo"
    mkdir -p ~/src/wine_n_extras/wine-clang
    cd ~/src/wine_n_extras/wine-clang
    ../wine/configure --enable-win64
    make -j$JOBS
}
{% endhighlight %}


在我的电脑上，这一流程非常的顺利。理论分析和实践演练同时成功的情景真是太少了。   

*In theory, theory and practice are the same. In practice, they are not.  -Anonymous*  

#### 不仅仅是C   
上文提到，`distcc` 判断编译器的方法很简单。那么，能不能用它来分发其他语言呢？很抱歉，这可能不行。[`dcc_scan_args` 函数会尝试解析编译选项](https://github.com/distcc/distcc/blob/5de24577858687106c27dce1c1ae53edac2f6a6f/src/arg.c#L130)。如果要使用其他的编译器，个人猜测，必要条件包括使用与 `gcc`，`clang` 相同的编译选项。[Rust 社区在 2017 年年末进行了讨论](https://users.rust-lang.org/t/contract-opportunity-mozilla-distributed-compilation-cache-written-in-rust/13898）,但好像并没有得出太好的解决方案。  
不过，这也称不上太大的损失。人生苦短，在 C/C++/Rust 以外，我们也不再需要一门编译超慢的语言了，不是吗？  

