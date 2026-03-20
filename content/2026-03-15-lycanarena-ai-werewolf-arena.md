---
layout: post
title: "LycanArena - 有发言规则的 AI 狼人杀"
description: ""
category: 
tags: []
---


2017 年的时候，我看到了 [Libratus 
击败了人类德州扑克玩家](https://www.cmu.edu/news/stories/archives/2017/january/AI-beats-poker-pros.html) 这条新闻，我就在想，能不能设计出狼人杀的 AI war。进而，可以试着寻找一些 Game Theory Optimal 的策略，比如狼人应该用什么频率自刀，村民应该用什么频率穿神牌的衣服。
 
 
到了 2023 年，随着 ChatGPT 的风行，[我在想能不能用 LLM 实现狼人杀的 AI 
 War](https://x.com/zhenboli1/status/1627091896983240708)。但是，
LLM也带来了自然语言的模糊与不精确。
 
最近，我终于抽出时间，实现了我最初的创意：AI War Arena。在发言阶段，每个玩家的发言不再是自然语言，而是从严格规定的 
Utterance object 中选取的若干语句。这种设计，也让人类玩家，Rule-based AI 和 LLM 可以参与同一场游戏。


#### Rule-based AI
我实现了一个使用 Rule-based AI，里面有一些简单的发言规则（比如预言家一定会跳身份）。如果加入的玩家数量不足，就可以用这个简单的 
bot 把板子填满。


#### Natural Language to Utterance Objects
我现在使用了 `llama-3.1-70b`，一个是因为它支持 
`response_format`，另一个原因就是它便宜。


这种最常见的发言

`我是预言家，player-3是狼`
会被转换成这两个   Utterance Objects
```
RoleClaimD 
自称身份为 Role(Seer)。
BeliefReport
判断 Bot player-3 (player-3) 属于 Group(Wolf)（High confidence）。
```

不过，我现在的 NL parser 还很不成熟。有可能是 70b 的模型不够强，需要新模型加上新 prompt，才能涵盖更多类型的发言。

这里有一个五分钟的演示视频
https://www.youtube.com/watch?v=rauAgqg9XJE
