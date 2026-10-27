#!/usr/bin/env node
// Stop hook: once a session has enough user prompts, show a one-time nudge to run /retro.
// It never blocks Claude and stays silent on any error.

const fs = require("fs");
const os = require("os");
const path = require("path");

const THRESHOLD = Number(process.env.RETRO_REMIND_AFTER || 15);

function countUserPrompts(transcriptPath) {
  let prompts = 0;
  let ranRetro = false;
  for (const line of fs.readFileSync(transcriptPath, "utf8").split("\n")) {
    if (!line.includes('"type":"user"')) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event.type !== "user" || event.isMeta) continue;
    const content = event.message && event.message.content;
    let text = "";
    if (typeof content === "string") {
      text = content;
    } else if (Array.isArray(content)) {
      // Tool results also arrive as user events; only count real typed text.
      text = content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join(" ");
    }
    if (!text.trim()) continue;
    if (/\bretro\b/i.test(text)) ranRetro = true;
    prompts++;
  }
  return { prompts, ranRetro };
}

function main(input) {
  const { session_id: sessionId, transcript_path: transcriptPath } = JSON.parse(input);
  if (!sessionId || !transcriptPath || !fs.existsSync(transcriptPath)) return;

  const stateDir = process.env.CLAUDE_PLUGIN_DATA || path.join(os.tmpdir(), "claude-retro");
  fs.mkdirSync(stateDir, { recursive: true });
  const marker = path.join(stateDir, `reminded-${sessionId.replace(/[^\w-]/g, "")}`);
  if (fs.existsSync(marker)) return;

  const { prompts, ranRetro } = countUserPrompts(transcriptPath);
  if (ranRetro || prompts < THRESHOLD) return;

  fs.writeFileSync(marker, new Date().toISOString());
  process.stdout.write(
    JSON.stringify({
      systemMessage: `Long session (${prompts} prompts). Run /retro to keep what this session taught.`,
    })
  );
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    main(input);
  } catch {
    // Stay silent: a reminder must never break a session.
  }
  process.exit(0);
});
