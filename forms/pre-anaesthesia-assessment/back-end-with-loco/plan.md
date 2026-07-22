# Plan: Pre-Anaesthesia Assessment — Full Stack

## Current status

In progress. The primary Loco crate
`pre_anaesthesia_assessment/` is built (cargo check passes);
the supplementary `todo/` subcrate is partial.

## Implementation plan

1. Bring the primary Loco crate to feature parity with the canonical
   asthma-assessment Rust full-stack: 5 routes (landing / new / show /
   submit / report) plus `/dashboard`, ASA-grading engine, flagged
   issues, SeaORM entities for assessments.
2. Resolve the `todo/` subcrate's role — fold its work into the primary
   crate or split into a second crate with a documented purpose.
3. Add cargo tests covering ASA grading (I–V), NICE NG45 rule firing,
   and safety-critical flag detection.

See [AGENTS.md](AGENTS.md) for layout details.
