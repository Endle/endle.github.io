---
layout: post
title: "Codeforces 885A Vika and Her Friends (1848A) 题解"
description: ""
category: 
tags: [algorithm, 算法竞赛]
---

2023年7月16日，我参加了 [Codeforces 885](https://codeforces.com/blog/entry/118293)，没想到 A 题就碰了钉子。从赛后的[官方题解](https://codeforces.com/blog/entry/118333) 看，这道题分析起来有难度，但最终的结论非常简单。除了单纯写这篇题解，我也想写一下我比赛时的心路历程，看一看我落入的思维陷阱。

## [题目描述](https://codeforces.com/contest/1848/problem/A)    

Vika 和她的 k 个朋友们散布在一个有限大的国际棋盘上。在每个回合 t，Vika 和朋友都 **必须同时**   移动到相邻的四个格子里。虽然每次移动是同时的，但朋友们可以看到 Vika 的决策后再行动。  

给定足够长的时间，问 Vika 是否可以躲开她的朋友们。  


## 解答  

这道题存在这个性质：  

Vika is safe <=> None of Vika's friends is on a cell of same colour as Vika  



### 证明 (<=)  
  
每一次移动时，每个人脚下的颜色都必然翻转。因此，如果 **None of Vika's friends is on a cell of same colour as Vika** 在时刻 `i` 成立，那也会在任何一个时刻成立。既然颜色不重合，也就抓不到 Vika。  


### 证明 (=>)    
我的证明和官方题解略有（措辞上的）区别。既然我们要证明 **Vika is safe => None of Vika's friends is on a cell of same colour as Vika**，那我们就可以证明其逆否命题(Contraposition):

**Alice, one of Vika's friends is on a cell of same colour as Vika => Vika is not safe**  

分情况讨论如下：

#### Vika 和 Alice 在同一行或同一列(A)  

如果 Alice 和 Vika 在同一横行，也就是 Vika=`(x,y)`, Alice=`(p,y)`. 不失一般性，令 `p<x`.

##### Vika 横向移动(A1)  
如果 Vika 向右移动到 `(x+1,y)`, 那 Alice 同时移动到 `(p+1),y`. 两人间距离不变。如果重复这一步骤，Vika 会先撞墙。  

如果 Vika 向左移动 `(x-1,y)`, 因为两人初始位置同色，所以间隔至少为2. Alice 向右移动，`p+1<=x-1`. 两人间距缩小，肯定不会错开。  

##### Vika 纵向移动(A2)  
如果 Vika 向右移动到 `(x+1,y)`，那 Alice 移动到 `(p+1),y`. 两人间的 taxicab distance 保持不变，但转换为了不在同一行或同一列的情况  

#### Vika 和 Alice 的行列均不相同(B)  

此时 Vika=`(x,y)`, Alice=`(p,q)`. 我们认为两人的位置构成了一个矩形 S，且 S 包含了两人当前的位置。

##### Vika 下一步的位置在 S 外(B1)
那 Alice 可以同向移动。这样，矩形 S 向棋盘边界平移了一格。  

##### Vika 下一步的位置在 S 内(B2)  
Alice 下一步的位置同样也在 S 内。如果 Vika 横向移动，Alice 就纵向移动，反之亦然。这样的回合后，两人的 taxicab distance 会下降2. 因为最初色块相同，所以 taxicab distance 在任何时刻，都是2的倍数（包含0）

#### 距离会不断下降  
Vika 重复 B1 可以保持两人距离相同，但因为棋盘有界，Vika 会先撞到边缘，导致 Vika 不得不采取行动 B2，缩短两人距离。  

如果 Vika 采取 A1，那也会不可避免地先撞墙。如果 Vika 执行 A2，会将局面转化为 B，但两人距离并没有拉长，最终也会因为 B2 而被 Alice 抓住。

现在 `(<=)`  和  `(=>)` 都已经证明完毕，原命题得证。

## 错误总结  

### Vika 和朋友必须移动  
我不假思索地采纳了一个推论：如果朋友的数量多于棋盘的列数，那就可以朋友们站成一排，像国际象棋的兵线一样推进，Vika 也就无法逃生了。  

但是，这个判断是错误的。如果所有的朋友都站在白格上，那无论怎么排，也是无法拉成一条直线的。  

### 如何理解同时行动  
在比赛时，我没能理解同时行动的含义。所以，我想当然地认为，如果出现了下图中的这种“困兽斗”的情况，Vika 是无法离开的。但我们在 `(<=)` 里证明，这种情况下，Vika 可以躲开所有的朋友。甚至于，如果 Vika 主动想和朋友们碰面也是做不到的。  

![An example of Vika being trapped in a corner](/images/2023/codeforces/cf885A.png)

因为这两个错误的推论，我没有对 Vika 和朋友们脚下的色块深入思考，也就没机会自己找出文首的命题。  

### 证明追逐不会无限制地持续  

在写本篇题解时，我本来想用下面一段话来证明 `(=>)`

*虽然 Alice 和 Vika 要同时行动，但 Alice 可以看到 Vika 的决策。这样，如果 Vika 选择远离 Alice，Alice 可以只同向行动，就能保持两人的taxicab distance不变。因为地图是有界的，Vika 总会被 Alice 追到。*  

这句话看起来很符合直觉，但是我写下来的时候，发现这省略了一个问题：如果 Alice 一直在追逐 Vika，但无法缩短两人的 taxicab distance 怎么办？我只好花了不少时间，换了一种论证的方式。当然，这样的话又有些啰嗦。如果我一开始就使用矩形 S 来论证，可能就会精简一些。  





