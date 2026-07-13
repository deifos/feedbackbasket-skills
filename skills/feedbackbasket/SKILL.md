---
name: FeedbackBasket
description: Manage FeedbackBasket projects, feedback, bugs, website widgets, mobile app feedback, waitlists, and teams from the command line. Use whenever an agent needs to configure FeedbackBasket in a web or mobile app, install its Swift SDK or hosted mobile form, collect feedback, or manage a FeedbackBasket project.
triggers:
  - feedbackbasket
  - feedback
  - bugs
  - bug reports
  - user feedback
  - widget
  - feedback widget
  - mobile feedback
  - ios feedback
  - swift sdk
invocable: true
argument-hint: "<command> [options]"
---

# FeedbackBasket CLI

Full command-line interface for managing feedback, bug reports, projects, widgets, and team in FeedbackBasket. Works with any AI agent that can run shell commands.

## Authentication

```bash
feedbackbasket login                   # Opens browser — one click, full access
feedbackbasket login --token <TOKEN>   # Manual token (CI/headless)
feedbackbasket auth status             # Check auth state
feedbackbasket doctor                  # Full diagnostics
```

## Output Modes

| Flag | Output | When to Use |
|------|--------|-------------|
| (none) | Styled (TTY) or JSON (piped) | Auto-detect |
| `--json` | JSON envelope with breadcrumbs | Parse full response |
| `--agent` | Raw JSON data only | Agent automation |
| `--quiet` | Raw JSON data only | Scripting |
| `--md` | Markdown | Documentation |

**Agent rule**: Always use `--agent` for programmatic access. Parse the JSON output directly.

## Quick Reference

### Projects
```bash
feedbackbasket projects list
feedbackbasket projects show <name-or-id>
feedbackbasket projects create "My App" --url https://myapp.com --description "..."
feedbackbasket projects update <name-or-id> --name "New Name" --url <url> --description "..."
feedbackbasket projects update <name-or-id> --reply-to vlad@example.com  # default reply-to for feedback replies
feedbackbasket projects delete <name-or-id> --yes
```

All project commands accept **name or ID**. Names are matched case-insensitively with fuzzy suggestions on typos.

### Mobile App Feedback

Resolve the project for the current app before changing mobile configuration. Prefer a clearly matching project name or product URL. If multiple projects are plausible, ask the user which one to use. If none exists, confirm a real product, support, marketing, or App Store URL before creating it; never invent a public URL or use a local development address.

```bash
feedbackbasket mobile status <project> --agent
feedbackbasket mobile setup <project> --bundle-id com.example.app --agent
feedbackbasket mobile setup <project> --bundle-id com.example.app --include-publishable-key --agent
feedbackbasket mobile bundle-ids <project> --add com.example.app.beta --agent
feedbackbasket mobile bundle-ids <project> --remove com.example.app.beta --agent
feedbackbasket mobile verify <project> --bundle-id com.example.app --wait 120 --agent
feedbackbasket mobile disable <project> --yes --agent
feedbackbasket mobile rotate-key <project> --yes --include-publishable-key --agent
```

The `fb_mobile_` value is a publishable, write-only project identifier designed to ship in the app. It cannot read feedback or administer the project, but the CLI masks it by default to reduce accidental disclosure. Use `--include-publishable-key` only while performing a setup the user authorized, and never repeat the full key in the final response.

Never place an `fb_cli_` CLI token or `fb_key_` MCP/API key in app source, build settings, prompts, logs, generated configuration, or final responses. Those are private credentials and are not interchangeable with the mobile project key.

For SwiftUI apps targeting iOS 16 or later, use the Swift package returned by `mobile setup`. For UIKit, use the package API or host its SwiftUI sheet. For React Native, Flutter, or unsupported stacks, open the returned hosted form in the app's existing in-app browser when available.

Configure the Swift package once at app startup with the publishable key returned by `mobile setup`:

```swift
import FeedbackBasket

FeedbackBasket.configure(
    projectKey: "fb_mobile_returned_by_mobile_setup"
)
```

Present the standard SwiftUI sheet from the selected Settings, Help, or Support view:

```swift
@State private var showingFeedback = false

Button("Send feedback") {
    showingFeedback = true
}
.feedbackBasketSheet(
    isPresented: $showingFeedback,
    context: ["screen": "Settings"]
)
```

Add an accessible Send feedback action to an existing Settings, Help, or Support screen and attach only non-sensitive context. Do not add crash reporting, automatic logs, analytics, or session recording. Treat the key as production unless the user confirms staging details; build and launch the app, then use `mobile verify` without submitting production test feedback.

Setup is idempotent and bundle ID additions preserve existing entries. Do not disable mobile feedback or rotate its key unless the user explicitly requests and confirms the disruptive action. Rotation stops every released build using the previous key.

