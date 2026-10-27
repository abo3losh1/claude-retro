---
name: retro
description: Review the current session and turn what went wrong or got repeated into 1 to 3 small, approved updates to CLAUDE.md, memory, or skills. Use when the user says "retro", "/retro", "what did we learn", "remember this for next time", "improve yourself", or when a long session is ending.
---

# Retro

The goal: every session leaves the setup a little better. Lessons go into the user's own
files, never into this plugin, so they survive plugin updates.

## 1. Gather evidence

Look back over this session. You already have it in context. Collect moments like:

- **Corrections.** The user said "no", "don't", "I told you", "instead", or undid your work.
- **Retries.** A command, edit, or approach failed and you tried again. What would have
  worked the first time?
- **Lookups.** You searched for the same fact twice, or found a fact the next session
  will need again (a path, a command, an API quirk).
- **Repeated workflows.** A multi-step task the user has done before, or will clearly do again.
- **Wrong assumptions.** Something you believed about the user, project, or tools that was false.
- **Things that went well** that the user confirmed ("yes, exactly", "perfect"). These
  are worth keeping too.

If the session is long or compacted, or the user asks for a deeper review, dispatch the
`retro-reviewer` agent. Give it the transcript path: the most recently modified `.jsonl`
in `~/.claude/projects/<project-slug>/`, where the slug is the working directory with
`:`, `\`, `/`, spaces, and dots replaced by `-`. Merge its findings with your own.

## 2. Pick at most 3 lessons

Keep a lesson only if it is:

- **Backed by a specific moment** in this session. No generic advice.
- **Likely to matter again.** One-off details stay out.
- **Not already covered.** Read the target file first. If a rule exists but was ignored,
  sharpen the wording instead of adding a duplicate.

Fewer is better. Zero is a fine result. Say so and stop.

## 3. Choose where each lesson goes

| Lesson type | Target |
|---|---|
| How Claude should behave in every project | `~/.claude/CLAUDE.md` |
| A fact or rule about this project or repo | `CLAUDE.md` in the project root |
| A fact about the user, their goals, or outside resources | The memory folder, in the format the system prompt describes (one fact per file, plus a line in `MEMORY.md`) |
| A repeated multi-step workflow | A new or updated skill in `~/.claude/skills/<name>/SKILL.md` |

Prefer editing an existing line or file over adding a new one. Keep each change short:
one to three lines for a rule, one file for a memory. Never write into the plugin's own
directory or `~/.claude/plugins/`.

## 4. Propose, then wait

Show each proposal as:

```
1. <one-line summary>
   Target: <file path>
   Evidence: <the moment in this session, quoted briefly>
   Change:
   <exact text to add, or old -> new>
```

Then ask which to apply. Use the AskUserQuestion tool with `multiSelect: true` if it is
available. Never apply a change the user did not approve.

## 5. Apply and commit

Apply the approved changes. Then, if `~/.claude` is a git repo
(`git -C ~/.claude rev-parse --git-dir` succeeds), commit only the files you changed there:

```bash
git -C ~/.claude add -- <changed files>
git -C ~/.claude commit -m "retro: <short summary>"
```

Changes to a project's own `CLAUDE.md` are not committed; tell the user they are left
for their own repo. Never push.

## 6. Report

In two or three sentences: what changed, where, and how to undo it
(`git -C ~/.claude revert <hash>`).
