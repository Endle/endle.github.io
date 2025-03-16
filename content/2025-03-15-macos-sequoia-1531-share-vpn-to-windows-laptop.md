---
layout: post
title: "macOS Sequoia 15.3.1 Share VPN to Windows Laptop"
description: ""
category: 
tags: []
---

#### TL;DR 
[L2TP](https://en.wikipedia.org/wiki/Layer_2_Tunneling_Protocol) is a must. WireGuard and IKEv2 are not supported.

#### Background 
I have a personal MacBook running macOS Sequoia 15.3.1, and a Windows 11 laptop managed by my school. While using a public Wi-Fi, I want my MacBook to share the VPN to the Windows laptop.

When MacBook is connected to Wi-Fi, [it can only share Internet with Ethernet](https://apple.stackexchange.com/questions/25878/how-can-i-create-an-ad-hoc-connection-from-my-macbook-pro-wifi-connection)


#### Physical Set-up 
A USB-C hub adapter needs to be connected to macbook to provide an ethernet port. My Windows laptop doesn't have an ethernet port,so we need the second USB hub adapter.

#### macOS Set-up 

Settings -> VPN -> Add VPN Configuration -> L2TP over IPSec  
![Add VPN](/images/2025/macos_vpn/add_l2tp.png)

L2TP -> Options -> Send all traffic over VPN connection


![Send traffic](/images/2025/macos_vpn/send_all.png)


When the L2TP VPN is added and enabled, we can share the Internet now.  

Settings -> General -> Internet Sharing -> More

![Internet Sharing](/images/2025/macos_vpn/sharing.png)

In the config dialog, set *Share your connection from* to *Wi-FI*, and enable AX88179A.


![Internet Sharing Device](/images/2025/macos_vpn/share_more.png)

Enjoy!

#### Epilogue 

When MacBook is connected to Wi-Fi, [it can also share Internet with Thunderbolt](https://support.apple.com/en-ca/guide/mac-help/mchld53dd2f5/mac). Sadly, my Windows laptop doesn't have one.  

iPhone's USB tethering is limited. Only the cellular connection can be shared. [link](https://support.apple.com/en-ca/guide/iphone/iph45447ca6/ios)

Vanilla Android doesn't route VPN traffic when tethering [link](https://protonvpn.com/support/share-vpn-connection-android-hotspot). Modified Android like AOSP may have an option **Allow clients to use VPNs** [link1](https://www.reddit.com/r/VPN/comments/m13d0h/comment/gqbdist/) [link2](https://github.com/PixelExperience/android-issues/issues/5932). After rooting, there are several apps doing so, including [VPNHotspot](https://github.com/Mygod/VPNHotspot). Sadly (again), my Samsung Tablet at hand [can't unlock bootloader](https://www.reddit.com/r/androidroot/comments/1g2xhd9/unlock_bootloader_for_newer_samsung_devices_in/).
