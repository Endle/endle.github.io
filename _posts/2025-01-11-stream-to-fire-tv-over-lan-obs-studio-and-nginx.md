---
layout: post
title: "Stream to Fire TV over LAN: OBS Studio+Nginx"
description: ""
category: linux
tags: [fedora]
---

My goal is simple: When playing video games on my Fedora workstation, I'd stream it to the Fire TV in my living room. After tring several methods, I found the solution is quite simple, just as expected.

TL;DR, use OBS Studio XXX, instead of 31.0 Beta.

### Nginx with RTMP Module  

Created by [Sebastián Ramírez](https://tiangolo.com/),[tiangolo/nginx-rtmp-docker](https://github.com/tiangolo/nginx-rtmp-docker) provides a simple way to run nginx.


https://docs.nginx.com/nginx/admin-guide/dynamic-modules/rtmp/

