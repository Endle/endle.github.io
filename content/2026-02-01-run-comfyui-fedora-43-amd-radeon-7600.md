---
layout: post
title: "ComfyUI on Fedora 43 Silverblue using AMD Radeon RX 7600 XT"
description: ""
category: 
tags: []
---

15 seconds

#### Background

A few days ago, I saw some recommendations of [ComfyUI](https://github.com/Comfy-Org/ComfyUI). After Googling,
I found a blog article [Getting Started with ComfyUI on Fedora 42 Using AMD Instinct MI60](https://www.ojambo.com/getting-started-with-comfyui-on-fedora-42-using-amd-instinct-mi60) at <https://www.ojambo.com/>. 
[Fedora HC group](https://fedoraproject.org/wiki/SIGs/HC) has been updating ROCm rapidly, and package names are different in Fedora 42 and 43 (might be different in 44 as well) 


#### Environment

| Component | Spec                              |
| --------- | --------------------------------- |
| OS        | Fedora 43 Kinoite                 |
| CPU       | AMD Ryzen 9 7950X3D               |
| RAM       | 64 GB                             |
| GPU       | AMD Radeon RX 7600 XT, 16 GB VRAM |
| Storage   | 1 TB SSD                          |


#### Dependencies

```
rpm-ostree install rocminfo rocm-smi
```

ROCm packages are prone to conflict with `steam.i686` in rpmfusion.

```
git clone https://github.com/Comfy-Org/ComfyUI.git
cd ComfyUI
python3 -m venv venv
source venv/bin/activate
```

As of 2026-Jan, ComfyUI suggests ROCm 6.4

```
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.4
pip install -r requirements.txt
```

#### Run ComfyUI

```
python main.py --lowvram
```

We'd better to monitor GPU usage
```
watch -n 1 rocm-smi
```

