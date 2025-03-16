---
layout: post
title: "几个让人头疼的代码习惯"
description: ""
category: C 
tags: [C]
---
之前，我写代码并不是很重视代码风格，觉得自己看着舒服就好。毕竟，自己写的解题报告不多，看过的代码也很少。这两天跟同学一起写小游戏，花了心思去看别人的代码，才意识到，不好的习惯，很让人头疼。

## 难看的表达式 ##
*C/C++* 里的表达式是相当灵活了，但灵活是有代价的，包括让人难以阅读（尤其是阅读者的水平也是半斤八两）。个人的经验，有这几种常见情况。
#### 不加空格的习惯 ####
例如这句代码 `if(k1<k2||!pos) pos=i;` 这是我在 2011 年的时候写的，看着不舒服吧？后来经人介绍，在 [清澄][1] 上刷了几道水题，被 [风格分][2] 蹂躏了一顿，就养成了加空格的习惯。（当然，不要迷信风格分）
[1]: http://www.tsinsen.com/
[2]: http://www.tsinsen.com/Help.page#ss
#### 太复杂的表达式 ####
我承认，我阅读代码的能力很差。但写代码的时候，也不能要求每个人都是天才。例如

    for(i=(dy>0?floor((j-now.x)*df):ceil((j-now.x)*df))+now.y;(i!=(dy<0?floor((j-now.x+dx)*df):ceil((j-now.x+dx)*df))+now.y);i+=dy)

一个很 *简单* 的 for 循环，我觉得，我看不懂，主要的责任并不在我。

#### 不合适的技巧 ####
`current_player=++current_player%player_num;` 在编译这句话的时候，gcc 给出了 warning。虽然巧用 `++` 能让代码简洁不少，但以我这个半吊子水平看来，在这里多写两句话，不是什么坏事。

## 太长的行 ##
这个问题其实在上面已经涉及到了。每行 80 的限制已经不适应现在的情况，但避免让某一行的代码太复杂，还是一个值得遵守的习惯。

## 神秘常量 ##
C 语言里的 `define` 和 `const` 很方便，可以很好的回避这样的情况

       if(temp==0xff00A2E8) plyr[player-1].check_1(); 
       if(temp==0xffED1C24) plyr[player-1].check_2();
       if(temp==0xffB5E61D) plyr[player-1].bypass();

第一眼看，这三个常量就像是天书一样。

## 区分类名与变量名 ##
还是看一个例子 `player ply[4];` 有的编辑器（比如 Geany）能高亮用户定义的类名。但当代码长了，维护起来的单独就大了。如果规模小，也不必严格遵守大工程里的命名原则。把首字母大写，很多问题都能得到解决。


说了一点点，但要承认，对于代码风格，我也是一知半解。如果有哪里说的不对，也恳请大家指正。

<P STYLE="margin-bottom: 0cm"><FONT COLOR="#cccccc">我会说我是看了<FONT FACE="Liberation Serif, serif"><FONT SIZE=3><SPAN LANG="en-US">SEO</SPAN></FONT></FONT>介绍“网站要保持更新频率”才写着篇文章凑数的？</FONT></P>
