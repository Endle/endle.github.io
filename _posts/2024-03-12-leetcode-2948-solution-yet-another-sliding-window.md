---
layout: post
title: "LeetCode 2948 题解 (又是 Sliding Window)"
description: ""
category: algorithm
tags: [sliding window, 算法竞赛]
---

题目链接 <https://leetcode.com/problems/apply-operations-to-maximize-frequency-score/description/>  

### 题目描述    
在一个一维坐标轴上有 N 个村庄 (0-indexed)，坐标 `A[i]` 为正整数。  给定最大交通成本 `k`.  
我们准备设立一个邮局。选择一个区间 `[L,R]` 和邮局坐标 `x`, 定义交通成本 $c=\sum_{i=L}^{R}|x-A_i|$ 。 在满足 $c<=k$ 的前提下，找到最大的区间。


### 题目分析   
我们先考虑一个子问题：对于给定的区间 `[L,R]`，我们如何求出最低的交通成本。对此，我们先引入三个引理：    
1. $A_L <= x_{opt} <= A_R$  (Too Trivial)
2. 最优的邮局坐标一定和某个村庄(M-th)重合，即 $x_{opt}=A_M$.  
3. 如果区间长度为奇数，则 $M_{opt}$ 就是最中心的一个村庄。如果为偶数，那最中间的两个村庄都是最优的选择.

在此基础上，我们可以通过如下变换，利用前缀和，在常数时间内求出特定区间的交通成本 $c$  


$$
\begin{aligned} 
c &= c_L + c_R \\
c_L &= \sum_{i=L}^{M} A_M - A_i \\
&= (M-L+1)A_M - \sum_{i=L}^{M}A_i \\
&= (M-L+1)A_M - ( \sum_{i=0}^{M}A_i  - \sum_{i=0}^{L-1} A_i)\\
c_R &= \sum_{i=M}^{R} A_i - A_M \\
&= \sum_{i=0}^{R} A_i - \sum_{i=0}^{M-1}A_i - (R-M+1)A_M
\end{aligned}
$$

( $P_V = \sum{i=0}^{V} A_i$ )

{% include mathjax.html %}
