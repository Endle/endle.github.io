---
layout: post
title: "Linux 下利用网盘同步 Firefox 扩展"
description: ""
category: linux
tags: [firefox, 同步]
---
{% include JB/setup %}

不知道为什么，最近我的 Firefox 加载一些网页总是有问题。参考了 [Bugzilla 上我收到的回复][bug]，我打算重置我的个人配置。

但这么做，就意味着我要重新安装一下自己的扩展，和积累的一票油猴脚本。尤其是 [ForTrick][fox]，还要手动去下载 .xpi 文件。网上有人 [推荐了FEBE][febe]，但不知道为什么，我就是没装上。所以，就打算试试手动备份。
[bug]: https://bugzilla.mozilla.org/show_bug.cgi?id=851867
[febe]: http://www.williamlong.info/archives/2217.html
[fox]: http://www.foxtrick.org

Linux 下的配置文件
---
自己摸索了一下，Linux 把 FF 的配置文件保存在了 `~/.mozilla/firefox` 里。 `profiles.ini` 则决定了加载哪个用户的配置文件。默认情况下，会有一个名字很奇怪的文件夹（我的是 `hptzpdkk.default`），作为默认文件夹。

建立新的配置文件
--
关掉 Firefox，输入 `firefox -p`（本人测试不区分大小写），然后会出现一个很和谐的窗口。
![screen](http://i1152.photobucket.com/albums/p481/letusdo_photos/blog%20of%20endle/Screenshotfrom2013-05-28180849_zpsed5f1905.png)

新建一个用户，然后指定新的文件夹即可。

设置软链接
--
关于 Linux 下软链接的知识，可以阅读 [创建和更改硬链接和符号链接][ln]，但如果没有耐心，也没必要读完这篇文章。

我平时使用 [坚果云][nut] 来同步我的文件。在创建了新的用户配置以后，首先备份 `profiles.ini`，我使用的代码是 `ln -s ~/nutstore/firefox/profiles.ini ~/.mozilla/firefox/profiles.ini`

`ln -s` 后的两个路径，第一个是文件实际存放的位置（坚果云自动同步文件夹），第二个是链接的位置（相当于快捷方式）。用同样的方法，备份 `gm_scripts` 和 `extensions` 两个文件夹就可以了。

**试了半天，没有找到扩展的配置文件的位置，只好重新设置一遍了。如果你有解决方案，请告诉我，谢谢**

[ln]: http://www.ibm.com/developerworks/cn/linux/l-lpic1-v3-104-6/
[nut]: https://jianguoyun.com/
