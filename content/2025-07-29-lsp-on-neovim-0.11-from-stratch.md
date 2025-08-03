---
layout: post
title: "From Scratch: Set LSP on neovim 0.11"
description: ""
category: 
tags: []
---

There are countless examples

#### Step 0: Clean my old Neovim config

- `~/.config/nvim`
- `~/.local/share/nvim`
- `~/.local/state/nvim`

I created a new git branch for my brand new neovim config.

```
$ nvim --version
NVIM v0.11.2
```

#### Step 1: Install Package Manager (lazy.nvim)

As of 2025 Aug, the built-in plugin manager `vim.pack` is [still in early stage](https://web.archive.org/web/20250725133537/https://neovim.io/doc/user/pack.html#vim.pack). I'm going with [lazy.nvim](https://lazy.folke.io/) by [folke](https://github.com/folke).

Following the [official guide](https://lazy.folke.io/installation), I create `~/.config/nvim/lua/config/lazy.lua` and add `require("config.lazy")` to the brand new `~/.config/nvim/init.lua`

`lazy.nvim` fails to load when we have no plugins. So I add [johnfrankmorgan/whitespace](https://github.com/johnfrankmorgan/whitespace.nvim) to my nvim. Create `~/.config/nvim/lua/plugins/whitespace.lua` 

```
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

```
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"
```
I also remove them from `~/.config/nvim/lua/config/lazy.lua`

My `init.lua` now changes to 
```
require("config.key_binding")
require("config.lazy")
```
