---
name: kimaki-task-management
repo: chatrtham/kimaki
description: >
  Manage Kimaki Discord tasks and reminders. Use when the user asks to schedule
  work, run something later, repeat a prompt, list or inspect scheduled tasks,
  edit a schedule, or cancel a task. Do not use for systemd timers, external
  schedulers, or Telegram schedulers.
---

# Kimaki Task Management

Use Kimaki's CLI as the source of truth for Discord task scheduling. Do not
inspect or edit the SQLite database directly.

## Context

In a Discord session, use the dynamic context already attached to the current
session instead of guessing identifiers:

- Current Discord channel ID is in the Kimaki session context.
- Current thread ID and OpenCode session ID are in the Kimaki session context.
- The current user's ID is in the per-turn `<discord-user ... user-id="..." />`
  metadata.
- The current agent is in the per-turn `Current agent` reminder.

When the user says "here" or names the current project, schedule in the current
channel. Resolve another project with `kimaki project list --json` before using
its channel. If the required destination or user ID is unavailable, ask rather
than inventing it.

## Create

Run `kimaki task list` first to check for an existing task that would duplicate
the request. Then use `kimaki send --send-at` with the resolved context:

```bash
kimaki send --channel <channel-id> \
  --prompt 'Short self-contained task prompt' \
  --send-at '<UTC ISO timestamp or UTC cron>' \
  --agent <current_agent> \
  --parent-session <current-session-id> \
  --user '<current-user-id>'
```

Use `--send-at` with a UTC ISO timestamp ending in `Z` for a one-time task or a
cron expression for a recurring task. Never guess a timezone. If the user
gives a local time without a timezone, ask for the timezone or its UTC
equivalent.

Always pass `--user` for Discord schedules so the user is added to the task
thread and can see future runs. Keep the opening prompt short; put substantial
instructions in a project task file and have the scheduled prompt refer to it.
Use `--notify-only` for a reminder that should not start an OpenCode session.

Do not use `--notify-only` with `--thread`. A scheduled prompt in an existing
thread starts or resumes the AI session in that thread.

## Session behavior

- A channel-level one-time task creates a new Discord thread and persistent
  OpenCode session.
- Each occurrence of a recurring channel task creates a fresh thread and
  persistent session.
- A task scheduled with `--thread` targets the existing thread and its mapped
  session, so replies in that thread can continue the same conversation.
- The OpenCode process is headless between turns, but session history and the
  Discord thread remain resumable after the process restarts.
- `--notify-only` creates a Discord notification without an AI session.

Scheduled prompts run unattended. Warn the user if the task needs a permission
approval or interactive answer that will not be available at run time.

## Manage

Use the CLI rather than guessing whether a mutation succeeded:

```bash
kimaki task list
kimaki task edit <task-id> --prompt 'new prompt' --send-at '<new UTC schedule>'
kimaki task edit <task-id> --user '<discord-user-id>'
kimaki task delete <task-id>
```

After creating or editing a task, report the task ID, schedule, next run time,
destination, and whether it is one-time or recurring. Before deleting, resolve
the target with `kimaki task list`; ask if more than one task matches.

If command syntax is unclear, run `kimaki send --help` or `kimaki task --help`
and use the live output. Never claim a task was created without a successful
CLI result containing its task ID.
