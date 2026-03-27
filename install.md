# Installing FeedbackBasket Agent Skills

## Step 0: Install the FeedbackBasket CLI

```bash
npm install -g feedbackbasket-cli
```

Verify installation:
```bash
feedbackbasket --version
```

## Step 1: Authenticate

```bash
feedbackbasket login
```

This opens your browser for OAuth authentication. One click to authorize, and you're in.

Verify:
```bash
feedbackbasket auth status
```

You should see your email and organization.

## Step 2: Add Skills

```bash
npx skills add deifos/feedbackbasket-skills
```

The installer auto-detects your agent (Claude Code, Cursor, VS Code, etc.).

**Flags:**
- `-a claude-code` — install for a specific agent
- `-g` — install globally

Verify:
```bash
npx skills list
```

### Alternative: Manual Install via CLI

The FeedbackBasket CLI can install the skill directly:

```bash
feedbackbasket setup claude
```

This copies the skill to `~/.claude/skills/feedbackbasket/SKILL.md` automatically.

## Step 3: Verify

Both commands should succeed:
```bash
feedbackbasket --version
feedbackbasket auth status
```

Then start a new Claude Code session. The agent can now manage your FeedbackBasket projects:

```
> feedbackbasket projects list --agent
> feedbackbasket bugs list --severity high --agent
> feedbackbasket widget script myapp --agent
```

## What You Can Do

Once installed, the skill enables management of:

- **Projects** — create, show, update, delete (accepts name or ID)
- **Feedback** — list, show, search, update status, add notes, delete, bulk update, export
- **Bug Reports** — list with severity filtering, statistics
- **Widgets** — view settings, customize, get embed code
- **Team** — list members, update roles, remove members
- **Auth** — login, logout, status, token

## Troubleshooting

**CLI not found:**
```bash
npm install -g feedbackbasket-cli
```

**Not authenticated:**
```bash
feedbackbasket login
```

**Skill not detected in Claude Code:**
```bash
feedbackbasket setup claude
# Then start a new Claude Code session
```

**Check everything:**
```bash
feedbackbasket doctor
```
