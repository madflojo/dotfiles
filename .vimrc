set tabstop=2
set shiftwidth=2
set expandtab
set nosmartindent
set noautoindent

# Enable syntax highlighting
syntax on

# Disable expandtab for Makefiles
autocmd FileType make setlocal noexpandtab

# Enable Markdown files for Copilot (disabled by default)
let g:copilot_filetypes = {'markdown': v:true}

# Enable rainbow parentheses
let g:rainbow_active = 1
