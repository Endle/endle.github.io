---
layout: post
title: "Fcitx 5 在分辨率改变后候选框过大"
description: ""
category: 
tags: []
---

我当前使用的是 Fedore34+Gnome 40+Fcitx 5.0.8。今天早上为了用 Wine 玩星际争霸，把屏幕分辨率设置到 800x600，并将 Display Mode 设置为 Mirror。游戏结束后，我将分辨率改回了 1920x1080，但 Fcitx 的候选框就变得特别大，如该视频所示

<video width='400' controls>
    <source src="{{site.baseurl}}/resources/fcitx/font_size_error.mp4" type="video/mp4">
</video>

尝试了重启（Fcitx, 系统）和恢复初始设置，都没有效果。把可能的选项试了一圈后，发现修复该问题的方法是关掉 `Use Per Screen DPI`，该选项在 `Addon->Classic User Interface` 下，如图   
![Use Per Screen DPI](/resources/fcitx/dpi_option.png)

关掉该选项后，我的界面恢复了正常。

后记：ffmpeg 技巧两则  
[去除视频文件音轨](https://superuser.com/q/268985/295652)  
[mkv2mp4](https://askubuntu.com/questions/396883/how-to-simply-convert-video-files-i-e-mkv-to-mp4/396906)

