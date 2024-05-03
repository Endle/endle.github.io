---
layout: post
title: "Compile .NET's Test Suite and Run .NET Tests under Wine"
description: ""
category: 
tags: []
---

In 2024 March, I had been trying to build .NET test suite and running 
them under Wine. 
Although I didn't gather valuable Wine results yet, I'd write this 
article to record the pitfalls I've met when compiling .NET, and I hope 
it may help readers (including me) in future.


### Preparation  

#### Install Visual Studio 2019  
According to the [requirements page][], Visual Studio 2019 is required 
for [v5.0.18][]. I created a brand new Windows 11 instance, and 
installed Visual Studio Community 2019 at 
<https://visualstudio.microsoft.com/vs/older-downloads/>. With the 
Visual Studio Installer, I can install the required SDKs listed in the 
[requirements page][].

Initially I installed VS 2022, and installed Win10 SDK. However, the 
required dependencies couldn't be located by the toolchain.


#### Install Dependencies  
The [Windows App 
Installer](https://learn.microsoft.com/en-us/windows/package-manager/winget/) is included on Windows 11 and later version of Windows 10. If not, it's easy to install it via [Windows App 
Store](https://apps.microsoft.com/detail/9nblggh4nns1?hl=en-us&gl=CA).  

Install dependencies with `winget` is similar to package managers:  
```
winget install -e --id Python.Python.3.9
winget install -e --id Git.Git
```

Note: Don't install LLVM with winget here. As we're building 
[v5.0.18][v5.0.18], the manually installed LLVM might be too new.


### Build  

Following the [workflow 
guide](https://github.com/dotnet/runtime/blob/v5.0.18/docs/workflow/README.md), we can start building now.  

#### Building CoreCLR (Common Language Runtime)  
Execute `build.cmd -subset clr` in cmd. [Ref](
https://github.com/dotnet/runtime/blob/v5.0.18/docs/workflow/building/coreclr/README.md)  

Note: `build.cmd` is just a wrapper to a PowerShell script 
`eng/build.ps1`. Seems that Microsoft had been migrating cmd into ps1. 


#### Building Libraries  
The [official 
guide](https://github.com/dotnet/runtime/blob/v5.0.18/docs/workflow/building/coreclr/README.md) is messy to me. I executed `build.cmd clr+libs -c Release` here.

#### Building Tests for CoreCLR  
Following the [official guide](https://github.com/dotnet/runtime/blob/v5.0.18/docs/workflow/testing/coreclr/testing.md), we can build all tests by  `src\coreclr\build-test.cmd`

This is a time consuming step.  

#### Running All Tests under Windows  
.NET shipped `src\coreclr\tests\runtest.cmd` to invoke the test cases. However, [Wine's CMD implementation](https://gitlab.winehq.org/wine/wine/-/tree/master/programs/cmd?ref_type=heads) lacks basic features to execute this complex cmd script, so I've been finding a method to workaround it.

In Windows CMD, I can invoke all tests by  
```
"C:\Users\li\Documents\runtime\.dotnet\dotnet.exe" msbuild C:\Users\li\Documents\runtime\src\coreclr\tests\src\runtest.proj /p:Runtests=true /clp:showcommandline 
```   


#### Running Tests under Wine
I copied the whole directory from my Windows 11 Guest into my Fedora host, stored at `/home/lizhenbo/winp/runtime`. Wine mapped it to `Z:\home\lizhenbo\winp\runtime`.

First, I need to set `CORE_ROOT`. Wine will pass the shell environment ([Ref](https://askubuntu.com/a/672625/134171)), so I need

```
export CORE_ROOT=Z:\\home\\lizhenbo\\winp\\runtime\\artifacts\\tests\\coreclr\\Windows_NT.x64.Debug\\Tests\\Core_Root
```

Then I can run the test suite

```
wine "Z:\\home\\lizhenbo\\winp\\runtime\\.dotnet\\dotnet.exe" msbuild Z:\\home\\lizhenbo\\winp\\runtime\\src\\coreclr\\tests\\src\\runtest.proj /p:Runtests=true /clp:showcommandline 
```   

However, the test crased just a few seconds later. I have no ideas yet  
```
Unhandled exception: page fault on read access to 0x0000000000000000 in 64-bit code (0x006fffffe62475).

Backtrace:
=>0 0x006fffffe62475 wcslen+0x1f(str=0x00000000000000000) [/home/lizhenbo/src/wine64/../wine/dlls/ntdll/wcstring.c:218] in ntdll (0x007ffffe27e570)
  1 0x006fffffdedd1b strdupW+0x18(str=0x00000000000000000) [/home/lizhenbo/src/wine64/../wine/dlls/ntdll/actctx.c:660] in ntdll (0x007ffffe27e5b0)
  2 0x006fffffdfd4aa RtlCreateActivationContext+0x237(handle=00007FFFFE27E708, ptr=00007FFFFE27E758) [/home/lizhenbo/src/wine64/../wine/dlls/ntdll/actctx.c:5292] in ntdll (0x007ffffe27e640)
  3 0x006fffff8bee72 CreateActCtxW+0x84(ctx=00007FFFFE27E758) [/home/lizhenbo/src/wine64/../wine/dlls/kernelbase/loader.c:1157] in kernelbase (0x007ffffe27e720)
  4 0x0000014002f362 in corerun (+0x2f362) (0x007ffffe27ffa0)
...
  12 0x006fffffcc1cc6 BaseThreadInitThunk+0x20(unknown=0, entry=000000014000B160, arg=000000007FFD0000) [/home/lizhenbo/src/wine64/../wine/dlls/kernel32/thread.c:61] in kernel32 (0x007ffffe27ffa0)
  13 0x006fffffe4c0a7 in ntdll (+0x6c0a7) (0000000000000000)
0x006fffffe62475 wcslen+0x1f [/home/lizhenbo/src/wine64/../wine/dlls/ntdll/wcstring.c:218] in ntdll: movzxw (%rax), %eax
218	    while (*s) s++;
```
  


[requirements page]:    https://github.com/dotnet/runtime/blob/v5.0.18/docs/workflow/requirements/windows-requirements.md  

[requirements]: https://github.com/dotnet/runtime/blob/v5.0.18/docs/workflow/requirements/windows-requirements.md  
  
[v5.0.18]: https://github.com/dotnet/runtime/tree/v5.0.18  
