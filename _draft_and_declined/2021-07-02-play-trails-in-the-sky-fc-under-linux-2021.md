---
layout: post
title: "2021年在 Linux 下玩空之轨迹FC"
description: ""
category: 
tags: []
---

steam 下载
安装补丁包
https://trails-game.com/resouce/sky/patch-sora/
下载链接 https://trails-game.com/resouce/patches/patch-resource/


解压缩
wine 安装配置文件和继承存档.exe
cjkfonts
export LC_ALL=zh_CN.utf8
wine Config.exe 半透明 稍等
ed6_win.exe



22268 00a4:Ret  rpcrt4.NdrServerContextNewUnmarshall() retval=004801e8 ret=0040cc74
22269 00a4:Call rpcrt4.NdrSimpleStructUnmarshall(01a9fa90,01a9fb74,0041f7e4,00000000) ret=0040ccab
22270 00a4:Ret  rpcrt4.NdrSimpleStructUnmarshall() retval=00000000 ret=0040ccab
22271 00a4:Call rpcrt4.I_RpcGetBuffer(00480790) ret=0040cd36
22272 00a4:Ret  rpcrt4.I_RpcGetBuffer() retval=00000000 ret=0040cd36
22273 00a4:Call ucrtbase.memset(004808c8,00000000,00000000) ret=0040cd95
22274 00a4:Ret  ucrtbase.memset() retval=004808c8 ret=0040cd95
22275 00a4:Call ucrtbase.memcpy(004808e0,00480770,00000018) ret=62ffb7d8
22276 00a4:Ret  ucrtbase.memcpy() retval=004808e0 ret=62ffb7d8
22277 00a4:Call ucrtbase.memcpy(004808f8,004808c8,00000004) ret=62ffb820
22278 00a4:Ret  ucrtbase.memcpy() retval=004808f8 ret=62ffb820
22279 0088:Call ucrtbase.memcpy(0043daf0,00491a68,00000004) ret=62ffd3de
22280 0088:Ret  ucrtbase.memcpy() retval=0043daf0 ret=62ffd3de
22281 0088:Ret  rpcrt4.NdrSendReceive() retval=00000000 ret=6bc0ed8e
22282 0088:Call rpcrt4.NdrFreeBuffer(00d9fa28) ret=6bc0ec1d
22283 0088:Ret  rpcrt4.NdrFreeBuffer() retval=00d9fa28 ret=6bc0ec1d
22284 0088:Ret  advapi32.SetServiceStatus() retval=00000001 ret=68e91f47
22285 0088:Ret  ntoskrnl.exe.ZwLoadDriver() retval=00000000 ret=004015d1
22286 0088:Call ntoskrnl.exe.RtlNtStatusToDosError(00000000) ret=004015de
22287 0088:Ret  ntoskrnl.exe.RtlNtStatusToDosError() retval=00000000 ret=004015de
22288 0088:Call ntoskrnl.exe.RtlFreeUnicodeString(00d9fd58) ret=0040167c
22289 0088:Ret  ntoskrnl.exe.RtlFreeUnicodeString() retval=00d9fd58 ret=0040167c

