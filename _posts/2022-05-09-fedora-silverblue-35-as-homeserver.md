---
layout: post
title: "Fedora Silverblue 35 设置为家庭服务器"
description: ""
category: linux
tags: [fedora]
---

几周前，我领到了新的笔记本。从 2017 年为我工作的 Dell XPS 也光荣地退居二线了。我构思了很久的搭建家庭服务器的行动，也终于得以付诸实施了。写一篇流水账，记录一下我的操作流程。



#### 安装 Fedora Silverblue 35 以及 XFCE


#### 配置 SSH 登录  

Server 的 `$HOME/.SSH` 目录需要设置为 `700` 权限。

#### 自动挂载(Automount) 移动硬盘  
在这里，我没能找到用 XFCE 的 GUI 工具设置自动挂载的方式。我的解决方案是，切换到 Gnome 3 里，选择 nautilus -> disk，进而手动选择挂载点。

#### Flatpak 应用的自动启动  
使用 Flatpak 安装的应用的 `.desktop` 文件会存放在 `/var/lib/flatpak/exports/share/applications` 。打开后，就可以知道如何在命令行中运行某个应用。

#### 安装 Nvidia 闭源驱动 （失败）  
我参考 <https://nudesystems.com/how-to-install-nvidia-drivers-in-fedora-silverblue/> 一文，使用 rpmfusion 的包安装 NVidia 闭源驱动。虽然软件包安装成功，但 `nvidia-smi` 等工具并不能正常运行。因为也不打算用这台家庭服务器玩游戏，就没有深究这个问题。  

#### 安装 Teamviewer  
参考 <https://community.teamviewer.com/English/kb/articles/30664-use-the-tar-package-for-linux>，可以从 <https://www.teamviewer.com/en-us/download/linux/> 下载 tar 包。运行 `./tv-setup checklibs` 提示缺少 `libminizip.so.1` 和若干 QT 库。运行 `rpm-ostree install qt5-qtquickcontrols qt5-qtquickcontrols2 minizip-compat` 后，teamviewer 可以顺利运行了。


<!--This is a comment. Comments are not displayed in the browser



- Set up home server
	- 1. Install Fedora Silverblue 35
		2. Install XFCE
		3. Config httpd failed
		4. login with ssh pubkey failed. set ~/.ssh to 700 on target machine!
		5. set auto mount with remote media (it didn't work)
		6. set auto mount with gnome disk (nautilus then disk), specify mount point
		7. set auto start, check  /var/lib/flatpak/exports/share/applications
		8. add rpmfusion, and upgrade (https://nudesystems.com/how-to-install-nvidia-drivers-in-fedora-silverblue/)
		9. rpm-ostree install akmod-nvidia xorg-x11-drv-nvidia
		10. also add xorg-x11-drv-nvidia-cuda
		11. nvidia driver still not good
		12. download tar from https://www.teamviewer.com/en-us/download/linux/
		13. https://community.teamviewer.com/English/kb/articles/30664-use-the-tar-package-for-linux
		14. ./tv-setup checklibs

	- Analyzing dependencies ...
	  libminizip.so.1 => not found
	- The libraries listed above seem to be missing.
	  Please find and install the corresponding packages.
	  Then, run this command again.
	- QtQuickControls seems to be missing
	- The following command may be helpful:
	  'libdbus-1.so.3()(64bit)' 'libQt5Gui.so.5()(64bit)' 'libQt5Widgets.so.5()(64bit)' 'libQt5Qml.so.5()(64bit)' 'libQt5Quick.so.5()(64bit)' 'libQt5WebKitWidgets.so.5()(64bit)' 'libQt5X11Extras.so.5()(64bit)'  qt5-qtdeclarative qt5-qtquickcontrols
	- dnf provides */libminizip.so.1
	- minizip-compat
	- rpm-ostree install qt5-qtquickcontrols qt5-qtquickcontrols2 minizip-compat

-->
