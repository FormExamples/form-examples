# Scoring engine fixtures

Each JSON file is one scoring scenario consumed by both the TypeScript
(`front-end-form-with-svelte`) and Rust (`full-stack-with-loco-tera-htmx-alpine`)
ports. Shape:

```json
{
  "name": "human-readable name",
  "input": { /* ObjectiveAssessment shape */ },
  "expected": {
    "computedCompositeRag": "green" | "amber" | "red",
    "expectedFlags": [{"flagCode": "...", "priority": "high|medium|low"}]
  }
}
```

Adding a fixture: drop a new `NN-name.json` here and both test suites pick
it up automatically (TS via `import.meta.glob`, Rust via `fs::read_dir`).
