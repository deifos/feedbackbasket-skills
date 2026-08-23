# Agent Skills for FeedbackBasket

Agent skills for feedback management — projects, bugs, feature requests,
website and mobile conversations, widgets, and team.

```bash
npx skills add deifos/feedbackbasket-skills
```

See [install.md](install.md) for full setup instructions including CLI authentication.

## Evaluation validation

Run the dependency-free structural validator against `evals/evals.json`:

```bash
npm test
```

This command validates the dataset structure and required coverage labels. It does not perform model-scored semantic evaluation.

## Available Skills

| Skill              | Description                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **feedbackbasket** | Full FeedbackBasket CLI integration — projects, threaded replies, mobile setup, widgets, export, team, and more |

## Requirements

1. **FeedbackBasket CLI** — install from [feedbackbasket-cli](https://github.com/deifos/feedbackbasket-cli):

   ```bash
   npm install -g feedbackbasket-cli
   ```

2. **Authenticated account** — run `feedbackbasket login` to authenticate via browser

## About

Skills are published from [deifos/feedbackbasket-cli](https://github.com/deifos/feedbackbasket-cli). To report issues or contribute, open an issue or PR there.
