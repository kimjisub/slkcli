# slacklane 💬

A macOS Slack CLI built for agent workflows.

`slacklane` reads the Slack desktop app's local session data, so you can work with Slack from the terminal without setting up OAuth apps, bot tokens, or manual cookie copying. It is designed for personal automation, AI agents, and fast terminal-native Slack workflows.

> Not affiliated with Slack. This tool uses your existing Slack desktop session and acts as your user account.
>
> Security / policy warning: `slacklane` does not use Slack's official OAuth flow. It reads locally available Slack session artifacts from the macOS desktop app and reuses them to act as the signed-in user. This is intended for personal automation on a machine you control.

## Why slacklane

- zero OAuth setup
- works with the Slack desktop app you already use
- built for CLI and agent workflows
- supports reading, searching, sending, reacting, drafts, pins, saved items, unread tracking, and workspace switching
- macOS-native auth flow using Keychain + local Slack storage

## Install

```bash
npm install -g slacklane
```

Or run it one-off:

```bash
npx slacklane auth
```

Requirements:
- macOS
- Slack desktop app installed and logged in
- Node.js 18+

### Local development install

```bash
cd /path/to/slacklane
npm link
```

To remove the global symlink later:

```bash
npm unlink -g slacklane
```

If you want a one-time install from the checked-out repo instead:

```bash
npm install -g .
```

## Quickstart

```bash
# verify auth
slacklane auth

# list channels, DMs, and workspaces
slacklane channels
slacklane dms
slacklane workspace list

# read channel or DM
slacklane read general
slacklane read @andrej 50

# switch workspace when multiple Slack teams are signed in locally
slacklane workspace use alpaon
slacklane workspace current

# search workspace
slacklane search "deployment failed"

# send a message
slacklane send general "hello from slacklane"
slacklane send general "reply in thread" --thread 1769753479.788949
slacklane send @andrej "hey, can you take a look?"

# inspect attention queues
slacklane inbox unread
slacklane inbox activity
slacklane inbox saved
slacklane channel pins general

# work with threads and message references
slacklane read general 20 --ts
slacklane thread general 1769753479.788949
slacklane react general 1769753479.788949 thumbsup
slacklane reply general 1769753479.788949 "on it"
slacklane message link general 1769753479.788949
slacklane message context general 1769753479.788949 2 2

# save a draft into Slack UI
slacklane draft channel general "draft for review"
slacklane draft dm @andrej "hey, can you take a look?"
```

## Commands

### Preferred command families

| Family | Command | Notes |
|---|---|---|
| Workspace | `slacklane workspace list` | List locally discovered logged-in Slack workspaces |
| Workspace | `slacklane workspace use <name|domain|team-id>` | Switch the active workspace used by later commands |
| Workspace | `slacklane workspace current` | Show the currently selected workspace |
| Inbox | `slacklane inbox activity` | Show channel activity with unread and mention counts |
| Inbox | `slacklane inbox unread` | Show only unread channels |
| Inbox | `slacklane inbox saved [count]` | Show saved-for-later items |
| Inbox | `slacklane inbox starred` | Show starred items and VIP users |
| Channel | `slacklane channel pins <channel>` | Show pinned items |
| Draft | `slacklane draft list` | List active drafts |
| Draft | `slacklane draft channel <channel> <message>` | Create a channel draft |
| Draft | `slacklane draft thread <channel> <ts> <message>` | Create a thread draft |
| Draft | `slacklane draft dm <user_id|@username> <message>` | Create a DM draft |
| Draft | `slacklane draft drop <draft_id>` | Delete a draft |
| Message | `slacklane reply <channel> <ts> <message>` | Send a thread reply |
| Message | `slacklane message link <channel> <ts>` | Show a Slack permalink for a message |
| Message | `slacklane message show <channel> <ts>` | Show one exact message |
| Message | `slacklane message context <channel> <ts> [before] [after]` | Show surrounding message context |

### Core commands

| Command | Alias | Description |
|---|---|---|
| `slacklane auth` |  | Test auth and show workspace identity |
| `slacklane channels` | `ch` | List channels |
| `slacklane dms` | `dm` | List DM conversations |
| `slacklane users` | `u` | List workspace users |
| `slacklane read <channel> [count]` | `r` | Read recent messages |
| `slacklane send <channel> <message>` | `s` | Send a message |
| `slacklane search <query> [count]` |  | Search workspace messages |
| `slacklane thread <channel> <ts> [count]` | `t` | Read thread replies |
| `slacklane react <channel> <ts> <emoji>` |  | Add a reaction |

