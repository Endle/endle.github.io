---
layout: post
title: "Codeforces 282B Painting Eggs 题解与贪心算法的证明"
description: ""
category: algorithm
tags: [codeforces, 算法竞赛]
---

题目链接: <https://codeforces.com/problemset/problem/282/B>

官方题解: <https://codeforces.com/blog/entry/6999>

[官方代码](https://codeforces.com/contest/282/submission/3314492)


CF 282B 我思考了很久，也没有什么头绪。看了官方题解，发现可以用一个很简单的贪心算法求解。证明的过程要用到数学归纳法(Mathematical induction)，我按照我的理解，把证明过程详细地写下来。

贪心算法：对于每一个鸡蛋，尝试让 A 喷绘。如果这会导致让 A 的收入高于 G 的收入，且超出了 500 的幅度，则把这个鸡蛋交给 G。

引理1：对于合法的输入数据，一定存在至少一种方法，使得两人的收入和之差 
$$ |S_a - S_g| \leq 500 $$


求证：使用贪心算法，可以得到正确解。

Base case is trivial.

递推步骤，假设对于前 `i-1` 个鸡蛋，我们已经找到了一种方法，满足
$$ |S_a - S_g| \leq 500 $$
。不失一般性 (WLOG)，我们假定 
$$ S_a - S_g = D$$
  且 
$$ 0 \leq D \leq 500$$

现在，我们尝试将第 `i` 个鸡蛋分配给 A. 如果 
$$ D + a_i \leq 500 $$
仍然成立，那我们就得到了满足前 `i` 个鸡蛋的合法方案。

反之，我们将第 `i` 个鸡蛋分配给 G。此时，
$$ a_i > 500 - D \iff 1000 - g_i > 500 - D \iff g_i < 500 + D$$

新的差值是 
$$D_i = (S_g + g_i) - S_a = g_i - D$$
显然 
$$ -D \leq D_i < 500 $$
我们就得到了满足前 `i` 个鸡蛋的合法方案。

引理1 也由此得到了证明。Base case 选择一个报酬不超过 500 元的人，接着每次扩展，都不会打破 500 元工资差的限制。

#### 弯路  
看答案之前，我没有想到引理1. 我猜到这是一道贪心的题目，但题目里的“无法满足时输出-1”迷惑了我，让我一直在想，我的贪心策略会不会让一个可行的输入被误认为不可能。

我一直试图寻找一个给输入数据排序的方法，接着用类似对对碰的方式进行贪心匹配。我一直试图找一个例子，证明错误的贪心顺序会导致错误。最终当然是找不到了。

这道题给定的限制条件是不超过 500 的工资差，而两人的工资和则恰巧是 1000 元。这其实给了我很大的提示，两人的工资差可能是钟摆式的摆动，但我没有顺着这个思路思考下去。

我在做这道题的时候，一度试图把 500 元的条件拿掉，去找一个让两人工资差最低的方案。我成功地给自己找了一个困难得多的问题。

{% include mathjax.html %}