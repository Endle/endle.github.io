---
layout: post
title: "从 Python Bytecode 的角度看 List Comprehension 生成 Tuple"
description: ""
category: 
tags: []
---

[Python List Comprehension](https://www.w3schools.com/python/python_lists_comprehension.asp) 使用非常广泛。通常认为，在生成的 [sequence](https://docs.python.org/3/glossary.html#term-sequence) 定长的情况下，应该生成 Tuple 而非 List。出于好奇，我简单研究一下这两者在 Bytecode 的区别。  



示例代码如下，很简单的 List Comprehension。
```
def transform(x:int)->int:
    return (x * 2) + 5

original_data = [3, 7, 6, 5, 4, 4, 8]

result_1 = [transform(x) for x in original_data]
result_1b = list(transform(x) for x in original_data)
result_2 = tuple(transform(x) for x in original_data)
```

首先，看一下最常见的写法 `[transform(x) for x in original_data]`  
```
import dis
dis.dis("result_1 = [transform(x) for x in original_data]")
  1           0 LOAD_CONST               0 (<code object <listcomp> at 0x7fe3345ea3a0, file "<dis>", line 1>)
              2 LOAD_CONST               1 ('<listcomp>')
              4 MAKE_FUNCTION            0
              6 LOAD_NAME                0 (original_data)
              8 GET_ITER
             10 CALL_FUNCTION            1
             12 STORE_NAME               1 (result_1)
             14 LOAD_CONST               2 (None)
             16 RETURN_VALUE

Disassembly of <code object <listcomp> at 0x7fe3345ea3a0, file "<dis>", line 1>:
  1           0 BUILD_LIST               0
              2 LOAD_FAST                0 (.0)
        >>    4 FOR_ITER                12 (to 18)
              6 STORE_FAST               1 (x)
              8 LOAD_GLOBAL              0 (transform)
             10 LOAD_FAST                1 (x)
             12 CALL_FUNCTION            1
             14 LIST_APPEND              2
             16 JUMP_ABSOLUTE            4
        >>   18 RETURN_VALUE
```

这里的 [dis module](https://github.com/python/cpython/blob/master/Lib/dis.py) 仅仅是 [built-in function compile](https://docs.python.org/3/library/functions.html#compile) 的 wrapper。


如果稍稍写的臃肿一些，写成 `list(transform(x) for x in original_data)` 我们会发现字节码有小幅的变动。

```
dis.dis("result_1b = list(transform(x) for x in original_data)")
  1           0 LOAD_NAME                0 (list)
              2 LOAD_CONST               0 (<code object <genexpr> at 0x7fe3344dda80, file "<dis>", line 1>)
              4 LOAD_CONST               1 ('<genexpr>')
              6 MAKE_FUNCTION            0
              8 LOAD_NAME                1 (original_data)
             10 GET_ITER
             12 CALL_FUNCTION            1
             14 CALL_FUNCTION            1
             16 STORE_NAME               2 (result_1b)
             18 LOAD_CONST               2 (None)
             20 RETURN_VALUE

Disassembly of <code object <genexpr> at 0x7fe3344dda80, file "<dis>", line 1>:
  1           0 LOAD_FAST                0 (.0)
        >>    2 FOR_ITER                14 (to 18)
              4 STORE_FAST               1 (x)
              6 LOAD_GLOBAL              0 (transform)
              8 LOAD_FAST                1 (x)
             10 CALL_FUNCTION            1
             12 YIELD_VALUE
             14 POP_TOP
             16 JUMP_ABSOLUTE            2
        >>   18 LOAD_CONST               0 (None)
             20 RETURN_VALUE
```

第一种方式 `[]` 调用了 `code object <listcomp>`，第二种方式 `list()` 则是用了 `code object <genexpr>`，并多了一次 `CALL_FUNCTION`。在 [Python/compile.c](https://github.com/python/cpython/blob/a81fca6ec8e0f748f8eafa12fb12cf9e12df465c/Python/compile.c#L4733) 里，我们能看到这两者的实现几乎是一样的。  
```
static int
compiler_genexp(struct compiler *c, expr_ty e)
{
    static identifier name;
    if (!name) {
        name = PyUnicode_InternFromString("<genexpr>");
        if (!name)
            return 0;
    }
    assert(e->kind == GeneratorExp_kind);
    return compiler_comprehension(c, e, COMP_GENEXP, name,
                                  e->v.GeneratorExp.generators,
                                  e->v.GeneratorExp.elt, NULL);
}

static int
compiler_listcomp(struct compiler *c, expr_ty e)
{
    static identifier name;
    if (!name) {
        name = PyUnicode_InternFromString("<listcomp>");
        if (!name)
            return 0;
    }
    assert(e->kind == ListComp_kind);
    return compiler_comprehension(c, e, COMP_LISTCOMP, name,
                                  e->v.ListComp.generators,
                                  e->v.ListComp.elt, NULL);
}
```

这两者都会交由 [`compiler_comprehension` 来处理](https://github.com/python/cpython/blob/a81fca6ec8e0f748f8eafa12fb12cf9e12df465c/Python/compile.c#L4635)。  
```
static int
compiler_comprehension(...){
--------------- snip ---------------
    if (type != COMP_GENEXP) {
        int op;
        switch (type) {
        case COMP_LISTCOMP:
            op = BUILD_LIST;
            break;
        case COMP_SETCOMP:
            op = BUILD_SET; break;
        case COMP_DICTCOMP:
            op = BUILD_MAP; break;
        default:
            PyErr_Format(PyExc_SystemError,
                         "unknown comprehension type %d", type);
            goto error_in_scope;
        }
        ADDOP_I(c, op, 0);
    }

    if (!compiler_comprehension_generator(c, generators, 0, 0, elt,
                                          val, type))
        goto error_in_scope;
    if (type != COMP_GENEXP) {
        ADDOP(c, RETURN_VALUE);
    }
    --------------- snip ---------------
    return 1;
error_in_scope: error:
    --------------- snip: error handling ---------------
}
```
到这里，我可以判断 `code object <listcomp>` 的返回值已经是 `list object`。而 `code object <genexpr>` 的返回值需要额外的一组指令  
```
  1           0 LOAD_NAME                0 (list)
             14 CALL_FUNCTION            1
```

到这里，我们再看一下尝试生成 tuple 的 Bytecode。
```
dis.dis("result_2 = tuple(transform(x) for x in original_data)")
  1           0 LOAD_NAME                0 (tuple)
              2 LOAD_CONST               0 (<code object <genexpr> at 0x7ff4af1ed450, file "<dis>", line 1>)
              4 LOAD_CONST               1 ('<genexpr>')
              6 MAKE_FUNCTION            0
              8 LOAD_NAME                1 (original_data)
             10 GET_ITER
             12 CALL_FUNCTION            1
             14 CALL_FUNCTION            1
             16 STORE_NAME               2 (result_2)
             18 LOAD_CONST               2 (None)
             20 RETURN_VALUE

Disassembly of <code object <genexpr> at 0x7ff4af1ed450, file "<dis>", line 1>:
  1           0 LOAD_FAST                0 (.0)
        >>    2 FOR_ITER                14 (to 18)
              4 STORE_FAST               1 (x)
              6 LOAD_GLOBAL              0 (transform)
              8 LOAD_FAST                1 (x)
             10 CALL_FUNCTION            1
             12 YIELD_VALUE
             14 POP_TOP
             16 JUMP_ABSOLUTE            2
        >>   18 LOAD_CONST               0 (None)
             20 RETURN_VALUE

```

与上文的 `result_1b` 非常类似，`code object <genexpr>` 的结果会被
```
  1           0 LOAD_NAME                0 (tuple)
             14 CALL_FUNCTION            1
```
处理，并将结果绑定在变量名 `result_2` 上。  


我们同样可以讲 `code object <genexpr>` 的结果直接绑定在某个名称上，而非调用 `list()` 或 `tuple()` 。
```
>>>result_3 = (transform(x) for x in original_data)
>>>type(result_3)
<class 'generator'>
>>>dis.dis("result_3 = (transform(x) for x in original_data)")
  1           0 LOAD_CONST               0 (<code object <genexpr> at 0x7ff4af0e0c90, file "<dis>", line 1>)
              2 LOAD_CONST               1 ('<genexpr>')
              4 MAKE_FUNCTION            0
              6 LOAD_NAME                0 (original_data)
              8 GET_ITER
             10 CALL_FUNCTION            1
             12 STORE_NAME               1 (result_3)
             14 LOAD_CONST               2 (None)
             16 RETURN_VALUE

Disassembly of <code object <genexpr> at 0x7ff4af0e0c90, file "<dis>", line 1>:
-----snip----
```
但是，这样创建出的 `generator` 会在遍历时被消耗掉(consume)。如果有访问这些元素的需求，还是要第一时间将其转换为 [sequence](https://docs.python.org/3/glossary.html#term-sequence)  

```
>>> result_3 = (transform(x) for x in original_data)
>>> sum(result_3)
109
>>> sum(result_3)
0

```


运行环境  
```
>>> import sys
>>> sys.version
'3.9.2 (default, Feb 20 2021, 00:00:00) \n[GCC 10.2.1 20201125 (Red Hat 10.2.1-9)]'
```

推荐阅读：  
- [An introduction to Python bytecode](https://opensource.com/article/18/4/introduction-python-bytecode)  
- [Your Guide to the CPython Source Code](https://realpython.com/cpython-source-code-guide/)  
- [Inside the Python Virtual Machine](https://leanpub.com/insidethepythonvirtualmachine)  
