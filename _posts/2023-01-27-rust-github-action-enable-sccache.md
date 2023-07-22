---
layout: post
title: "为 Rust 项目的 Github Action 启用 Sccache - 2023 年的新办法"
description: ""
category: rust
tags: []
---

受到 [Xuanwo 的博客][xuanwo] 的鼓动，我决定给自己的 Rust 项目 
[fireSeqSearch](https://github.com/Endle/fireSeqSearch) 加上 [Sccache][]。


#### sccache 概述    

[Sccache][] 可以简单看成 [ccache][] 的 Rust 
版。它有很多激动人心的特性，但那不在本文的范畴里。我在本地编译原有的项目时，只需运行 
`RUSTC_WRAPPER="sccache" cargo build` 即可启用 sccache。默认的缓存路径为 
`~/.cache/sccache`



#### 缓存 Cargo Registry   
[我原先的代码里](https://github.com/Endle/fireSeqSearch/blob/6e760731e1f91df5f647f0bd551aceb5d83bfcbb/.github/workflows/rust.yml#L35) 缓存了 `~/.cargo/registry`，但这只是编译前的 [crate.io registry](https://doc.rust-lang.org/cargo/reference/registries.html), 而不是编译产生的目标代码，加速 CI 效果有限。


#### 2022 年的笨办法  
最开始，我仅仅是将 `~/.cache/sccache` 
添加到了缓存路径里。[代码如下](https://github.com/Endle/fireSeqSearch/blob/0e26622b8d794a2dbc83afaeb6fca1fa48cb7d01/.github/workflows/rust.yml)：  

```
      - name: Cache cargo registry and sccache
        uses: actions/cache@v3
        continue-on-error: false
        with:
          path: |
            ~/.cargo/registry
            ~/.cache/sccache
```


[我的这个改动](https://github.com/Endle/fireSeqSearch/commit/0e26622b8d794a2dbc83afaeb6fca1fa48cb7d01)
误解了 [sccache-action](https://github.com/mozilla/sccache-action) 
的用法，并没有发挥它真正的强大之处。使用笨办法，大概 600M 的 `~/.cache/sccache` 都会被 GitHub Action 
缓存。随着时间推移，缓存文件的体积会膨胀，在 `restore/save` 
时浪费时间。[我自己的经验](https://gist.github.com/Endle/efe07ca76b6e148c4682e101ff9a6731)，在 macOS instance 
上，接收 150M 的缓存就用了 3 分钟 （当然，这也与服务器实际运行情况有关）。  


#### 2023 年的新办法  
感谢 [Xuanwo](https://xuanwo.io/) 本人的答疑，我将 `~/.cache/sccache` 移出了 
`actions/cache@v3`。[改动](https://github.com/Endle/fireSeqSearch/commit/969950f7fdb794eab1b57880d0334b5285bb404f)后的[代码如下](https://github.com/Endle/fireSeqSearch/blob/969950f7fdb794eab1b57880d0334b5285bb404f/.github/workflows/rust.yml)

```
env:
  CARGO_TERM_COLOR: always
  RUSTC_WRAPPER: "sccache"
  SCCACHE_GHA_ENABLED: "true"
--- snip ---
      - name: Run sccache-cache
        uses: Xuanwo/sccache-action@c94e27bef21ab3fb4a5152c8a878c53262b4abb0
        with:
          version: "v0.4.0-pre.6"
      - name: Cache cargo registry
        uses: actions/cache@v3
        with:
          path: |
            ~/.cargo/registry
```

#### 最直接的优点：细粒度缓存  
相比旧办法，使用 [sccache-action](https://github.com/mozilla/sccache-action) 
并不会将 `~/.cache/sccache` 作为整体上传到 GitHub Action Cache 里，而是会细粒度地将每个对象上传。


在 
<https://github.com/Endle/fireSeqSearch/actions/caches> 里可以看到，大小从几K到几百K，乃至20M的对象被存入了 GHA。这很好地避免了旧方法中缓存文件夹膨胀的问题。

![Screenshot of Github Action Cache](/images/2023/rust/Screenshot 2023-01-28 GitHub Action Cache.png)


#### 后记  
在撰写完本文大概两周后，发现 [xxchan][] 写了一篇博文 [我如何动动小手就让 CI 时间减少了 10 分钟](https://xxchan.me/cs/2023/02/11/optimize-rust-comptime.html) 比本文更详细、更完整。  


[Sccache]: https://github.com/mozilla/sccache  
[ccache]: https://ccache.dev/
[xuanwo]: https://xuanwo.io/reports/2023-04/   
[xxchan]: https://xxchan.me/about/  
