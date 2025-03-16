---
layout: post
title: "自己动手为 Fedora 打包的几个小技巧"
description: ""
category: linux
tags: [rpm, fedora, pdf, dnf]
---

这几天[被人推荐](https://news.ycombinator.com/item?id=27893303)了 [sioyek][]，据说是一个很适合读论文的 PDF 阅读器。但是，软件还比较新，截止到 2021 年 9 月没有 Fedora 的包。在 [FZUG 群][fzug] 里有人提过，自己手动编译软件时避免 `make install`，而是打成 RPM 包。这样自己的编译和运行环境更干净，便于后期维护，也也能在 copr 上和人分享。忙了两天，总算编译成功了，总结一下自己踩过的几个小坑。  

[sioyek]: https://github.com/ahrm/sioyek
[fzug]: https://zh.fedoracommunity.org/about/


#### 准备 spec
spec 文件的规范我就不赘述了，我找到的最详细的文档是 [Maximum RPM: Taking the RPM Package Manager to the Limit. Chapter 11. Building Packages: A Simple Example](http://ftp.rpm.org/max-rpm/s1-rpm-build-creating-spec-file.html)  

在实际操作上，我主要参考了 [RPM Packaging](https://developer.fedoraproject.org/deployment/rpm/about.html) 一文。照着这个例子，运行如下命令
```
$ sudo dnf install fedora-packager rpmdevtools gcc
$ rpmdev-setuptree
$ cd ~/rpmbuild/SOURCES
$  wget -O v0.31.6.tar.gz https://github.com/ahrm/sioyek/archive/refs/tags/v0.31.6.tar.gz 
$ cd ~/rpmbuild/SPECS
$ rpmdev-newspec --macros sioyek.spec
```
并修改 spec 文件即可。

更详细的流程，可以参考 [Packaging and distributing software](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/packaging_and_distributing_software/index)  

#### 使用 mock 编译 SRPM 
[Mock wiki](https://github.com/rpm-software-management/mock/wiki) 介绍的很详细。我配置好 mock 以后，直接运行 
```
rpmbuild -bs ~/rpmbuild/SPECS/sioyek.spec  && mock --enable-plugin=tmpfs --enable-plugin=yum_cache  ~/rpmbuild/SRPMS/sioyek-0.31.6-1.fc34.src.rpm 

```

#### 使用 Container (Podman/Docker) 的查错技巧
刚写好的 spec 编译错误很正常。为了使用 interactive shell,我决定在 podman 里进行测试。每次启动时，都要浪费大量的时间在 `dnf upgrade/install` 上。受到 <https://sysadmin.prod.acquia-sites.com/sysadmin/overlay-mounts> 一文的启发，我用如下命令启动容器  
```
$ sudo dnf install --downloadonly harfbuzz-devel # 这里可以替换成其他可能用到的软件包
$ trash /dev/shm/src && mkdir /dev/shm/src && cp ~/rpmbuild/SOURCES/* /dev/shm/src && cd /dev/shm/src && tar xf v0.31.6.tar.gz
$ cp -r /var/cache/dnf /dev/shm/cache_dnf
$ podman run --rm -it -v /dev/shm/cache_dnf:/var/cache/dnf:z -v /dev/shm/src:/src:z docker.io/fedora:34 bash
```

#### 检查链接错误
我在编译时，出现了若干链接错误
```
/usr/bin/ld: /usr/lib/gcc/x86_64-redhat-linux/11/../../../../lib64/libmupdf.a(pdf-font-add.o): undefined reference to symbol 'FT_Get_Postscript_Name'
/usr/lib64/libfreetype.so.6: error adding symbols: DSO missing from command line
```

虽然 BuildRequires 里有了必要的依赖，但还是要使用 `-lfreetype` 这一命令显式链接。其他库同理。  

可以使用 `nm` 查看一个库的符号表 (symbols)，如 
```
nm -D /usr/lib64/libfontconfig.so | grep FT_Get_Postscript_Name 
nm -D /usr/lib64/libfreetype.so | grep FT_Get_Postscript_Name 
```



#### 及时更新
copr 编译完成后，本地的缓存更新可能也许是要时间。为了避免重复下载所有的 metadata, 我会运行
```
sudo dnf --disablerepo='*' --enablerepo='copr*' --refresh upgrade  sioyek
```


最后，再次感谢 [FZUG 群][fzug] 的朋友们，无私地解答了我许多问题。





