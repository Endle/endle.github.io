---
layout: post
title: "经SSH将Fedora 30升级至31"
description: ""
category: linux
tags: [fedora, SSH]
---

之前提到，我的 [客厅里有了一台服务器][server]。随着 Fedora 31 发布，原有的 Fedora 30 系统得到的更新变得很少，我也有了更新系统的打算。搜索了一些资料，有[在2012年的回答][2012]说需要使用单独的ssh daemon进行F17升F18的操作。不过，也有人提到，新版本的 `dnf-plugin-system-upgrade` 插件可以正确处理这种情况。在做好重装系统的准备后，我决定试一试`dnf`的能力。  


按照[官方手册][doc]，顺次在 ssh 中执行如下命令  

```
sudo dnf upgrade --refresh
sudo dnf install dnf-plugin-system-upgrade
sudo dnf system-upgrade download --refresh --releasever=31
```

执行这些内容不会影响 ssh 连接。在运行成功后，可以进行重启并更新  

```sudo dnf system-upgrade reboot
```

这一次重启的耗时会非常长，在我的电脑上持续了至少一小时。因为我在服务器上设定了 DHCP，所以系统升级后被分配了一个新的 IP 地址。在修改笔记本的 `~/.ssh/config` 以及 `known_hosts` 以后，就可以顺利访问自己的服务器了。如果当初配置时没有偷懒，而是分配了固定的IP，那系统升级就能无缝完成了。  



[server]: https://endle.github.io/2018/09/10/distcc-to-speedup/
[2012]: https://unix.stackexchange.com/a/58724/258214
[doc]: https://docs.fedoraproject.org/en-US/quick-docs/dnf-system-upgrade/
