# PackageDiscordAsar

Creates a Discord-like setup, full.distro and delta.distro (experimental)

## Known bugs

Since electron-winstaller doesn't support custom .nuspectemplate file, updater.node cannot be packaged.
The only way to curcumvent this is to use Goosemod's OpenAsar and it's Mu server.
(If you want to mod your Discord client and package it you should use a reverse enginnered alternative
instead of straight up using Discord's source lol)

## Required Files in appData directory

### Root directory
app.ico

### Resources directory
app.asar
build_info.json
bootstrap/manifest.json