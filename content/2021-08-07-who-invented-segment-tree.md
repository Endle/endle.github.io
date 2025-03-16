---
layout: post
title: "线段树作者是谁"
description: ""
category: algorithm
tags: []
---

省流助手：[Jon Louis Bentley][Bentley], 于 1977 年发明.  


线段树是 OI 中常用的基础算法。出于好奇，我简单考证了线段树的诞生过程。个人能力所限，疏漏在所难免，恳请朋友们不吝赐教。  


在 1977 年，[Victor L. Klee, Jr](https://en.wikipedia.org/wiki/Victor_Klee) 发表了 [Can the Measure of U Ai, Bi Be Computed in Less Than O(n Log N) Steps?][Klee1977]. 在同年，卡内基梅隆大学的 [Bentley][] 撰写了 Algorithms for Klee's rectangle problems. 这篇文章并没有发表，我也没能在 2021 年的互联网上找到这篇文章的副本。不过，这份 Unpublished notes 被同期的多篇文章引用，如 Bentley 本人在 1980 年发表的 [An Optimal Worst Case Algorithm for Reporting Intersections of Rectangles][B1980].  

[Computational Geometry][cg] 在 Chapter 10 收录了 Interval Tree 和 Segment Tree. [维基百科](https://en.wikipedia.org/wiki/Segment_tree) 引用了 [Computational Geometry][cg]. 部分近期发表的论文，如 [Wang, Lei, and Xiaodong Wang. “A Simple and Space Efficient Segment Tree Implementation.”](https://www.sciencedirect.com/science/article/pii/S2215016119300391) 也引用了[此书][cg]。


[Klee1977]: http://www.jstor.org/stable/2318871
[Bentley]: https://en.wikipedia.org/wiki/Jon_Bentley_(computer_scientist)
[B1980]: https://ieeexplore.ieee.org/document/1675628
[cg]: https://link.springer.com/book/10.1007/978-3-540-77974-2

编辑于 2024-07-25: [Daniel Zingaro](https://www.danielzingaro.com/) 撰写的 [Algorithmic Thinking](https://nostarch.com/algorithmic-thinking-2nd-edition) 提到，Segment Tree 有 interval trees, tournament trees, order-statistic trees, range query trees 等多个名字. 书中使用了 [POI 2000: Promotion](https://www.oi.edu.pl/old/php/show.php?ac=e181313&module=show&file=zadania/oi7/promocja) 作为例题.


#### 参考资料  
- Klee, Victor. "Can the Measure of U[Ai, Bi] Be Computed in Less Than O(n Log N) Steps?" <i>The American Mathematical Monthly</i> 84, no. 4 (1977): 284-85. Accessed August 7, 2021. doi:10.2307/2318871.  
- Wang, Lei, and Xiaodong Wang. “A Simple and Space Efficient Segment Tree Implementation.” MethodsX 6 (January 1, 2019): 500–512. https://doi.org/10.1016/j.mex.2019.02.028.
- Bentley, Jon Louis, and Derick Wood. 1980. “An Optimal Worst Case Algorithm for Reporting Intersections of Rectangles.” IEEE Transactions on Computers C-29 (7): 571–77. https://doi.org/10.1109/TC.1980.1675628.
- de Berg, Mark, Cheong, Otfried, van Kreveld, Marc, and Overmars, Mark. Computational Geometry. Third Edition. Berlin, Heidelberg: Springer Berlin / Heidelberg, 2008. https://doi.org/10.1007/978-3-540-77974-2.
- Wu, Y., & Wang, J. (2018). Algorithm Design Practice for Collegiate Programming Contests and Education (1st ed.). CRC Press. https://doi-org.proxy.lib.uwaterloo.ca/10.1201/9780429401855
- [POJ 2828 Buy Tickets - Monthly, 2006.05.28, Zhu Zeyuan](http://poj.org/problem?id=2828)  
