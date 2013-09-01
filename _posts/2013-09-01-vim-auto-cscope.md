---
layout: post
title: "Vim 自动加载 cscope.out"
description: ""
category: tool 
tags: [C, vim, cscope]
---
{% include JB/setup %}
这两天看 BOINC 的代码，需要 find usage 的功能。花了一上午，摸索出了让 vim 自动加载生成的 cscope.out 的方法。

在 .vimrc 中插入如下代码即可：
{% highlight bash %}
"Configure for cscope
set nocscopeverbose 
set cscopequickfix=s-,c-,d-,i-,t-,e-
set cst
function LoadCscope(path)
    "防止无限递归
    if a:path == $HOME
        return
    endif
    if (executable("cscope") && has("cscope"))
        let l:outfile=a:path."/cscope.out"
        let l:outpath=a:path
        if filereadable(outfile)
            cs reset
            exe "cs add" outfile outpath
        else
            "递归
            let l:newpath=a:path."/.."
            let newpath=resolve(newpath)
            "echo newpath
            call LoadCscope(newpath) 
        endif
    endif
endfunction
call LoadCscope(getcwd())
{% endhighlight %}

这是我 *第一次* 写的 vimrc 的函数。思路很简单，就是递归找父目录。但有几处障碍让我花费了一个上午。

`if a:path == $HOME`

vim 中，使用函数传入的参数时要加前缀 a，这一点跟 C，python 之类的就不太一样

`let newpath=resolve(newpath)`

如果不加这句话，vim 脚本是无法正确的识别文件链接 `..` 的

`set nocscopeverbose`

有的时候，vim 会自动加载 cscope.out。这个时候，就会发生冲突。加上这句话就能解决该问题。
