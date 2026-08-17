---
name: kimaki-development-workflows
repo: chatrtham/kimaki
description: Use for Kimaki tunnels, dev-server access from Discord, git worktrees, or related development workflows.
---

# Kimaki Development Workflows

## Tunnels

When starting a dev server for a Discord user, expose it through `kimaki tunnel`
so the user receives a reachable URL. Do not send localhost URLs.

Use `tuistory` for long-running processes so output, readiness, and shutdown
remain controllable:

```bash
bunx tuistory launch "kimaki tunnel -- pnpm dev" -s projectname-dev
bunx tuistory -s projectname-dev wait "/ready|local|tunnel/i" --timeout 30000
bunx tuistory read -s projectname-dev
```

Use a random tunnel ID by default. Pass a custom ID only for a service safe to
expose publicly. `kimaki tunnel` injects `TRAFORO_URL`; use it for OAuth,
webhook, and absolute URL configuration. The port is normally detected from
server output, so only pass `--port` when detection fails.

Stop and inspect sessions with:

```bash
bunx tuistory -s projectname-dev press ctrl c
bunx tuistory -s projectname-dev close
bunx tuistory sessions
```

Read `bunx tuistory --help` when command syntax is unclear.

## Worktrees

Only create a worktree when the user explicitly asks for one. Use Kimaki rather
than raw `git worktree add`:

```bash
kimaki send --channel <channel-id> --prompt 'Describe the task' \
  --worktree feature-name --agent <current_agent> \
  --parent-session <current-session-id> --user '<current-user-id>'
```

Use kebab-case names. A worktree starts from the current checkout unless the
user specifies another base. In an existing worktree, work in that checkout
and do not create another one unless explicitly requested.

Use `--cwd` to reuse an existing project subfolder or worktree. The path must
belong to the project or be listed by `git worktree list`:

```bash
kimaki send --channel <channel-id> --prompt 'Run the restricted task' \
  --cwd /path/to/project/worktree --agent <current_agent> \
  --parent-session <current-session-id> --user '<current-user-id>'
```

Ask the new session to operate only in its current checkout. Do not tell it to
create another worktree.

## Submodules

When a pull changes a submodule pointer, commit that pointer update before
doing unrelated work. Never rewrite or force-push a submodule branch in a way
that makes the referenced commit unreachable.
