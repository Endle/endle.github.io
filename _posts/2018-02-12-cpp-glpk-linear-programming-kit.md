---
layout: post
title: "在 C++ 中调用 GLPK 求解线性规划"
description: "怎么使用 GLPK (GNU Linear Programming Kit)"
category: C 
tags: []
---

最近，参加了一个提交答案类的编程比赛，有一道题可用线性规划解决。搜索发现，[GLPK (GNU Linear Programming Kit)][GLPK] 是一个免费的线性规划计算库，可以方便地被 C/C++ 代码调用。现将基本使用方法整理如下：  

## 准备工作  
#### 安装 GLPK
多数的发行版都应该提供了 [GLPK][] 的包。在 Fedora 下，只需运行  
`sudo dnf install glpk glpk-devel`  
#### 编译 GLPK
Fedora 将 `glpk.h` 存在了 `/usr/include/glpk.h`，因此，不需添加指令即可找到头文件。如果你是手动编译安装的 [GLPK][]，那可能需要使用 `-I` 指定头文件目录。链接的指令为 `-lglpk`。如果使用的是 C++ 的话，在调用头文件时，记得声明 `extern`。你可以试着使用 `g++ -lglpk test.cpp` 编译如下代码  

{% highlight C %}
#include <iostream>
extern "C"{
#include "glpk.h"
}
int main()
{
    std::cout << glp_version() << std::endl;
    return 0;
}
{% endhighlight %}

在我撰写本文时（2018年2月初），[GLPK][] 的版本应当为 4.61。

## 实战演练  
[GLPK][] 官方手册上的例子有点让人混淆。在这里，我将采用更精简的例子。  
Maximize
\\[z=10x_1+6x_2\\]
Subject to
\\[x_1+x_2\leqslant200\\]
\\[x_1+2x_2\geqslant10\\]
\\[3x_1+x_2\leqslant275.5\\]
where all variables are non-negative
\\[x_1\geqslant 0, x_2\geqslant 0\\]


对于三个约束条件，我们可以创建三个辅助变量(auxiliary variables)，将问题转化为如下形式：  
Maximize
\\[z=10x_1+6x_2\\]
Subject to
\\[p=x_1+x_2\\]
\\[q=x_1+2x_2\\]
\\[r=3x_1+x_2\\]
where all variables are non-negative
\\[x_1\geqslant 0, x_2\geqslant 0\\]
\\[0\leqslant p\leqslant200,q\geqslant10,0\leqslant r\leqslant275.5\\]


现在，可以将我们的问题输入程序了。[GLPK][] 将各辅助变量看作行(row)，将原有的变量看作列(column)，用一个矩阵表示辅助变量和原有变量的关系。



{% highlight c %}
#include <cstdio>
extern "C"{
#include "glpk.h"
}

