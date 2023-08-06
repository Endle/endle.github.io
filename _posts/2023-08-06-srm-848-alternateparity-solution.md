---
layout: post
title: "TopCoder SRM 848 AlternateParity 题解"
description: ""
category: 
tags: [algorithm, 算法竞赛]
---

2023年8月3日，我参加了 [TopCoder SRM 848](https://community.topcoder.com/stat?c=round_overview&rd=19668)，结果 Div I 第一题就没做出来，零分完赛。赛后看了[其他选手的代码](https://community.topcoder.com/stat?c=problem_solution&cr=90029704&rd=19668&pm=18085)，意识到这其实是一个比较基础的组合数学问题。  

## [题目描述][]  

相比于原有的 [题目描述][]， 我决定将其转换为如下形式： 给定两个正整数 `X` `L`, 生成一个长度为 `L` 的数列，要求：  

1. 数列严格单调递增  
2. 相邻的两个数字奇偶性不同  
3. 数列的每个元素为正整数  
4. 数列最后一个元素 $a_L=X$  

求所有合法的序列数量，并对某大质数取模。  

## 解答  

可以通过若干步变换，将它转化为一个[隔板法（Stars and bars）][隔板法]问题。  

### a1 的奇偶性   
对 X 和 L 的奇偶性分类讨论，一共有四种情况。易证 $(X+L)\%2==0$ <=> $a_1\%2==0$   

### 构建辅助序列 b  

数列 a 要求相邻的两个数字奇偶性不同，也就是相邻的元素的差为基数。通过求差值，我们可以定义一个辅助数列 `b`，使序列中的每一个元素都为偶数。  

#### a1 为奇数  
$$
 b =  \left\{ \\
\begin{aligned}
	& b_1 = a_1 - 1 \\
	& b_i = a_i - a_{i-1} - 1
\end{aligned}
\right.
$$   



$\sum_{i=1}^{L}b_i = a_L-L = X-L$

#### a1 为偶数  
$$
 b =  \left\{ \\
\begin{aligned}
	& b_1 = a_1 - 2 \\
	& b_i = a_i - a_{i-1} - 1
\end{aligned}
\right.
$$  
$\sum_{i=1}^{L}b_i = a_L-L = X-L-1$  

#### 数列b的性质  
无论 $a_1$ 的奇偶性，数列b都符合：    
$b_i \% 2 == 0$  
$b_i \geq 0$  

### 构建辅助数列 c 以便用隔板法求解  
定义 $c_i = \dfrac{b_i}{2} + 1$, 则 $$c_i \in \mathbb{R}+$$   


$$\sum_{i=1}^{L}c_i = L + \dfrac{\sum_{i=1}^{L}b_i}{2}$$  


$$
 \sum_{i=1}^{L}c_i  =  \left\{ \\
\begin{aligned}
	& \dfrac{X+L}{2},   \text{same_parity} \\
	& \dfrac{X+L-1}{2},   \text{diff_parity}
\end{aligned}
\right.
$$  


求数列c一共有多少种合法的情况，正是 [隔板法][] 的标准模型。  

### 对组合数取模   
这个基础问题触及了我的知识盲区。查到的两份资料（[A](https://xienaoban.github.io/posts/36480.html#n%E7%9B%B8%E5%AF%B9%E5%B0%8F%E6%96%B9%E4%BE%BF%E6%89%93%E8%A1%A8p%E5%8F%AF%E4%BB%A5%E5%BE%88%E5%A4%A7p%E8%A6%81%E6%B1%82%E4%B8%BA%E7%B4%A0%E6%95%B0)，[B](https://cp-algorithms.com/algebra/module-inverse.html#finding-the-modular-inverse-using-binary-exponentiation)）提到，可以使用[费马小定理 Fermat's little theorem](https://en.wikipedia.org/wiki/Fermat%27s_little_theorem) 解决这一问题。  


##  比赛复盘  
比赛时，我先写出了朴素的 DP 代码 `f[L,X] = f[L-1,X-1] + f[L-1,X-3] +...`，并把这个表格显示了出来，试图找它的规律。初看起来，这和杨辉三角的形态比较类似，但我没有顺着这个方向思考下去，而试图去优化 DP 方程。赛后看到其他选手的代码，才发现是组合数学的问题。

我的代码存档: <https://gist.github.com/Endle/1381aa72eb07fe1c92a5de2ff1cb83f6>  
抢在[官方题解](https://www.topcoder.com/blog/tag/srm/)发布前写完了本文，希望搜索引擎们能给我送一些流量。  



[题目描述]: https://community.topcoder.com/stat?c=problem_statement&pm=18085&rd=19668&rm=&cr=90029704
[隔板法]: https://en.wikipedia.org/wiki/Stars_and_bars_(combinatorics)  


{% include mathjax.html %}