### Feedback
```bash
# Read
feedbackbasket feedback list --project <id> --category BUG --status OPEN --sentiment NEGATIVE
feedbackbasket feedback list --search "login" --limit 50 --offset 0 --notes
feedbackbasket feedback show <id>
feedbackbasket feedback search "crash on mobile" --project <id> --limit 10

# Write
feedbackbasket feedback update <id> --status PLANNED --category BUG --sentiment NEGATIVE
feedbackbasket feedback note <id> "Investigating — appears related to auth flow"
feedbackbasket feedback delete <id> --yes
feedbackbasket feedback bulk-update --status CLOSED --ids id1,id2,id3

# Reply to submitter via email
feedbackbasket feedback reply <id> "Thanks for reporting — we pushed a fix!"
feedbackbasket feedback reply <id> "<content>" --reply-to vlad@example.com  # override reply-to
feedbackbasket feedback replies <id>                                          # list past replies

# Export
feedbackbasket feedback export <project> --format csv
feedbackbasket feedback export <project> --format md
feedbackbasket feedback export <project> --format json
```

### Bug Reports
```bash
feedbackbasket bugs list --severity high --status OPEN --project <id>
feedbackbasket bugs stats --project <id>
```

### Widget
```bash
# Get embed code (ready to paste into HTML)
feedbackbasket widget script <project>

# View settings
feedbackbasket widget settings <project>

# Customize
feedbackbasket widget settings <project> --color "#22c55e" --label "Send Feedback"
feedbackbasket widget settings <project> --position bottom-left --display modal
feedbackbasket widget settings <project> --email-required --intro "How can we improve?"
```

### Team
```bash
feedbackbasket team list
feedbackbasket team role <memberId> --role admin
feedbackbasket team remove <memberId> --yes
```

### Utilities
```bash
feedbackbasket doctor                  # Health check (auth, connectivity, skill)
feedbackbasket setup claude            # Install this skill for Claude Code
```

## Common Agent Workflows

### Set up a new project end-to-end
```bash
feedbackbasket projects create "My App" --url https://myapp.com --agent
feedbackbasket widget script "My App" --agent
# Agent gets the embed code, adds it to the HTML
feedbackbasket widget settings "My App" --color "#22c55e" --label "Feedback" --agent
```

### Triage new feedback
```bash
feedbackbasket feedback list --status OPEN --agent
# Review items, then update:
feedbackbasket feedback update <id> --status UNDER_REVIEW --agent
feedbackbasket feedback note <id> "Reviewing — appears related to auth flow" --agent
```

### Investigate high-priority bugs
```bash
feedbackbasket bugs list --severity high --agent
feedbackbasket feedback show <id> --agent
# Response includes browser, OS, page URL, AI analysis, priority score
```

### Close the loop — reply to the submitter
```bash
# Agent reads context, drafts its own reply, sends it
feedbackbasket feedback show <id> --agent                    # read context + project.replyToEmail
feedbackbasket feedback reply <id> "<drafted response>" --agent
feedbackbasket feedback update <id> --status COMPLETE --agent
feedbackbasket feedback note <id> "Replied via CLI" --agent
```
**Important:** If `feedback show` returns `project.replyToEmail: null`, the agent MUST either:
1. Pass `--reply-to <email>` with an explicit address, OR
2. Ask the human which reply-to email to use (the account owner's email is a reasonable default, but requires user confirmation), OR
3. Set a project default first: `feedbackbasket projects update <project> --reply-to <email>`

Never silently guess a reply-to address — it becomes the "From" address the customer sees.

### Export for analysis
```bash
feedbackbasket feedback export myapp --format json --agent
# Agent can parse the JSON and generate reports
```

### Search for patterns
```bash
feedbackbasket feedback search "login" --agent
feedbackbasket feedback search "crash" --category BUG --agent
```

## Filtering Options

| Type | Values |
|------|--------|
| Categories | `BUG`, `FEATURE_REQUEST`, `IMPROVEMENT`, `QUESTION` |
| Statuses | `OPEN`, `UNDER_REVIEW`, `PLANNED`, `IN_PROGRESS`, `COMPLETE`, `CLOSED` |
| Sentiments | `POSITIVE`, `NEGATIVE`, `NEUTRAL` |
| Bug Severity | `high`, `medium`, `low` |

## JSON Envelope

When using `--json`, responses include breadcrumbs:
```json
{
  "ok": true,
  "data": [...],
  "summary": "5 projects",
  "breadcrumbs": [
    { "action": "View feedback", "cmd": "feedbackbasket feedback list --project myapp" }
  ]
}
```

Errors include hints:
```json
{
  "ok": false,
  "error": "Not authenticated",
  "code": "auth_error",
  "hint": "Run: feedbackbasket auth login"
}
```

## Invariants

- Always authenticate before data commands
- `--agent` flag suppresses all interactive prompts and confirmations
- Default project (set during login) is used when `--project` is not specified
- Project names resolve case-insensitively with fuzzy matching
- Write operations use full scope (granted by default during login)
- Feedback IDs are stable CUIDs — safe to reference across commands
- All timestamps are ISO 8601
- `--yes` flag skips delete confirmations in interactive mode
