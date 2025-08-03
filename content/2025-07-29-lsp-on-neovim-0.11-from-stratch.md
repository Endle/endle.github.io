---
layout: post
title: "From Scratch: Set LSP on neovim 0.11"
description: ""
category: 
tags: []
---

In this guide, I walk through setting up a fresh Neovim configuration from scratch, using the latest features provided by Neovim 0.11.

#### Step 0: Clean my old Neovim config

- `~/.config/nvim`
- `~/.local/share/nvim`
- `~/.local/state/nvim`

I created a new git branch for my brand new neovim config.

```bash
$ nvim --version
NVIM v0.11.2
```

#### Step 1: Install Package Manager (lazy.nvim)

In Neovim 0.11, the built-in plugin manager `vim.pack` is [still in early stage](https://web.archive.org/web/20250725133537/https://neovim.io/doc/user/pack.html#vim.pack). ([Development News](https://bsky.app/profile/neovim.io/post/3lt5en72xq22r)) I'm going with [lazy.nvim](https://lazy.folke.io/) by [folke](https://github.com/folke).

Following the [official guide](https://lazy.folke.io/installation), I create `~/.config/nvim/lua/config/lazy.lua` and add `require("config.lazy")` to the brand new `~/.config/nvim/init.lua`

`lazy.nvim` fails to load when we have no plugins. So I add [johnfrankmorgan/whitespace](https://github.com/johnfrankmorgan/whitespace.nvim) to my nvim. Create `~/.config/nvim/lua/plugins/whitespace.lua` 

```lua
return {
    'johnfrankmorgan/whitespace.nvim',
    config = function ()
        require('whitespace-nvim').setup({
            highlight = 'DiffDelete',
            ignored_filetypes = { 'TelescopePrompt', 'Trouble', 'help', 'dashboard' },
            ignore_terminal = true,
            return_cursor = true,
        })
        -- remove trailing whitespace with a keybinding
        -- vim.keymap.set('n', '<Leader>t', require('whitespace-nvim').trim)
    end
}
```

Restart nvim, this plugin is automatically installed. Executing `:checkhealth lazy` should say OK.

##### Move vim key binding to a new config file
Personally I prefer to gather my vim keybind settings. I create a new file `~/.config/nvim/lua/config/key_binding.lua`

```lua
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"
```
I also remove them from `~/.config/nvim/lua/config/lazy.lua`

My `init.lua` now changes to 
```lua
require("config.key_binding")
require("config.lazy")
```

#### Step 2: Install Mason

[Mason.nvim](https://github.com/mason-org/mason.nvim) is the most popular neovim plugin for LSP servers. I only use `lazy.nvim` as package manager, so I don't follow the best practice on readme. I create `~/.config/nvim/lua/plugins/mason.lua`

```lua
return {
    {"mason-org/mason.nvim"},
    {"mason-org/mason-lspconfig.nvim"},
}
```

I put my lsp config in a separate file `~/.config/nvim/lua/config/lsp_config.lua`
```lua
require("mason").setup()
require("mason-lspconfig").setup()
```

I also add `require("config.lsp_config")` to `init.lua`

#### Step 3: Install LSP Server via Mason

I use mason to manage my installed LSP servers, so my life could be easier when I'm migrating my neovim config between multiple computers. 
[mason-registry](https://mason-registry.dev/registry/list) shows all the plugins managed by mason.
For now, I install `clangd`. Modify `~/.config/nvim/lua/config/lsp_config.lua`

```lua
require("mason").setup()
require("mason-lspconfig").setup({
    ensure_installed = { "clangd" },
})
vim.lsp.enable({
    "clangd"
})
```

[neovim/nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) collects basic config files for most LSP servers. I prefer to only copy files needed instead of cloning the whole repo. 

```bash
mkdir -p ~/.config/nvim/lsp && cd ~/.config/nvim/lsp
wget https://raw.githubusercontent.com/neovim/nvim-lspconfig/refs/heads/master/lsp/clangd.lua
```
Restart neovim, mason automatically downloads `clangd`. 

```bash
~/.local/share/nvim/mason/bin/clangd --version
clangd version 20.1.8 (https://github.com/llvm/llvm-project 87f0227cb60147a26a1eeb4fb06e3b505e9c7261)
Features: linux+grpc
Platform: x86_64-unknown-linux-gnu
```

#### Try clangd in a real C/C++ project

I use [rizsotto/Bear](https://github.com/rizsotto/Bear) by [László Nagy](https://github.com/rizsotto) to generate `compile_commands.json`. 
Neovim 0.11 [provides a few default lsp key mappings](https://gpanders.com/blog/whats-new-in-neovim-0-11/#more-default-mappings). 

#### Step 4: Show inline error message
As [Heiker][] says [in their blog](https://vonheikemen.github.io/devlog/tools/neovim-lsp-client-guide/#:~:text=There%20is%20an%20option%20to%20show%20the%20error%20message%20inline%2E%20This%20is%20called%20%22virtual%20text%2E%22%20This%20used%20to%20be%20enabled%20by%20default%2C%20but%20now%20on%20Neovim%20v0%2E11%20is%20disabled%2E) `Virtual text is an option to show the error message inline.` We add it to `~/.config/nvim/lua/config/lsp_config.lua`

```lua
vim.diagnostic.config({
  virtual_text = true,
})
```

#### Epilogue
The step-by-step code is hosted at [https://github.com/Endle/my-neovim-config/commits/nvim_11_demo/](https://github.com/Endle/my-neovim-config/commits/nvim_11_demo/)

[Heiker][] has written several articles about nvim, including [built-in treesitter](https://vonheikemen.github.io/learn-nvim/feature/treesitter.html), [LSP guide](https://vonheikemen.github.io/devlog/tools/neovim-lsp-client-guide/), [simple config](https://vonheikemen.github.io/devlog/tools/simple-neovim-config/)


[Heiker]: https://hachyderm.io/@vonheikemen
