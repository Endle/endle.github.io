---
layout: post
title: "Fedora 删除 swap 后修复 Kernel Parameters"
description: ""
category: linux
tags: [fedora, kernel, LVM]
---

笔者近日为自己的笔记本电脑升级到了 32G 内存，就想着删掉 swap 分区，为自己捉襟见肘的 SSD 释放一些空间。参考着 [Arch Wiki][ar]，整体而言比较顺利，但也有一点小小的插曲。  

首先，运行 `# lvs` 查看分区情况。我的系统里，Volume Group 是 `fedora_zhenbo`。 删除 swap 分区不需要运行 `# umount /<mountpoint>` 。相反，[运行 `swapoff -a` 即可][swap]。 接下来，删除 LV `# lvremove <volume_group>/<logical_volume>`，并修改 `etc/fstab`。

可是，重启后，系统并没有正确启动，而是进入了 dracut 环境，提示 `fedora_zhenbo/swap` 未找到。重新检查了一遍，发现 Kernel parameters 里有一行 `rd.lvm.lv=fedora_zhenbo/swap`。将其删去后，可以顺利启动。[尝试运行 `grub2-mkconfig`][fw]，生成的 `grub.cfg` 里依旧有 swap。把 `/etc/grub.d/` 翻了一遍，也没有任何头绪。

幸运的是，[网友 Oren Bell][ob] 在 2017 年[遇到了一样的问题][sesol]。LVM 分区被硬编码到了 `/etc/default/grub`。编辑该文件的 `GRUB_CMDLINE_LINUX=` 一栏，删掉 `rd.lvm.lv=fedora_zhenbo/swap` 后重新 `grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg` 即可。


最后，参考 [Arch Wiki][ar]，把释放出来的空间添加到 home  

`# lvresize -l +100%FREE --resizefs fedora_zhenbo/home`  





[ar]: https://wiki.archlinux.org/index.php/LVM  
[swap]: https://serverfault.com/a/684792  
[fw]: https://web.archive.org/web/20221226031847/https://docs.fedoraproject.org/en-US/fedora/rawhide/system-administrators-guide/kernel-module-driver-configuration/Working_with_the_GRUB_2_Boot_Loader/  
[ob]: https://orenbell.com/  
[sesol]:https://unix.stackexchange.com/questions/412149/grub2-mkconfig-isnt-generating-correct-mount-paths-and-also-how-do-i-get-rid-o  
