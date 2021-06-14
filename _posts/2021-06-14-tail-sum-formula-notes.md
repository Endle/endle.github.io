---
layout: post
title: "Tail Sum Formula 的学习笔记"
description: ""
category: Statistics
tags: [Statistics, Probability]
---

最近看书时，接触到了 Tail-Sum Formula. 公式的定义如下  

$$E(X) =  \sum_{x=1}^{\infty} P(X \geq x) $$  

它也有一个等价形式  

$$E(X) =  \sum_{x=0}^{\infty} P(X \gt x) $$  

#### 公式证明  

在 [Sinho Chewi 的笔记][Sinho] 上，可以看到这一公式的证明。

![proof](/images/statistics/tailsum_formula/tailsum_formula_proof.png)

  
红框内的这步变换比较跳跃，我阅读时，在这里卡顿了很久，发现这里其实很简单。  
对于原式  

$$ E(X) = \sum_{x=1}^{\infty} \sum_{k=1}^{k=x} P(X=x) $$  

我们将每一行的结果 `Row(X=x)` 拆出来   

$$ Row(X=x) = \sum_{k=1}^{k=x} P(X=x) $$  

$$ E(X) = \sum_{x=1}^{\infty} Row(X=x) $$  

示意图如下  
![示意图](/images/statistics/tailsum_formula/schematic_diagram.png)  

我们如果竖向看这个示意图（红圈），那就可以得到另外一种形式  

$$ E(X) = \sum_{k=1}^{\infty} Column(K=k) $$  

$$ Column(K=k) = \sum_{x=k}^{\infty} P(X=x)$$  

这也就是 Sinho Chewi 所提的  

$$ E(X) = \sum_{k=1}^{\infty} \sum_{x=k}^{\infty}  P(X=x) $$  


#### 公式应用  
在 [Probability for Statistics and Machine Learning](https://www.worldcat.org/title/probability-for-statistics-and-machine-learning-fundamentals-and-advanced-topics/oclc/706920643&referer=brief_results) 一书中，对此定理有一个有趣的例题：  

一对夫妇准备生若干个孩子，直到子女中既有男孩也有女孩。令生男孩的概率为 `p`，求期望的子女数。  

有了 Tail Sum Formula，我们只需求解 $$ P(X > n) $$，也就是 `前 n 个孩子的性别相同(男或女)`。那么，可以得到  

$$ P(X > n) = p^n + (1-p)^n \quad \textrm{if} \quad n \geq 2$$   

注意，$$P(X = 0) = P(X = 1) = 1$$  

现在套用公式，  

$$ E(X) =  \sum_{x=0}^{\infty} P(X \gt x) $$  

$$ E(X) = P(X = 0) + P(X = 1) + \sum_{x=2}^{\infty} P(X \gt x)$$  

$$ E(X) = 2 + \sum_{x=2}^{\infty} [p^n + (1-p)^n]$$  

等比数列求和时，我们有  

$$ \sum_{n=2}^{\infty} a^n = (\sum_{x=1}^{\infty} a^n) - a $$  


$$ \sum_{n=1}^{\infty} a^n = \frac{a}{1-a} \quad (-1 \lt a \lt 1) $$  


$$ \sum_{n=2}^{\infty} a^n = \frac{a^2}{1-a}  \quad (-1 \lt a \lt 1)   $$  


带入原式，  

$$ E(X) = 2 + \frac{p^2}{1-p} + \frac{(1-p)^2}{1-(1-p)} $$  

$$ E(X) = 2 + \frac{p^3 + (1-p)^3}{p(1-p)}  $$  

根据 [binomial expansion](https://math.stackexchange.com/a/1861172/729703)   

$$ p^3 + (1-p)^3 = p^3 + 1 - 3p + 3p^2-p^3 = 3p^2-3p+1 $$  

$$ E(X) = \frac{2p-2p^2}{p(1-p)} + \frac{3p^2-3p+1}{p(1-p)}  $$  

$$ E(X) = \frac{p(p-1)+1}{p(1-p)}  $$  

最终，得到结论  

$$ E(X) = \frac{1}{p(1-p)} - 1 $$  

#### 后记  
一个非常简单的公式，在书上只用了一页不到，但我却忙了一下午才搞清楚。既然如此，不如更进一步，写一篇笔记出来，也借机迫使自己把每一步的推导弄清楚。  
[示意图](/images/statistics/tailsum_formula/schematic_diagram.png) 我是用 [LibreOffice Calc](/resources/statistics/tailsum_formula/image_base.ods) 制作的，步骤繁琐且效率差。如果有人了解如何绘制类似图形，恳请您不吝赐教。

[Sinho]: https://inst.eecs.berkeley.edu/~cs70/su16/static/su16/extra_note/sinho_cs_70_notes.pdf

{% include mathjax.html %}
