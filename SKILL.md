---
name: slack-personal
description: Read, send, search, and manage Slack messages and DMs via the slacklane CLI. Supports multiple workspaces with switching. Use when the user asks to check Slack, read channels or DMs, send Slack messages, search Slack, check unreads, manage drafts, view saved items, switch Slack workspaces, or interact with Slack workspace. Also use for heartbeat Slack checks. Triggers on "check slack", "any slack messages", "send on slack", "slack unreads", "search slack", "slack threads", "draft on slack", "read slack dms", "message on slack", "switch workspace", "slack workspaces".
homepage: https://www.npmjs.com/package/slacklane
metadata: {"moltbot":{"emoji":"💬","requires":{"bins":["slacklane","slk"]},"install":[{"id":"npm","kind":"node","package":"slacklane","bins":["slacklane","slk"],"label":"Install slacklane (npm)"}],"os":["darwin"]}}
---

# slacklane — Slack CLI

Session-based Slack CLI for macOS. Auto-authenticates from the Slack desktop app — no tokens, no OAuth, no app installs. Acts as your user (`xoxc-` session tokens).

## Commands

```bash
# Auth
slacklane auth                              # Test authentication, show user/team

# Core read/write
slacklane channels                          # List channels (alias: ch)
slacklane dms                               # List DM conversations with IDs (alias: dm)
slacklane users                             # List workspace users (alias: u)
slacklane read <channel> [count]            # Read recent messages, default 20 (alias: r)
slacklane read @username [count]            # Read DMs by username
slacklane read <channel> --threads          # Auto-expand all threads
slacklane read <channel> --from 2026-02-01  # Date range filter
slacklane thread <channel> <ts> [count]     # Read thread replies, default 50 (alias: t)
slacklane search <query> [count]            # Search messages across workspace
slacklane send <channel> <message>          # Send a message (alias: s)
slacklane send <channel> <message> --thread <ts>  # Send into an existing thread
slacklane react <channel> <ts> <emoji>      # React to a message
slacklane reply <channel> <ts> <message>    # Reply to a thread root or thread message
slacklane message link <channel> <ts>       # Print the Slack permalink for one message
slacklane message show <channel> <ts>       # Show one exact message
slacklane message context <channel> <ts> [before] [after]  # Show nearby context

# Preferred workspace family
slacklane workspace list                    # List all logged-in workspaces
slacklane workspace use <name|domain|id>    # Switch active workspace
slacklane workspace current                 # Show the current workspace

# Preferred inbox family
slacklane inbox activity                    # All channels with unread/mention counts
slacklane inbox unread                      # Only unreads, excludes muted
slacklane inbox saved [count] [--all]       # Saved for later items
slacklane inbox starred                     # VIP users + starred items
slacklane channel pins <channel>            # Pinned items in a channel

# Preferred drafts family (synced to Slack editor UI)
slacklane draft list                        # List active drafts
slacklane draft channel <channel> <message> # Draft a channel message
slacklane draft thread <ch> <ts> <message>  # Draft a thread reply
slacklane draft dm <user_id|@username> <message>  # Draft a DM
slacklane draft drop <draft_id>             # Delete a draft

# Legacy compatibility aliases
slacklane workspaces                        # Alias: workspace list (alias: ws)
slacklane switch <name|domain|id>           # Alias: workspace use (alias: sw)
slacklane activity                          # Alias: inbox activity (alias: a)
slacklane unread                            # Alias: inbox unread (alias: ur)
slacklane starred                           # Alias: inbox starred (alias: star)
slacklane saved [count] [--all]             # Alias: inbox saved (alias: sv)
slacklane pins <channel>                    # Alias: channel pins (alias: pin)
slacklane drafts                            # Alias: draft list
slacklane draft <channel> <message>         # Alias: draft channel
slacklane draft user <user_id> <message>    # Alias: draft dm
slacklane permalink <channel> <ts>          # Alias: message link
slacklane show <channel> <ts>               # Alias: message show
slacklane context <channel> <ts> [before] [after]  # Alias: message context
```

Channel accepts name (`general`), ID (`C08A8AQ2AFP`), `@username` for DMs, or user ID (`U07RQTFCLUC`).

## Auth

Automatic — extracts session tokens from Slack desktop app's LevelDB (`localConfig_v2`) + decrypts cookie from macOS Keychain.

**First run:** macOS will show a Keychain dialog asking to allow access to "Slack Safe Storage":
- **Allow** — one-time access, prompted again next time
- **Always Allow** — permanent, no future prompts (convenient but any process running as your user can extract credentials silently)
- **Deny** — blocks access, slacklane cannot authenticate

**Token cache:** `~/.local/slacklane/token-cache.json` — auto-validated, auto-refreshed on `invalid_auth`.
**Active workspace:** `~/.local/slacklane/active-workspace` — stores the selected team ID. Delete to reset to default.
**Runtime coordination:** `~/.local/slacklane/runtime/` — shared pacing + 429 cooldown state for concurrent local `slacklane` processes.

