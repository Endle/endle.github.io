---
layout: post
title: "My LaTex Cheatsheet"
description: ""
category: 
tags: [LaTeX]
---

Table 表格
---------
```
\begin{center}
\begin{tabular}{ |c|c|c| } 
 \hline
 cell1 & cell2 & cell3 \\ 
 cell4 & cell5 & cell6 \\ 
 cell7 & cell8 & cell9 \\ 
 \hline
\end{tabular}
\end{center}
```




Pseudo-code 插入代码
------------
```
\usepackage{listings}


\begin{lstlisting}
F(S, T, s[1..n], t[1..n])
    a + b	
\end{lstlisting}
```
Set tab size  
```
\lstset{
	numbers=left,
	breaklines=true,
	tabsize=2,
}
```


Insert picture 插入图片
------------
```
\begin{figure}[h]
\centering
\includegraphics[width=.3\textwidth]{a.jpg}
\end{figure}
```

Insert PDF 插入PDF
------------
```
%https://stackoverflow.com/a/2739710/1166518
\usepackage{pdfpages}

\includepdf[pages=-]{q1_x20.pdf}
```


多行的大括号
-------
```
$$ W[i,j]= max \left\{ \\
\begin{aligned}
	P[i,j], \\
	max_{1\leq x\leq i,1\leq y \leq j} W[x,y] + max(
	W[x,j-y]+W[i-x,j], 
	& W[i-x,y]+W[i.j-y])
\end{aligned}
\right.
$$

```



Matrix 矩阵
-----------
```
\begin{equation*}
    A=\begin{bmatrix}
    10 & -4 & 18\\
    11 & 0 & 0\\
    0 & 16 & -3
    \end{bmatrix}
\end{equation*}
```

Limit at Infinity 趋近于无穷的极限
-----------
```
$$\lim_{n \to \infty} y_n$$


```

Reference to equations 内链公式
-------
```
\begin{equation}
	\label{eqn:o3}
0 = f(x^*) = f(x_k) + f'(x_k)(x^*-x_k) + \dfrac{1}{2}f''(x_k)(x^*-x_k)^2 + \dfrac{1}{6}f'''(u_1)(x^*-x_k)^3
\end{equation}

previous equation \ref{eqn:o3}

```

禁止图片浮动
--------

如果希望禁止浮动，可以使用 float 宏包，结合 H 选项。
参考了 [孟晨的回答 - 知乎](https://www.zhihu.com/question/25082703/answer/30038248)
```
\usepackage{float}
% ...
\begin{figure}[H]
% ...
\begin{table}[H]
% ...
```
