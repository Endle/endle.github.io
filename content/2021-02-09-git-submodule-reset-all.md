---
layout: post
title: "如何让 Git Submodule 恢复初始状态"
description: ""
category: tool
tags: [git]
---


这几天在尝试编译 [Proton](https://github.com/ValveSoftware/Proton) ，不小心把 submodule 搞乱了。如下图所示，submodule 对应的是 `origin/master/HEAD`，而不是应有的 commit。

```
proton$ git status
On branch proton_5.13
Your branch is up to date with 'origin/proton_5.13'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   FAudio (new commits)
	modified:   OpenXR-SDK (new commits)
	modified:   fonts/liberation-fonts (new commits)
	modified:   gst-orc (new commits)
	modified:   gst-plugins-base (new commits)
	modified:   gst-plugins-good (new commits)
	modified:   gstreamer (new commits)
	modified:   vkd3d-proton (new commits)
```



[参考这个回答](https://stackoverflow.com/questions/7882603/how-to-revert-a-git-submodule-pointer-to-the-commit-stored-in-the-containing-rep)，使用 `git submodule update --init` 修复。



因为网络问题，我的 openvr 最开始没能下载成功。反复尝试 fetch 以后，发现我的 `git module` 损坏了。


```
$ git status
fatal: not a git repository: openvr/../.git/modules/openvr


$ git submodule
 aa158544b6402e6a37517c0ffa142a5edae927b0 FAudio (20.12)
 5197afbf199c026eca82a47a8573ed10b0c6fa4e OpenXR-SDK (release-1.0.13)
 85c70ad5db0863ffbc4afee2ca57a6e6e92e8ef6 dxvk (experimental-dxvk-5.13-20210115)
 9510ebd130bcb4dfc76b053b438d8a97a3ed4600 fonts/liberation-fonts (2.00.3-2-g9510ebd)
 9901a96eaff271c2d3b595214213f6805ff803c8 gst-orc (0.4.31)
 9d3581b2e6f12f0b7e790d1ebb63b90cf5b1ef4e gst-plugins-base (1.16.0-91-g9d3581b2e)
 ce0723527aa37d5f4d19ef8021c0b2eb8f83b08d gst-plugins-good (1.16.0-48-gce0723527)
 129493687793cbc109d6211bb0e465218e383e9d gstreamer (1.16.0-58-g129493687)
fatal: not a git repository: openvr/../.git/modules/openvr
```


我删除了 `.git/config`和 `.gitmodules` 中 openvr 的记录。接着就可以运行

```
$ rm -rf openvr
$ git status
On branch proton_5.13
Your branch is up to date with 'origin/proton_5.13'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .gitmodules
	deleted:    openvr

```

到这里，就可以还原 `.gitmodules`。

```
git restore .gitmodules
git status
On branch proton_5.13
Your branch is up to date with 'origin/proton_5.13'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	deleted:    openvr

```



有趣的是，我尝试 `submodulle update` 会遇到网络问题，而 `git clone` 则可以正常执行。
```
# Fail
git submodule update --depth=1 openvr
# Success
git clone https://github.com/ValveSoftware/openvr.git --depth=1
```

用[上一篇文章的技巧](https://endle.github.io/2021/02/01/git-submodule-fetch-from-local/)，我也成功初始化了 openvr。
```
git clone https://github.com/ValveSoftware/openvr.git --depth=1
git fetch origin master --deepin=20

git submodule set-url openvr /dev/shm/openvr
git submodule update --init openvr
git restore . --recurse-submodules
```


最后，使用 Vagrant 编译代码时，可能会遇到网络问题。参考[这篇 CSDN 的文章](https://blog.csdn.net/haiyanghan/article/details/107168972)，可以使用支持断点续传的 `wget` 下载镜像。

```
 proton$ vagrant up
Platform: 4 CPUs, 15979 MB memory
Bringing machine 'debian10' up with 'libvirt' provider...
==> debian10: Box 'generic/debian10' could not be found. Attempting to find and install...
    debian10: Box Provider: libvirt
    debian10: Box Version: >= 0
==> debian10: Loading metadata for box 'generic/debian10'
    debian10: URL: https://vagrantcloud.com/generic/debian10
==> debian10: Adding box 'generic/debian10' (v3.2.2) for provider: libvirt
    debian10: Downloading: https://vagrantcloud.com/generic/boxes/debian10/versions/3.2.2/providers/libvirt.box
==> debian10: Box download is resuming from prior download progress
Download redirected to host: vagrantcloud-files-production.s3.amazonaws.com
Progress: 0% (Rate: 46507/s, Estimated time remaining: 14:32:45)^C==> debian10: Waiting for cleanup before exiting...
==> debian10: Box download was interrupted. Exiting.
    debian10: Calculating and comparing box checksum...
The checksum of the downloaded box did not match the expected
value. Please verify that you have the proper URL setup and that
you're downloading the proper file.

Expected: 76118312e5a2f227544660566b7d0f6ad3d6bf50ff1fc0b92602cda66d9cf3a6
Received: 9d80712a57190fb2821f11ac46e677be1c467afc15e02d3d29f84c069d4f9e8e

wget -c https://vagrantcloud.com/generic/boxes/debian10/versions/3.2.2/providers/libvirt.box
```

下载成功后，再执行 `vagrant box add`  

```
~$ sha256sum libvirt.box 
76118312e5a2f227544660566b7d0f6ad3d6bf50ff1fc0b92602cda66d9cf3a6  libvirt.box


vagrant box add generic/debian10 libvirt.box

Platform: 4 CPUs, 15979 MB memory
Bringing machine 'debian10' up with 'libvirt' provider...
==> debian10: Uploading base box image as volume into Libvirt storage...
==> debian10: Creating image (snapshot of base box volume).
==> debian10: Creating domain with the following settings...

```





