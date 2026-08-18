# Kimaki skills

This folder contains **local skills** maintained in this repo.

`kimaki-task-management` contains the scheduling guidance shared by Kimaki
Discord sessions and standalone OpenCode sessions. Keep scheduling mechanics
there rather than in the always-injected system prompt. The standalone OpenCode
installation also keeps a copy at `~/.config/opencode/skills/kimaki-task-management`.

Other bundled skills are synced from their own repos into `cli/skills/` by
`cli/scripts/sync-skills.ts`. Edit those skills in their source repo, then run:

```bash
cd cli
pnpm sync-skills
```

Filter skills at runtime:

```bash
kimaki --enable-skill npm-package --enable-skill new-skill
kimaki --disable-skill playwriter --disable-skill zele
```

Use either `--enable-skill` or `--disable-skill`, not both.