If auth fails (token rotated, Slack logged out):
```bash
rm ~/.local/slacklane/token-cache.json
slacklane auth
```

Slack desktop app must be installed and logged in. Does not need to be running if token is cached.

## Workspaces

All workspaces logged in to the Slack desktop app are available. Tokens are extracted from `localConfig_v2` in LevelDB.

```bash
slacklane workspace list                    # List all workspaces (shows ← active marker)
slacklane workspace current                 # Show the current selection / default
slacklane workspace use candid              # Switch by name (fuzzy match)
slacklane workspace use unipad-team         # Switch by domain
slacklane workspace use T05BFH4UW5T         # Switch by team ID
slacklane auth                              # Verify current workspace
```

Legacy aliases `slacklane workspaces` and `slacklane switch ...` still work, but the `workspace ...` family is the canonical surface.

The `workspace use` command matches against workspace name, domain, or team ID (case-insensitive, partial match supported). After switching, all subsequent commands operate on the selected workspace until switched again.

## Reading Threads

Threads require a Slack timestamp. Use `--ts` to get it, then read the thread or act on one exact message:

```bash
slacklane read general 10 --ts
# Output: [1/30/2026, 11:41 AM ts:1769753479.788949] User [3 replies]: ...

slacklane thread general 1769753479.788949
slacklane reply general 1769753479.788949 "on it"
slacklane send general "same effect via send" --thread 1769753479.788949
slacklane message link general 1769753479.788949
slacklane message show general 1769753479.788949
slacklane message context general 1769753479.788949 2 2
```

## Agent Workflow Examples

- **Heartbeat/cron unread check** — `slacklane inbox unread` → `slacklane read <channel>` for channels that need attention
- **Save & pick up** — Human saves threads in Slack ("Save for later"). Agent runs `slacklane inbox saved` during heartbeat, reads full threads with `slacklane thread`, summarizes or extracts action items
- **Daily channel digest** — `slacklane read <channel> 100` across key channels → compile decisions, open questions, action items → `slacklane send daily-digest "📋 ..."`
- **Weekly DM summary** — `slacklane read @boss 200 --from 2026-02-01 --threads` → extract action items, decisions, context
- **Thread monitoring** — `slacklane thread <channel> <ts>` to inspect the thread, then `slacklane reply <channel> <ts> "..."` or `slacklane send <channel> "..." --thread <ts>` to answer in place
- **Message-level navigation** — `slacklane message link <channel> <ts>` for the permalink, `slacklane message show <channel> <ts>` for the exact item, `slacklane message context <channel> <ts>` for surrounding context
- **Draft for human review** — `slacklane draft channel <channel> "..."` posts to Slack's editor UI for human to review before sending
- **Search-driven context** — `slacklane search "deployment process"` or `slacklane channel pins <channel>` to pull context before answering questions
- **Concurrent local automation** — Multiple agents or cron jobs can invoke `slacklane` safely; requests are paced through one shared local runtime lane and 429 cooldowns propagate automatically

## Live Slack integration tests

The repo now supports opt-in real-Slack integration tests in `tests/live-slack.test.js`.

- Default `npm test` remains safe because the live file auto-skips unless `SLACKLANE_LIVE_TESTS=1` is set.
- Read-only live verification requires:
  - `SLACKLANE_LIVE_TESTS=1`
  - `SLACKLANE_LIVE_CHANNEL`
  - `SLACKLANE_LIVE_MESSAGE_TS`
- Write verification additionally requires:
  - `SLACKLANE_LIVE_ALLOW_WRITE=1`
  - `SLACKLANE_LIVE_THREAD_TS`

Run:

```bash
npm test
SLACKLANE_LIVE_TESTS=1 SLACKLANE_LIVE_CHANNEL=general SLACKLANE_LIVE_MESSAGE_TS=1769753479.788949 npm run test:live
SLACKLANE_LIVE_TESTS=1 SLACKLANE_LIVE_ALLOW_WRITE=1 SLACKLANE_LIVE_CHANNEL=general SLACKLANE_LIVE_MESSAGE_TS=1769753479.788949 SLACKLANE_LIVE_THREAD_TS=1769753479.788949 npm run test:live
```

The write tests intentionally require a second opt-in so they do not post to Slack by accident.

## Limitations

- **macOS only** — uses Keychain + Electron storage paths
- **Session-based** — acts as your user, not a bot. Be mindful of what you send
- **Draft drop** may fail with `draft_has_conflict` if Slack has that conversation open
- **Session token** expires on logout — keep Slack app running or rely on cached token

## Missing Features & Issues

Create PR or Report Issue at: https://github.com/kimjisub/slacklane
