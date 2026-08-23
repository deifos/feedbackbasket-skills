import { readFile } from "node:fs/promises";

const evalPath = new URL("../evals/evals.json", import.meta.url);
const requiredCoverage = [
  "oauth",
  "read-full",
  "organization",
  "selected-projects",
  "all-projects",
  "restricted-project",
  "credential-safety",
];

function fail(id, field, message) {
  throw new Error(`Evaluation ${id}: ${field} ${message}`);
}

let dataset;

try {
  dataset = JSON.parse(await readFile(evalPath, "utf8"));
} catch (error) {
  fail("dataset", "evals/evals.json", `must be valid JSON (${error.message})`);
}

if (dataset.skill_name !== "feedbackbasket") {
  fail("dataset", "skill_name", 'must equal "feedbackbasket"');
}

if (!Array.isArray(dataset.evals) || dataset.evals.length === 0) {
  fail("dataset", "evals", "must be a non-empty array");
}

const ids = new Set();
const coverage = new Map(requiredCoverage.map((name) => [name, []]));

for (const evaluation of dataset.evals) {
  const id = evaluation?.id ?? "unknown";

  if (!Number.isInteger(id) || id <= 0) {
    fail(id, "id", "must be a positive integer");
  }
  if (ids.has(id)) {
    fail(id, "id", "must be unique");
  }
  ids.add(id);

  if (
    typeof evaluation.prompt !== "string" ||
    evaluation.prompt.trim() === ""
  ) {
    fail(id, "prompt", "must be a non-empty string");
  }
  if (
    typeof evaluation.expected_output !== "string" ||
    evaluation.expected_output.trim() === ""
  ) {
    fail(id, "expected_output", "must be a non-empty string");
  }
  if (!Array.isArray(evaluation.files)) {
    fail(id, "files", "must be an array");
  }

  if (
    evaluation.coverage !== undefined &&
    !Array.isArray(evaluation.coverage)
  ) {
    fail(id, "coverage", "must be an array when present");
  }

  for (const name of evaluation.coverage ?? []) {
    if (coverage.has(name)) {
      coverage.get(name).push(id);
    }
  }
}

for (const [name, evaluationIds] of coverage) {
  if (evaluationIds.length === 0) {
    fail("dataset", "coverage", `must include the ${name} case`);
  }
}

console.log(
  `Validated ${dataset.evals.length} FeedbackBasket evaluation cases.`,
);
