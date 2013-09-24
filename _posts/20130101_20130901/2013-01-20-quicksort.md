---
layout: post
title: "重学quicksort"
description: ""
category: algorithm
tags: [algorithm, sort]
---
{% include JB/setup %}

前两天写一道水题，想尝试一下手写快排，可没想到花了一个多小时都没有搞定。看来， **The devil is in the detail** ，细节的地方埋藏了许多知识盲点。看来，有的草，是迟早要花时间除的。

{% highlight c %}
void quicksort(int A[], int p, int r)
{
	if (p >= r)		return;
	int q;
	q = partition(A, p, r);
	quicksort(A, p, q - 1);
	quicksort(A, q + 1, r);
}
{% endhighlight %}

为了保证 O(nlgn)的复杂度，partition 需要达到O(n)的复杂度。算法导论上，提供了这样一种实现
{% highlight c %}
int partition(int A[], int p, int r)
{
	int i, j, x;
	x = A[r];
	i = p - 1;
	for (j = p; j < r; ++j){
		if (A[j] <= x){
			++i;
			SWAP(A[i], A[j]);
		}//if (A[j] <= x)
	}//for (j = p; j < r; ++j)
	SWAP(A[i+1], A[r]);
	return i + 1;
}
{% endhighlight %}

这个算法可以这样理解：
1. 选取主元
2. 让 `j` 扫描一遍 `A[p, r - 1]` ，找出所有比 `x` 小的元素。这样，当循环结束时，`A[p, i]` 中存放的元素都不会比主元大。通过 `SWAP(A[i+1], A[r])` ，把主元交换到了 `i+1` 的位置。
显然，`partition()` 过程为线性复杂度。我们有个一个不到20行的高效的排序算法。

但在我重学快排时，看到了[v_JULY_v][1] 写的 [快速排序算法的深入分析][2] ，觉得自己正如他所说
[1]: http://my.csdn.net/v_july_v/message
[2]: http://blog.csdn.net/v_july_v/article/details/6211155
>只知其表，不知其里，只知其用，不知其本质。很多东西，都是可以从本质看本质的。而大部分人没有做到这一点。从而看了又忘，忘了再看，如此，在对知识的一次一次重复记忆中，始终未能透析本质，从而形成不好的循环。
看来，除草之路漫漫啊。
