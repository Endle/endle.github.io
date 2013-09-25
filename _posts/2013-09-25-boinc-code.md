---
layout: post
title: "Boinc 源代码的阅读笔记"
description: ""
category: project 
tags: [C++, C, boinc, project]
---
{% include JB/setup %}

在论坛上跟人聊天，提到了修改 BOINC 客户端，以便于屯包的设想。在开学前没什么事，就挖下了这个坑。我修改后的版本，可以在 [这里][gcrepo] 看到。当然，现在还没有什么可用性。

获取代码
--
BOINC 的代码可以从官方网站 [下载][offi]，也可以从我在 GitCafe 上留的镜像 [下载][master]（注意是 master 分支）。可以参照 [官方手册][man] 编译安装。
[gcrepo]: https://gitcafe.com/endle/BOINCc/tree/dev
[offi]: http://boinc.berkeley.edu/trac/wiki/SourceCodeGit
[master]: https://gitcafe.com/endle/BOINCc/tree/master
[man]: http://boinc.berkeley.edu/wiki/Compiling_the_core_client

系统机制
--
软件最基本的是两部分：`boinc` 和 `boinccmd`。`boinc` 使用 `recv()` 函数接收来自 `boinccmd` 的消息，并维护一个消息队列。而 `boinccmd` 负责跟用户沟通，将用户输入的指令转化成 xml 格式，然后用 `send()` 发送给 `boinc`。

入手点
--
第一个思路，就是找 `main` 函数。在 `client/boinc_cmd.cpp` 里的 main 函数，会对用户输入的命令进行初步的检查。接着，`boinccmd` 会通过`retval = rpc.init(hostname, port)`尝试与 HOST 建立连接，并调用 `RPC_CLIENT` 类的方法。

RPC_CLIENT
--
`RPC_CLIENT` 的定义在 `lib/gui_rpc_client.h` 里。可以看出，这是一个负责与 HOST 进行沟通的模块。以 `lib/gui_rpc_client_ops.cpp` 中的 `project_op` 函数为例（部分精简）：
{% highlight c %}
int RPC_CLIENT::project_op(PROJECT& project, const char* op) {
    int retval;
    SET_LOCALE sl;
    char buf[512];
    const char *tag;
    RPC rpc(this);

    if (!strcmp(op, "reset")) {
        tag = "project_reset";
    } else if (!strcmp(op, "detach")) {
        tag = "project_detach";
    } else if (!strcmp(op, "update")) {
        tag = "project_update";
    } else if (!strcmp(op, "suspend")) {
        tag = "project_suspend";
        project.suspended_via_gui = true;
    } else if (!strcmp(op, "resume")) {
        tag = "project_resume";
        project.suspended_via_gui = false;
    } else {
        return -1;
    }
    sprintf(buf,
        "<%s>\n"
        "  <project_url>%s</project_url>\n"
        "</%s>\n",
        tag,
        project.master_url.c_str(),
        tag
    );
    retval = rpc.do_rpc(buf);
    if (!retval) {
        retval = rpc.parse_reply();
    }

    return retval;
}
{% endhighlight %}

用户的指令会被包装成 xml 格式，然后使用 `send_request(const chap *p)` 函数发送给 `boinc`

接收命令
----
`client/gui_rpc_server_ops.cpp` 的 `GUI_RPC_CONN::handle_rpc()` 用 `recv` 或 `read` 来接收消息，并进行处理。它通过调用 `lib/parse/h` 的 `match_tag(const char *, const char *)` 来解析 xml，并调用对应的函数。
在进行初步的匹配后，用户指令会以字符串的形式发送给 `handle_project_op`。对于多数的命令，程序会通过 gstate 的方式来处理。

下一步工作
--
折腾了一段时间，对 BOINC 的程序框架（尤其是用户交互部分）有了些许了解。接下来，就要啃啃 `client/client_state.h` 里的 `class CLIENT_STATE`，与 BOINC 的核心部分打交道了。