int main() {
initialize:
    glp_prob *lp;
    lp = glp_create_prob();
    glp_set_obj_dir(lp, GLP_MAX);
auxiliary_variables_rows:
    glp_add_rows(lp, 3);
    glp_set_row_name(lp, 1, "p");
    glp_set_row_bnds(lp, 1, GLP_DB, 0.0, 200.0);
    glp_set_row_name(lp, 2, "q");
    glp_set_row_bnds(lp, 2, GLP_LO, 10.0, 0.0);
    glp_set_row_name(lp, 3, "r");
    glp_set_row_bnds(lp, 3, GLP_DB, 0.0, 275.5);

variables_columns:
    glp_add_cols(lp, 2);
    glp_set_col_name(lp, 1, "x1");
    glp_set_col_bnds(lp, 1, GLP_LO, 0.0, 0.0);
    glp_set_col_name(lp, 2, "x2");
    glp_set_col_bnds(lp, 2, GLP_LO, 0.0, 0.0);
to_maximize:
    glp_set_obj_coef(lp, 1, 10.0);
    glp_set_obj_coef(lp, 2, 6.0);

constrant_matrix:
    int ia[7], ja[7];
    double ar[7];
    ia[1] = 1, ja[1] = 1, ar[1] = 1;
    ia[2] = 1, ja[2] = 2, ar[2] = 1; // p = x1 + x2
    ia[3] = 2, ja[3] = 1, ar[3] = 1;
    ia[4] = 2, ja[4] = 2, ar[4] = 2; // q = x1 + 2x2
    ia[5] = 3, ja[5] = 1, ar[5] = 3;
    ia[6] = 3, ja[6] = 2, ar[6] = 1; // r = 3x1 + x2
    glp_load_matrix(lp, 6, ia, ja, ar);

calculate:
    glp_simplex(lp, NULL);

output:
    double z, x1, x2;
    z = glp_get_obj_val(lp);
    x1 = glp_get_col_prim(lp, 1);
    x2 = glp_get_col_prim(lp, 2);
    printf("z = %lf, x1 = %lf, x2 = %lf\n", z, x1, x2);

cleanup:
    glp_delete_prob(lp);
    return 0;
}
/*
GLPK Simplex Optimizer, v4.61
3 rows, 2 columns, 6 non-zeros
      0: obj =  -0.000000000e+00 inf =   1.000e+01 (1)
      1: obj =   3.000000000e+01 inf =   0.000e+00 (0)
*     4: obj =   1.351000000e+03 inf =   0.000e+00 (0)
OPTIMAL LP SOLUTION FOUND
z = 1351.000000, x1 = 37.750000, x2 = 162.250000
*/
{% endhighlight %}


第一次看到示例代码，对于 `constrant_matrix` 部分可能会比较费解。在这里，`ia` 表示行号(第几个辅助变量)，`ja` 表示列号(第几个变量)，而 `ar` 的类型是 `double`，表示 constrant matrix 中的系数。将这些条件成功导入后，使用 `glp_simplex` 就可以求解了。  

一个常见的需求是，需要求出对应的**整数解**。使用 glpk，这一问题也很好解决。  
{% highlight c %}
set_variables_to_integer:
    glp_set_col_kind(lp, 1, GLP_IV);
    glp_set_col_kind(lp, 2, GLP_IV);
calculate:
    glp_simplex(lp, NULL);
    glp_intopt(lp, NULL);
output:
    double z, x1, x2;
    z = glp_mip_obj_val(lp);
    x1 = glp_mip_col_val(lp, 1);
    x2 = glp_mip_col_val(lp, 2);
    printf("z = %lf, x1 = %lf, x2 = %lf\n", z, x1, x2);
/*
GLPK Simplex Optimizer, v4.61
3 rows, 2 columns, 6 non-zeros
      0: obj =  -0.000000000e+00 inf =   1.000e+01 (1)
      1: obj =   3.000000000e+01 inf =   0.000e+00 (0)
*     4: obj =   1.351000000e+03 inf =   0.000e+00 (0)
OPTIMAL LP SOLUTION FOUND
GLPK Integer Optimizer, v4.61
3 rows, 2 columns, 6 non-zeros
2 integer variables, none of which are binary
Integer optimization begins...
+     4: mip =     not found yet <=              +inf        (1; 0)
Solution found by heuristic: 1346
+     6: >>>>>   1.348000000e+03 <=   1.348000000e+03   0.0% (1; 1)
+     6: mip =   1.348000000e+03 <=     tree is empty   0.0% (0; 3)
INTEGER OPTIMAL SOLUTION FOUND
z = 1348.000000, x1 = 37.000000, x2 = 163.000000
*/
{% endhighlight %}

在运行过`glp_simplex`后，再运行`glp_intopt`即可得到整数解。但要注意的是，提取整数解的命令是 `glp_mip_obj_val` / 
`glp_mip_col_val`。  

PS 写这篇 blog 时，我第一次使用了 [mathjax][]。只能说，写作体验超乎想象地好。   

<p style="color:grey">讲一个逸闻吧。之前我曾把线性规划和高斯消元的时间复杂度弄混了，以至于我成功将大量NP问题转化为了线性规划问题后得到了“多项式”的解。</p>


[GLPK]: https://www.gnu.org/software/glpk
[mathjax]: http://www.gastonsanchez.com/visually-enforced/opinion/2014/02/16/Mathjax-with-jekyll/

{% include mathjax.html %}


