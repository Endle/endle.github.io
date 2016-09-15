---
layout: post
title: "从 OI 到世界"
description: ""
category: C
tags: [C, algorithm, 算法竞赛]
---
又到了一年的高考季，而我，当年泡在机房里的高中生，已经毕业了两年。在参加 OI 比赛时，侧重点都在算法上，因而忽视了很多 C 语言的特性。在刚参与开源项目时，也多走了不少弯路。所以，我整理了一个小小的列表，希望这些问题能对你起到些许帮助。


##预处理
###预处理的潜在风险
C 语言中，预处理与编译是独立的阶段。很多时候，这会引入额外的风险。

1. 举出至少两个可能带来风险的，在 OI 中较为常用的宏，说明其危险性  
2. 用 `inline`, `const` 等方式重写，在不增加额外代价的情况下解决该问题  



###常用的宏
虽然宏很危险，但很多时候，宏有其不可替代的作用。

1. 举出至少一个例子，说明宏的必要性  
2. 解释 `__FILE__`, `__FUNCTION__`, `__LINE__` 等宏的作用  


##链接器
与许多带有 `import` 的语言不同，C 语言中链接器与编译器是分开的。链接器的机制，并不是三言两语就可以说清的。所以，在这里，我只是提几个常见的基础问题。

1. C 语言中，什么是函数的声明？什么是函数的定义？缺失了其中的一个会发生什么？  
2. `#include` 时发生了什么？为什么有时没有包含 `stdio.h` 也可以使用 `printf` 函数？  
3. 什么是动态链接？有什么好处？如何使用？  
4. 头文件中的 `extern "C"` 有什么用？如果没有，会发生什么？  

##实战演练
此部分没有固定答案，希望大家的思路不要被拘束。

###“带模版”的 qsort
`stdlib.h` 中的 `qsort` 有四个参数。它们的意义都是什么？为什么要如此定义？  
尝试自己实现一个 `my_qsort` 函数，要求：  
1. 具有普适性  
2. 在平均情况下为 `O(n lgn)` 的复杂度。  

###Better String
C 语言中并没有内置的 `string`，而只有 `char *`。请举若干例子，说明这导致了哪些问题。  
尝试在不使用编译器扩展特性的情况下，实现一个字符串类型。要求如下：  
1. 求字符串长度的时间复杂度为 `O(1)`   
2. 与 `string.h` 的 `strlen`, `strstr`, `strcat`, `strcpy` 兼容，或是重写对应的函数  
3. 额外的时间和空间代价必须是常数级的  

<br />
<br />
<br />

##参考信息
我并不会对这些问题给出标准答案。如果你感觉没什么头绪，可以参考如下信息

####举出至少一个例子，说明宏的必要性  
1. Windows API 中的 [VARIANT][] ([Wine 中的实现][winev])  
2. [用 C 语言实现链表][clink] 等数据结构

####C 语言中，什么是函数的声明？什么是函数的定义？缺失了其中的一个会发生什么？  
参见 [C 语言程序设计 现代方法][cmodern] 第九章 函数
####什么是动态链接？有什么好处？如何使用？  
参见 [程序员的自我修养 链接、装载与库][linker] 第7章(Linux) 第9章(Windows)  
####头文件中的 `extern "C"` 有什么用？如果没有，会发生什么？  
参见 [程序员的自我修养 链接、装载与库][linker] 3.5.4   
[Wikipedia Name Mangling](http://en.wikipedia.org/wiki/Name_mangling)  
####“带模版”的 qsort
参见 [C 语言程序设计 现代方法][cmodern] 17.7.2 指针的高级应用
####Better String
主要有两种思路：  
1. 使用结构体封装，如 [bstrlib](https://github.com/websnarf/bstrlib/blob/master/bstrlib.txt#L60)  
2. 在指针前附加信息，如 [SDS](https://github.com/antirez/sds), [BSTR](https://msdn.microsoft.com/en-us/library/ms221069.aspx)  

SDS 项目给出了[两种实现方式的对比](https://github.com/antirez/sds/blob/master/README.md#advantages-and-disadvantages-of-sds)  

[linker]: http://www.amazon.cn/gp/product/B0027VSA7U/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0027VSA7U&linkCode=as2&tag=blo-23
[linuxc]: http://songjinshan.com/akabook/zh/
[cmodern]: http://www.amazon.cn/gp/product/B003BVBOOQ/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B003BVBOOQ&linkCode=as2&tag=blo-23
[sds]: https://github.com/antirez/sds
[bstr]: https://github.com/websnarf/bstrlib/blob/master/bstrlib.txt#L60
[VARIANT]: https://msdn.microsoft.com/en-us/library/windows/desktop/ms221627%28v=vs.85%29.aspx
[winev]: https://gitcafe.com/WineZH/wine/blob/master/include/oleauto.h#L102
[clink]: {% post_url 2013-05-06-c_list %}


### 书籍推荐
<a href="http://www.amazon.cn/gp/product/B00FF1Y53C/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B00FF1Y53C&linkCode=as2&tag=blo-23">一站式学习C编程</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=blo-23&l=as2&o=28&a=B00FF1Y53C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.cn/gp/product/B0027VSA7U/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0027VSA7U&linkCode=as2&tag=blo-23">程序员的自我修养:链接、装载与库</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=blo-23&l=as2&o=28&a=B0027VSA7U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.cn/gp/product/B003BVBOOQ/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B003BVBOOQ&linkCode=as2&tag=blo-23">C语言程序设计:现代方法(第2版)</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=blo-23&l=as2&o=28&a=B003BVBOOQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.cn/gp/product/B0012UMPBY/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0012UMPBY&linkCode=as2&tag=blo-23">C陷阱与缺陷</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=blo-23&l=as2&o=28&a=B0012UMPBY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

