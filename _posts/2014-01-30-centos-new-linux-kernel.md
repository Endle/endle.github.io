---
layout: post
title: "CentOS 使用 ELRepo 安装最新的 Linux Kernel"
description: ""
category: linux 
tags: [fedora, kernel, CentOS]
---
{% include JB/setup %}

回家给台式机装上了 CentOS 6.5，发现很多软件包都太旧，尤其是 kernel，还停留在 2.6 的时代。找了一些介绍，多数说要自己编译 kernel，实在太麻烦。不过，有一篇文章介绍了用 [ELRepo][] 安装新内核的方法，我只想说：  
>太伟大了！

具体的步骤很简单：
1. 添加源  
`rpm -Uvh http://www.elrepo.org/elrepo-release-6-5.el6.elrepo.noarch.rpm`  
2. 安装kernel  
`yum --enablerepo=elrepo-kernel install kernel-ml`  
(解释一下，ml 是指 MainLine, kernel-lt 就是 Long-Term)  
3. 编辑 grub 的默认启动项  
这里我就懒了，直接 编辑的 `/boot/grub/menu.lst`，好孩子们不要学我啊


[ELRepo]: http://elrepo.org/tiki/tiki-index.php
