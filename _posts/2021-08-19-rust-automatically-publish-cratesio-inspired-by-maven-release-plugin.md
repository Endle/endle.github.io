---
layout: post
title: "自动向 Crates.io 发布新版本"
description: ""
category: tool
tags: [rust, maven, github, cicd]
---

#### 缘起  
之前写 Java 时，自己所在的组遵循这样的 workflow:  
1. 每当 master branch 有新 commit 时，会使用 [Maven Release Plugin](http://maven.apache.org/maven-release/maven-release-plugin/) 修改 `pom.xml` 内的版本号  
2. Bot 会将新版本的 Maven Package 上传到 JFrog 内。  

最近，我在尝试维护一个 [Rust 包 rust_bundler_cp][rbcp]，想着复刻上文的 Maven Workflow，每当有新 commit 时自动向 crates.io 发布新版本。摸索一段时间后成功在 Github Action 上实现了这个功能。

#### 实现  
首先，需要一个修改 `Cargo.toml` 的工具。虽然自己写一个脚本识别版本号只需要几行，但我还是用了现有的软件包 [cargo-bump][]. 使用非常简单，不再赘述了。  

[GitHub Action on](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) 可以设置触发条件。但是，我没有找到如何设置在不同的触发条件下执行不同的任务。在[原有的代码中](https://github.com/Endle/rust-bundler-cp/blob/176f9f22cdbdcaa874c0ee0943dfe5ac810fa868/.github/workflows/rust.yml#L5)，Pull Request 和新 commit 都会触发相同的任务。我不打算对原有的 workflow 做过多的修改，因此，我写了一个每次都会被执行的 Python 脚本，用它进行必要的操作。  


首先，我在 [脚本](https://github.com/Endle/rust-bundler-cp/blob/176f9f22cdbdcaa874c0ee0943dfe5ac810fa868/bump_version.py#L31) 内判断当前是否是在 master branch 执行 CICD 任务。  
```
    branch_name = shell_call("git branch --show-current")
    if branch_name not in ['master']:
        print("Current branch  ({})  is not for release. Exiting".format(branch_name))
        return
```

可以使用如下命令创建新的 commit  
```
def bump_version():
    def extract_ver(s)->str:
        with_quotes = s.split("=")[1].strip()
        wo_q = with_quotes.replace('"', '')
        return wo_q

    shell_call("cargo bump patch")
    diff = shell_call("git diff Cargo.toml| grep version | egrep ^[+-]").split("\n")
    versions = [extract_ver(v) for v in diff]
    return versions[0], versions[1]
    
    # Snip 
    (old_ver, new_ver) = bump_version()
    version_change_info = " From {} To {}".format(old_ver, new_ver)


    new_commit_message = MESSAGE_FLAG + version_change_info
    git_commit_cmd = "git add Cargo.toml && git commit  -m '{}'".format(new_commit_message)
    subprocess.run(git_commit_cmd, shell=True)
```

在执行 `git commit` 前，需要先设置作者的姓名和 email. 我将[这一步放到了 `rust.yml` 中](https://github.com/Endle/rust-bundler-cp/blob/176f9f22cdbdcaa874c0ee0943dfe5ac810fa868/.github/workflows/rust.yml#L100)，在 Python 脚本前运行。  
```
          git config --global user.name 'Endle'
          git config --global user.email 'Endle@users.noreply.github.com'
          git branch --show-current
          python3 --version
          python3 bump_version.py
```

在 crates.io 上注册帐号后，需要创建自己的 Token. 接着，在 Github Project->Settings->Secrets 里存储该token, 如图所示：  
  
<img src="/images/github/github_action_rust_crates_io.png" alt="Github Screenshot" width="100%">


这样，在 `rust.yml` 中，就可以使用如下命令上传到 crates.io:  
```
      - name: Push to Github and crates
        env:
          CRATES_SECRET: ${{ secrets.CRATES_ENDLE }}
        run: |
            git push origin master
            cargo login "$CRATES_SECRET"
            cargo publish -v
```

#### 后记  
使用 [Github actions/checkout@v2](https://github.com/marketplace/actions/checkout)，向原有的 repo 执行 `git push` 不需要手动设置 token。可以参考 <https://stackoverflow.com/a/58393457/1166518>  

我在我的 Python 脚本中加入了对上一个 commit message 的判断，从而避免 Workflow 被重复触发。但实践中发现，bot 创建的 commit 并没有触发 GitHub Actions. 我还不太清楚这是什么机制导致的。我在撰写本文是意识到，我应该在 commit message 中加入 `[skip ci]` 作为标识。

如果设置了 crates.io 的镜像，如  
```
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"

replace-with = "mirror"
[source.mirror]
registry = "https://mirrors.sjtug.sjtu.edu.cn/git/crates.io-index/"
```

在运行 `cargo publish` 前，需要将 `replace-with = "mirror"` 暂时注释掉。在网络条件不好的环境下，使用 Github Action 发布，可以省下不少时间。





 
[rbcp]: https://github.com/Endle/rust-bundler-cp
 [cargo-bump]: https://github.com/wraithan/cargo-bump