### Legacy compatibility aliases

These still work, but the grouped family forms above are now the preferred public surface:

| Legacy command | Preferred command |
|---|---|
| `slacklane workspaces` / `slk ws` | `slacklane workspace list` |
| `slacklane switch <name>` / `slk sw <name>` | `slacklane workspace use <name>` |
| `slacklane activity` / `slk a` | `slacklane inbox activity` |
| `slacklane unread` / `slk ur` | `slacklane inbox unread` |
| `slacklane saved [count]` / `slk sv [count]` | `slacklane inbox saved [count]` |
| `slacklane starred` / `slk star` | `slacklane inbox starred` |
| `slacklane pins <channel>` / `slk pin <channel>` | `slacklane channel pins <channel>` |
| `slacklane drafts` | `slacklane draft list` |
| `slacklane draft <channel> <message>` | `slacklane draft channel <channel> <message>` |
| `slacklane draft user <user_id> <message>` | `slacklane draft dm <user_id|@username> <message>` |
| `slacklane permalink <channel> <ts>` | `slacklane message link <channel> <ts>` |
| `slacklane show <channel> <ts>` | `slacklane message show <channel> <ts>` |
| `slacklane context <channel> <ts> [before] [after]` | `slacklane message context <channel> <ts> [before] [after]` |

## Useful flags

| Flag | Description |
|---|---|
| `--ts` | Show raw Slack timestamps for thread follow-up |
| `--threads` | Auto-expand threads while reading |
| `--from YYYY-MM-DD` | Read messages from a date onward |
| `--to YYYY-MM-DD` | Read messages until a date |
| `--all` | Include completed items in `slacklane saved` |
| `--no-emoji` | Disable emoji output |

## Channel, DM, and workspace resolution

You can target conversations by:
- channel name: `general`
- channel ID: `C08A8AQ2AFP`
- DM username: `@andrej`
- Slack user ID: `U07RQTFCLUC`
- workspace name/domain/team-id for `slacklane workspace use`

Examples:

```bash
slacklane read general
slacklane read C08A8AQ2AFP
slacklane read @andrej 100 --threads
slacklane send U07RQTFCLUC "hello"
slacklane send general "follow-up" --thread 1769753479.788949
slacklane workspace use alpaon
slacklane workspace use teamcandid
slacklane draft dm @andrej "hello"
slacklane message link general 1769753479.788949
```

## Threads and message references

Once you have a message timestamp, you can read the thread, reply to it, or inspect the exact message and nearby context.

```bash
slacklane thread general 1769753479.788949
slacklane reply general 1769753479.788949 "on it"
slacklane send general "same effect via send" --thread 1769753479.788949
slacklane message link general 1769753479.788949
slacklane message show general 1769753479.788949
slacklane message context general 1769753479.788949 2 2
```

## Multiple workspaces

If you're signed into multiple Slack workspaces in the desktop app, `slacklane` can enumerate and switch between them.

```bash
# show discovered workspaces
slacklane workspace list

# inspect the current workspace selection
slacklane workspace current

# switch by workspace name
slacklane workspace use alpaon

# switch by Slack domain or team id
slacklane workspace use teamcandid
slacklane workspace use T12345678
```

Legacy aliases `slacklane workspaces` and `slacklane switch ...` still work, but the `workspace ...` family is the canonical surface.

The selected workspace is then used for subsequent `slacklane` commands.

## How auth works

`slacklane` reuses the credentials already present in the Slack desktop app.

1. reads the encrypted `d` cookie from Slack's local cookie store
2. decrypts it using the `Slack Safe Storage` key from macOS Keychain
3. scans Slack local storage for `xoxc-` session tokens
4. validates candidate credentials against Slack
5. caches the working token locally for faster future runs

Token cache location:

```text
~/.local/slacklane/token-cache.json
```

Runtime coordination files:

```text
~/.local/slacklane/runtime/
```

If auth gets stuck or Slack rotated your session:

```bash
rm ~/.local/slacklane/token-cache.json
slacklane auth
```

## Security note

On first run, macOS may ask whether to allow access to `Slack Safe Storage`.

