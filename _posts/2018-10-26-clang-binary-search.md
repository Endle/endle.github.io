---
layout: post
title: "跟着 clang 的 libcxx 学习二分查找"
description: ""
category: 
tags: [C, Algorithm]
---

哪个算法简单到初学编程的人都能轻松实现，但有多年编程经验的人也可能会写出严重的 bug 呢？没错，正是二分查找。既然普通人的二分查找容易写错，那专业人士会如何实现二分查找呢？不妨参考一下 clang 7.0 的实现。  



`lower_bound` 是指在区间 `[first, last)` 中，对于任意 `i < j`，若 `comp(A[i])` 为真，则 `comp(A[j])` 必为真。如下图  

![lower_bound](/images/binary_search/lower_bound.png)

让我们看一看 [lower_bound 的实现](https://github.com/llvm-mirror/libcxx/blob/dffe9e0f1dde084f2aab8010345aeb1b7c8f7d4c/include/algorithm#L4190)  
{% highlight C++ %}
__lower_bound(_ForwardIterator __first, _ForwardIterator __last, const _Tp& __value_, _Compare __comp)
{
    typedef typename iterator_traits<_ForwardIterator>::difference_type difference_type;
    difference_type __len = _VSTD::distance(__first, __last);
    while (__len != 0)
    {
        difference_type __l2 = __len / 2;
        _ForwardIterator __m = __first;
        _VSTD::advance(__m, __l2);
        if (__comp(*__m, __value_))
        {
            __first = ++__m;
            __len -= __l2 + 1;
        }
        else
            __len = __l2;
    }
    return __first;
}
// This file is dual licensed under the MIT and the UIUC license.
{% endhighlight %}

代码很精简，不到十行，注意几个关键点就不会写错  
1. 定义：`first` 是第一个**有可能**为真的元素  
2. 迭代：`l2 < len` 恒成立，因此 `first+l2` 就不会越界。同时，每次迭代时 `len` 严格递减  
3. 迭代结束：`l2 == 0` 当且仅当 `len == 1`。这是我们最后一次进行迭代  
4. 特殊情况：如果所有的元素都为假，那最后一次迭代时， `++m` 的结果正是 `last`  

相比我之前写的不时丢弃真值、出现死循环的二分查找，clang 的代码可是高到不知道哪里去了。  

[upper_bound 的实现](https://github.com/llvm-mirror/libcxx/blob/dffe9e0f1dde084f2aab8010345aeb1b7c8f7d4c/include/algorithm#L4238) 看起来是相反的，不过从布尔值的角度看，与 `lower_bound` 是一样的，我就不复制代码了。  


上文中的示意图使用 R 语言绘制，参考了 [Stack Overflow 上画棋盘的讨论](https://stackoverflow.com/a/50438532/1166518)。代码如下  
{% highlight R %}
b <- matrix(nrow=1,ncol=6)            
colorindex <- c(rep(0, 4), rep(1, 2))
# for each square
colors <- c("red", "green")[colorindex+1] # choose colors
side <- 1/8                               # side of one square
ux <- col(b)*side                         # upper x values
lx <- ux-side                             # lower x values
uy <- row(b)*side                         # upper y
ly <- uy-side                             # upper y
plot.new()                                # initialize R graphics
rect(lx, ly, ux, uy, col=colors, asp=1)   # draw the board
{% endhighlight %}  


最后，按照惯例推荐一本书 [Effective C++:改善程序与设计的55个具体做法(第3版)](https://amazon.cn/gp/product/B004G72P24/ref=as_li_tl?ie=UTF8&tag=blo-23&camp=536&creative=3200&linkCode=as2&creativeASIN=B004G72P24&linkId=89ac958c13c0a13f2048dae9e18df523)  

