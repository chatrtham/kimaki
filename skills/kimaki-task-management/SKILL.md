---
name: kimaki-task-management
repo: chatrtham/kimaki
description: Manage Kimaki scheduled OpenCode tasks from Discord or standalone OpenCode. Use when the user asks to schedule work, run something later, repeat a prompt, list, edit, inspect, or cancel a Kimaki task.
---

# Kimaki Task Management

Use Kimaki's CLI as the source of truth for scheduled OpenCode tasks. Do not
inspect or edit its SQLite database directly.

## Destination

Choose the destination from the context that is actually available:

- In a Kimaki Discord session, use the current channel, thread, session, user,
  and agent IDs from the session metadata.
- In standalone OpenCode, use the current absolute project path from `pwd` and
  resolve it with `kimaki project list --json`. Use `--project <path>` for a
  project-level task.
- Use `--channel`, `--thread`, or `--session` only when the user supplied or
  the CLI resolved that identifier. Never invent IDs.

Kimaki tasks run as headless sessions through the Kimaki service. Channel-level
tasks report results in Discord. A standalone OpenCode session can create and
manage the task, but cannot make the task resume that unrelated session unless
it supplies a mapped `--thread` or `--session`.

## Create

Run `kimaki task list` first to check for a duplicate. Use a short,
self-contained prompt and an explicit UTC ISO timestamp ending in `Z` or a UTC
cron expression.

From a standalone OpenCode session:

```bash
kimaki send --project /absolute/path/to/project \
  --prompt 'Short self-contained task prompt' \
  --send-at '<UTC ISO timestamp or UTC cron>'
```

From a Kimaki Discord session, add the available context:

```bash
kimaki send --channel <channel-id> \
  --prompt 'Short self-contained task prompt' \
  --send-at '<UTC ISO timestamp or UTC cron>' \
  --agent <current_agent> \
  --parent-session <current-session-id> \
  --user '<current-user-id>'
```

Only pass `--parent-session`, `--agent`, or `--user` when their values are
known. In standalone OpenCode, do not guess them. If `KIMAKI_TASK_USER_ID` is
configured and the user wants Discord thread notifications, pass that ID as
`--user`; otherwise warn that a task without a user may not appear in the
user's Discord sidebar.

Use `--model provider/model` when the user explicitly chooses a model. Use
`--notify-only` for a Discord reminder that should not start an AI session. Do
not combine `--notify-only` with `--thread`.

Never guess a timezone. Ask for the timezone or UTC equivalent when a local
time is ambiguous. Scheduled prompts cannot answer permission or interactive
questions, so warn about those requirements before creating the task.

## Manage

```bash
kimaki task list
kimaki task list --all
kimaki task edit <task-id> --prompt 'new prompt' --send-at '<new UTC schedule>'
kimaki task edit <task-id> --model 'provider/model'
kimaki task delete <task-id>
```

Before deleting or editing, list tasks and resolve the intended task. Ask if
multiple tasks match. After a successful mutation, report the task ID, status,
schedule, next run time, destination, and whether it is one-time or recurring.
Never claim success without the CLI result.