- `Allow` gives one-time access
- `Always Allow` is more convenient, but lowers the security boundary for any process running as your user
- `Deny` prevents `slacklane` from authenticating

If this machine is shared or tightly managed, prefer the more conservative option.

## Rate limiting and multi-process safety

`slacklane` coordinates Slack API requests across multiple local processes.

That means if several shells, agents, cron jobs, or bots invoke `slacklane` at the same time, they share one local request lane instead of all hitting Slack at once.

Behavior:
- requests are globally paced across local `slacklane` processes
- if one process gets HTTP `429`, the cooldown is written to shared runtime state
- other local `slacklane` processes honor that cooldown automatically

Useful environment variables:

```bash
SLACKLANE_MIN_REQUEST_INTERVAL_MS=1200
SLACKLANE_MAX_429_RETRIES=2
SLACKLANE_LOCK_STALE_MS=30000
SLACKLANE_LOCK_POLL_MS=100
SLACKLANE_DEBUG_RATE_LIMIT=1
```

## Agent-friendly workflows

`slacklane` is especially useful when an agent needs real Slack context.

Examples:
- `slacklane inbox unread` → find what needs attention now
- `slacklane read <channel> 100` → summarize decisions and action items
- `slacklane search "launch checklist"` → recover prior context
- `slacklane channel pins <channel>` → inspect canonical references
- `slacklane draft channel <channel> "..."` → prepare a message for human review
- `slacklane thread <channel> <ts>` / `slacklane reply <channel> <ts> "..."` → inspect and answer inside one thread
- `slacklane message link <channel> <ts>` / `slacklane message context <channel> <ts>` → recover one exact message plus its surrounding context
- `slacklane workspace list` / `slacklane workspace use ...` → move between locally signed-in workspaces without reconfiguring tokens
- multiple concurrent `slacklane` invocations → automatically share one paced local Slack request lane

## Development

```bash
git clone https://github.com/kimjisub/slacklane.git
cd slacklane
node bin/slacklane.js auth
npm link
npm test
```

## Live Slack integration tests

Default `npm test` stays safe for local/CI runs. It includes the live test file, but that file auto-skips unless you explicitly opt in.

### Read-only live verification

Use this when you want to verify auth, workspace resolution, unread inbox, and message-reference commands against the real Slack desktop session:

```bash
SLACKLANE_LIVE_TESTS=1 \
SLACKLANE_LIVE_CHANNEL=general \
SLACKLANE_LIVE_MESSAGE_TS=1769753479.788949 \
npm run test:live
```

This runs real end-to-end checks for:
- `slacklane auth`
- `slacklane workspace current`
- `slacklane inbox unread`
- `slacklane message link/show/context`

### Live write verification

To also verify real thread writes, opt in explicitly and provide a safe thread target:

```bash
SLACKLANE_LIVE_TESTS=1 \
SLACKLANE_LIVE_ALLOW_WRITE=1 \
SLACKLANE_LIVE_CHANNEL=general \
SLACKLANE_LIVE_MESSAGE_TS=1769753479.788949 \
SLACKLANE_LIVE_THREAD_TS=1769753479.788949 \
npm run test:live
```

This additionally runs real end-to-end checks for:
- `slacklane reply <channel> <thread_ts> <message>`
- `slacklane send <channel> <message> --thread <thread_ts>`

### Environment variables

- `SLACKLANE_LIVE_TESTS=1` — enable live Slack tests at all
- `SLACKLANE_LIVE_CHANNEL` — conversation used for message-reference and write tests
- `SLACKLANE_LIVE_MESSAGE_TS` — existing message timestamp for `message link/show/context`
- `SLACKLANE_LIVE_ALLOW_WRITE=1` — opt in to mutating live tests
- `SLACKLANE_LIVE_THREAD_TS` — existing thread target for `reply` / `send --thread`

The write tests intentionally require a second opt-in so `npm run test:live` does not post to Slack unless you explicitly allow it.

## Notes

- macOS only
- Slack desktop app required
- zero runtime dependencies beyond Node built-ins
- session-based, so actions happen as your user account
- `activity` and `unread` respect mute settings
- local runtime coordination files live under `~/.local/slacklane/runtime/`

## Inspiration

This project was lightly inspired by earlier Slack CLI work, especially [`therohitdas/slacklane`](https://github.com/therohitdas/slacklane), and is being adapted here for a more agent-centric workflow.

## License

MIT
