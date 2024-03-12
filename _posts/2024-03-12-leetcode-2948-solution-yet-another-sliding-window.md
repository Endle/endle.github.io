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


### 算法实现   
有了如上的分析，实现 Sliding Window 算法就非常容易了。将所有坐标排序后，先求出前缀和 $P_V = \sum{i=0}^{V} A_i$。  

我们将初始的 Window 设置为 $L=R=0$. 显然，此时 $c=0$,是一种合法的情况。按照通常的 Sliding Window 的做法，我们不断移动右边界 $R$，在 $c>k$ 时移动左边界 $L$. 和其他的 Sliding Window 方法一样，我们的贪心算法会找出最优解。

### 引理证明  

#### Lemma 2  
使用反证法，假设 $A_M < x_{opt} < A_{M+1} $, 此时交通成本  
$$
\begin{aligned} 
c &= c_L + c_R \\
 &= \sum_{i=L}^{M} x_{opt} - A_i + \sum_{i=M+1}^{R} A_i - x_{opt}\\
\end{aligned}
$$

我们将邮局向左移动至 $ A_M = x' < x_{opt} < A_{M+1} $,  $x_{opt}-x'=d>0$    

左侧的 $(M-L+1)$ 个村庄的成本会下降  $(M-L+1)d$,  而右侧的 $(R-M)$ 个村庄的成本会上升 $(R-M)d$.  

这样，我们分三种情况讨论：　　
1. 如果 $x_{opt}$ 左侧的村庄更多，即 $M-L+1 > R-M$,　那　$x'＝A_M$　优于 $x_{opt}$   
2. 如果两侧的村庄一样多，那么移动至 $x'＝A_M$ 不会得到更差的结果　　
3. 如果右侧的村庄更多，那易证 $x'\'＝A_{M+1}$　优于 $x_{opt}$   

Lemma 2 得证。　　

#### Lemma 3  
可以沿用类似　Lemma 2　的证明方法。我们首先假设

$$
\begin{aligned} 
c_L -= (M-L+1)d
\end{aligned}
$$
$$
\begin{aligned} 
c' &= c_L + c_R \\
 &= \sum_{i=L}^{M} x' - A_i + \sum_{i=M+1}^{R} A_i - x'\\
 &= \sum_{i=L}^{M}[ (x_{opt} - d) - A_i ] + \sum_{i=M+1}^{R} [ A_i - (x_{opt} - d) ] \\
 &= \sum_{i=L}^{M} x_{opt} - A_i - (M-L+1)d + \sum_{i=M+1}^{R} A_i - x_{opt} + (R-M)d \\
 &= c + (L+R
\end{aligned}
$$


{% include mathjax.html %}
