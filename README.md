# claude-retro

A self-improving loop for [Claude Code](https://claude.com/claude-code). After a session,
run `/retro`. Claude looks back at what went wrong, what got repeated, and what you
corrected, then proposes 1 to 3 small updates to your `CLAUDE.md`, memory, or skills.
You approve each one. Over time, the same mistake stops happening twice.

Inspired by the "continual harness" idea in
[Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent), rebuilt for Claude Code.

## What's inside

| Part | What it does |
|---|---|
| `retro` skill | Reviews the session, proposes changes with evidence, applies only what you approve |
| `retro-reviewer` agent | Optional fresh-eyes read of the transcript for long sessions |
| Stop hook | Once per long session (15+ prompts), reminds you to run `/retro` |

## Install

```bash
claude plugin marketplace add abo3losh1/claude-retro
claude plugin install retro@claude-retro
```

Or from a local clone: `claude plugin marketplace add ./claude-retro`.

## Rollback with git (recommended)

Lessons are written to your own files, not the plugin. Put them under git so every
change is a commit you can read and undo:

```bash
cd ~/.claude
git init
```

Then add a `.gitignore` that tracks only your setup and never credentials or history:

```gitignore
/*
!/.gitignore
!/CLAUDE.md
!/settings.json
!/agents/
!/commands/
!/skills/
/skills/synced/
!/projects/
/projects/*/*
!/projects/*/memory/
```

When `~/.claude` is a git repo, `/retro` commits each approved change as `retro: ...`.
Undo one with `git -C ~/.claude revert <hash>`.

## Settings

- `RETRO_REMIND_AFTER`: number of prompts before the reminder (default 15).

## Rules it follows

- At most 3 changes per retro, each tied to a real moment in the session.
- Edits existing rules before adding new ones. Zero changes is a valid result.
- Nothing is written without your approval. Nothing is pushed.

## License

MIT
