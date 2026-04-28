# slk 💬

A macOS Slack CLI built for agent workflows.

`slk` reads the Slack desktop app's local session data, so you can work with Slack from the terminal without setting up OAuth apps, bot tokens, or manual cookie copying. It is designed for personal automation, AI agents, and fast terminal-native Slack workflows.

> Not affiliated with Slack. This tool uses your existing Slack desktop session and acts as your user account.
>
> Security / policy warning: `slk` does not use Slack's official OAuth flow. It reads locally available Slack session artifacts from the macOS desktop app and reuses them to act as the signed-in user. This is intended for personal automation on a machine you control.

## Why slk

- zero OAuth setup
- works with the Slack desktop app you already use
- built for CLI and agent workflows
- supports reading, searching, sending, reacting, drafts, pins, saved items, unread tracking, and workspace switching
- macOS-native auth flow using Keychain + local Slack storage

## Install

```bash
npm install -g slkcli
```

Or run it one-off:

```bash
npx slkcli auth
```

Requirements:
- macOS
- Slack desktop app installed and logged in
- Node.js 18+

### Local development install

```bash
cd /path/to/slkcli
npm link
```

To remove the global symlink later:

```bash
npm unlink -g slkcli
```

If you want a one-time install from the checked-out repo instead:

```bash
npm install -g .
```

## Quickstart

```bash
# verify auth
slk auth

# list channels, DMs, and workspaces
slk channels
slk dms
slk workspaces

# read channel or DM
slk read general
slk read @andrej 50

# switch workspace when multiple Slack teams are signed in locally
slk switch alpaon

# search workspace
slk search "deployment failed"

# send a message
slk send general "hello from slk"
slk send @andrej "hey, can you take a look?"

# inspect attention queues
slk unread
slk activity
slk saved
slk pins general

# work with threads
slk read general 20 --ts
slk thread general 1769753479.788949
slk react general 1769753479.788949 thumbsup

# save a draft into Slack UI
slk draft general "draft for review"
```

## Commands

| Command | Alias | Description |
|---|---|---|
| `slk auth` |  | Test auth and show workspace identity |
| `slk channels` | `ch` | List channels |
| `slk dms` | `dm` | List DM conversations |
| `slk users` | `u` | List workspace users |
| `slk read <channel> [count]` | `r` | Read recent messages |
| `slk send <channel> <message>` | `s` | Send a message |
| `slk search <query> [count]` |  | Search workspace messages |
| `slk thread <channel> <ts> [count]` | `t` | Read thread replies |
| `slk react <channel> <ts> <emoji>` |  | Add a reaction |
| `slk activity` | `a` | Show channel activity with unread and mention counts |
| `slk unread` | `ur` | Show only unread channels |
| `slk starred` | `star` | Show starred items and VIP users |
| `slk saved [count]` | `sv` | Show saved-for-later items |
| `slk pins <channel>` | `pin` | Show pinned items |
| `slk workspaces` | `ws` | List locally discovered logged-in Slack workspaces |
| `slk switch <name|domain|team-id>` | `sw` | Switch the active workspace used by later commands |
| `slk draft <channel> <message>` |  | Create a channel draft |
| `slk draft thread <channel> <ts> <message>` |  | Create a thread draft |
| `slk draft user <user_id> <message>` |  | Create a DM draft |
| `slk drafts` |  | List active drafts |
| `slk draft drop <draft_id>` |  | Delete a draft |

## Useful flags

| Flag | Description |
|---|---|
| `--ts` | Show raw Slack timestamps for thread follow-up |
| `--threads` | Auto-expand threads while reading |
| `--from YYYY-MM-DD` | Read messages from a date onward |
| `--to YYYY-MM-DD` | Read messages until a date |
| `--all` | Include completed items in `slk saved` |
| `--no-emoji` | Disable emoji output |

## Channel, DM, and workspace resolution

You can target conversations by:
- channel name: `general`
- channel ID: `C08A8AQ2AFP`
- DM username: `@andrej`
- Slack user ID: `U07RQTFCLUC`
- workspace name/domain/team-id for `slk switch`

Examples:

```bash
slk read general
slk read C08A8AQ2AFP
slk read @andrej 100 --threads
slk send U07RQTFCLUC "hello"
slk switch alpaon
slk switch teamcandid
```

## Multiple workspaces

If you're signed into multiple Slack workspaces in the desktop app, `slk` can enumerate and switch between them.

```bash
# show discovered workspaces
slk workspaces

# switch by workspace name
slk switch alpaon

# switch by Slack domain or team id
slk switch teamcandid
slk switch T12345678
```

The selected workspace is then used for subsequent `slk` commands.

## How auth works

`slk` reuses the credentials already present in the Slack desktop app.

1. reads the encrypted `d` cookie from Slack's local cookie store
2. decrypts it using the `Slack Safe Storage` key from macOS Keychain
3. scans Slack local storage for `xoxc-` session tokens
4. validates candidate credentials against Slack
5. caches the working token locally for faster future runs

Token cache location:

```text
~/.local/slk/token-cache.json
```

If auth gets stuck or Slack rotated your session:

```bash
rm ~/.local/slk/token-cache.json
slk auth
```

## Security note

On first run, macOS may ask whether to allow access to `Slack Safe Storage`.

- `Allow` gives one-time access
- `Always Allow` is more convenient, but lowers the security boundary for any process running as your user
- `Deny` prevents `slk` from authenticating

If this machine is shared or tightly managed, prefer the more conservative option.

## Agent-friendly workflows

`slk` is especially useful when an agent needs real Slack context.

Examples:
- `slk unread` → find what needs attention now
- `slk read <channel> 100` → summarize decisions and action items
- `slk search "launch checklist"` → recover prior context
- `slk pins <channel>` → inspect canonical references
- `slk draft <channel> "..."` → prepare a message for human review
- `slk thread <channel> <ts>` → inspect the full decision trail in a thread
- `slk workspaces` / `slk switch ...` → move between locally signed-in workspaces without reconfiguring tokens

## Development

```bash
git clone https://github.com/kimjisub/slkcli.git
cd slkcli
node bin/slk.js auth
npm link
```

## Notes

- macOS only
- Slack desktop app required
- zero runtime dependencies beyond Node built-ins
- session-based, so actions happen as your user account
- `activity` and `unread` respect mute settings

## Inspiration

This project was lightly inspired by earlier Slack CLI work, especially [`therohitdas/slkcli`](https://github.com/therohitdas/slkcli), and is being adapted here for a more agent-centric workflow.

## License

MIT
