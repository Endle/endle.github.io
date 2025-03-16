---
layout: post
title: "从零写一个 Beancount CSV Importer"
description: ""
category: 
tags: [Beancount, finance]
---


#### 缘由  
在 2020 年，我曾经尝试过使用 Beancount 进行记账。但当时，我每一笔开销都是手动记录的。在最初的兴趣消退后，就再没有兴致去记账了。最近，感觉需要统计一下自己的开销比例，就重新翻出了 Beancount。当然，我要吸取上次的教训，选择直接导入信用卡账单，而非手动记录开销。最终的结果，是我在除夕忙了一整天，得到了一个初步可用的 python 程序，和这篇博客文章。


#### 为何撰写本文  
Amex CA 可以直接从网页上下载 CSV 格式的账单，内容非常简单，脱敏示例如下  

```
12/14/2022,"Reference: 003"," 44.05","SHOPPERS DRUG MART","",
12/14/2022,"Reference: 002"," 6.76","SOBEYS","",
12/16/2022,"Reference: 001"," 12.99","MEMBERSHIP FEE INSTALLMENT","",
```

可是，我在网上找了很多圈，处理这种 CSV 好像都是 too trivial case, 包括[官方文档](https://beancount.github.io/docs/importing_external_data.html)在内，对这个环节的描述都是凤毛麟角。

文章看了很多，工具也尝试了好几个，但最后，还是要自己撸代码，写一个 Importer。  

#### 代码实现  
参考 [Matt Terwilliger](https://mterwill.com/) 的 [Gist](https://gist.github.com/mterwill/7fdcc573dc1aa158648aacd4e33786e8), 我写出了一个简单的 Importer。

<https://gist.github.com/Endle/1033eb36135b50e19ea64ccc39be5ca7>


基类 `importer.ImporterProtocol` 只有两个必须实现的函数  

##### identify()  
返回 bool，判断是否要处理当前文件。有些人写的 `config.py` 比较完善，只要运行 `bean-extract  config.py ofx.csv ~/Downloads/statements/*`, `bean-extract` 就会根据 `identify()` 的结果，确定要用哪一个 Importer。在这里，我的代码比较简单。

##### extract()  
这个函数处理 CSV 账单。[哓哓](https://blog.sy-zhou.com/) 的[文章里](https://blog.sy-zhou.com/%E7%94%A8%E4%BA%8E%E6%94%AF%E4%BB%98%E5%AE%9D%E5%92%8C%E5%BE%AE%E4%BF%A1%E8%B4%A6%E5%8D%95%E7%9A%84beancount-import/)介绍了如何沿袭 CSV Importer 的结构写 Importer，但在起步阶段，我没有遵循这个结构，而是手动读 CSV 以后逐行处理。
```
    def extract(self, f):
        entries = []     
        with open(f.name) as f:
            for index, row in enumerate(csv.reader(f)):
                txn = self._process_row(index, row)
                entries.append(txn)
        return entries
 ```
 
 
#### 如何在 Windows 下安装 Beancount (Cygwin vs WSL)  
买一台新电脑的计划还是搁置状态，所以我只好在 Windows 笔记本上先凑合用。[官方手册](https://beancount.github.io/docs/installing_beancount.html)上说，*It’s a breeze if you use Cygwin*. 但我在执行 `python3 -m pip install beancount-import smart_importer` 时，总会在安装依赖 `scikit-learn` 时卡住。  

接下来，我就换到 WSL 里运行了。我在执行 `sudo pip3 install m3-cdecimal` 时失败了，但跳过这一步我也没看到有什么影响。


#### 后记  
我也为这是一个很简单的需求，但没想到，真做起来还是花了不少的时间。有很多人上传了自己实现的 importer，但在不了解 context 和设计思路的情况下，想要拿来直接用很困难。[这个页面](https://plaintextaccounting.org/#data-importconversion) 列举了很多 Importer，比如 Clojure 实现的 [csv2beancount](https://github.com/PaNaVTEC/csv2beancount). 还有 [高策](http://gaocegege.com/Blog/) 等人用 Go 实现的 [double-entry-generator](https://github.com/deb-sig/double-entry-generator). 

此外，[这个页面](https://plaintextaccounting.org/#data-importconversion)还有一些输出到 Ledger 和 HLedge 的工具。[这篇文章](https://beancount.github.io/docs/a_comparison_of_beancount_and_ledger_hledger.html) 介绍了一些区别。  

 


