# Agile Consulting Scorecard — API reference

Quick reference for the nine HTTP endpoints exposed by the Rust axum
server at `back-end-with-loco/`. The SvelteKit
front-ends (`front-end-form-with-svelte`, `front-end-dashboard-with-svelte`)
mount a subset of these at the same paths via `+server.ts` so they
work standalone against the bundled sample data when no backend is
running.

Start the Rust server with:

```sh
cd back-end-with-loco
cargo run --bin agile-consulting-scorecard-server
# listens on http://127.0.0.1:5150 (override with $PORT)
```

All payloads use camelCase JSON. Errors return
`{ "error": "..." }` with the relevant 4xx status.

## Endpoint summary

| Method | Path | Purpose | Same-origin in… |
| --- | --- | --- | --- |
| GET  | `/` | Help banner listing the endpoints | — |
| GET  | `/api/dashboard/scorecards` | List submitted scorecards | dashboard |
| GET  | `/api/scorecards/{id}` | Look up one scorecard | dashboard |
| GET  | `/api/stats` | Aggregate counts and averages | dashboard |
| POST | `/api/scorecards` | Submit a new scorecard | — |
| POST | `/api/grade` | Score an assessment | — |
| POST | `/api/recommendations` | Recommended next actions for false items | — |
| POST | `/api/pre-tender` | Redacted vendor-facing summary | — |
| POST | `/api/diff` | Compare two assessments | — |
| POST | `/api/bulk-import` | Bulk-load assessments from JSON Lines | — |

## GET /api/dashboard/scorecards

Returns the seed scorecards plus anything submitted since the server started.

```sh
curl http://127.0.0.1:5150/api/dashboard/scorecards
```

Response (truncated):

```json
{
  "items": [
    {
      "id": "s-001",
      "organizationName": "NHS Acute Trust",
      "sector": "healthcare",
      "sizeBand": "enterprise",
      "respondentName": "Asha Patel",
      "assessmentDate": "2026-04-12",
      "scoreTotal": 14,
      "manifestoSubtotal": 4,
      "principlesSubtotal": 10,
      "computedBand": "high",
      "flags": []
    }
  ],
  "total": 12
}
```

## GET /api/scorecards/{id}

Look up one scorecard. Returns the same `ScorecardRow` shape as the
list endpoint, or `404 { "error": "..." }` when no row matches.

```sh
curl http://127.0.0.1:5150/api/scorecards/s-003
```

## GET /api/stats

Aggregate counts across seed + submitted scorecards.

```sh
curl http://127.0.0.1:5150/api/stats
```

Response (12 seed rows):

```json
{
  "total": 12,
  "byBand": { "low": 3, "borderline": 1, "medium": 5, "high": 3 },
  "bySector": { "charity": 1, "education": 1, "energy": 1, "finance": 1, "healthcare": 1, "insurance": 1, "logistics": 1, "medtech": 1, "pharmaceuticals": 1, "public-sector": 1, "retail": 1, "telecommunications": 1 },
  "bySize": { "enterprise": 5, "large": 3, "medium": 2, "small": 2 },
  "flagCount": 11,
  "flagCountByCategory": { "no-customer-contact": 3, "no-reflection-culture": 2, "no-self-organization": 3, "no-senior-leadership-buyin": 2, "no-sustainable-budget": 1, "no-working-software": 1 },
  "averageScore": 7.583333333333333
}
```

## POST /api/scorecards

Submit a new scorecard. The server runs the scoring engine, stores
the result in the in-memory `ScorecardStore` with a generated
`s-1000+` id, and returns the row.

```sh
curl -X POST http://127.0.0.1:5150/api/scorecards \
     -H 'Content-Type: application/json' \
     --data @samples/sample-assessment.json
```

Response:

```json
{
  "id": "s-1000",
  "organizationName": "Pharos Pharma",
  "computedBand": "medium",
  "scoreTotal": 9,
  "...": "..."
}
```

Errors: 400 on invalid JSON, 422 on schema failure (e.g. unknown enum
value, missing field, wrong-type `done`).

## POST /api/grade

Stateless: take an assessment, return the `GradeResult` without
storing it.

```sh
curl -X POST http://127.0.0.1:5150/api/grade \
     -H 'Content-Type: application/json' \
     --data @samples/sample-assessment.json
```

Response (truncated):

```json
{
  "scoreTotal": 9,
  "manifestoSubtotal": 3,
  "principlesSubtotal": 6,
  "computedBand": "medium",
  "recommendation": "DoHomeworkFirst",
  "firedRules": [ … 17 entries: 4 manifesto + 12 principles + 1 composite … ],
  "additionalFlags": [
    { "flagId": "F-NO-CUSTOMER-CONTACT-001", "category": "no-customer-contact", "priority": "high", "...": "..." },
    { "flagId": "F-NO-SELF-ORGANIZATION-001", "category": "no-self-organization", "priority": "medium", "...": "..." }
  ]
}
```

## POST /api/recommendations

For each item marked `false`, return the seed-defined intervention.

```sh
curl -X POST http://127.0.0.1:5150/api/recommendations \
     -H 'Content-Type: application/json' \
     --data @samples/sample-assessment.json
```

Response:

```json
{
  "items": [
    { "itemKey": "m3", "heading": "Manifesto 3 — Customer collaboration", "intervention": "Have the organization (not a teammate personally) buy copies of the customer's favourite relevant book…", "rationale": "Exercises the org's ability to spend small amounts of money to enable progress…" },
    { "itemKey": "p1", "heading": "Principle 1 — Customer satisfaction", "intervention": "Stand up a basic Net Promoter Score measurement for every product line, owned by the product lead.", "rationale": "NPS is quick, widespread, and 'good enough'…" }
  ],
  "total": 7
}
```

## POST /api/pre-tender

Build the redacted vendor-facing summary suitable to share with
prospective consultants.

```sh
curl -X POST http://127.0.0.1:5150/api/pre-tender \
     -H 'Content-Type: application/json' \
     --data @samples/sample-assessment.json
```

Response:

```json
{
  "$schemaVersion": 1,
  "organization": { "organizationName": "Pharos Pharma", "sector": "pharmaceuticals", "sizeBand": "enterprise" },
  "assessment": { "assessmentDate": "2026-04-18" },
  "score": { "total": 9, "manifestoSubtotal": 3, "principlesSubtotal": 6, "band": "medium", "recommendation": "do-homework-first" },
  "flags": [
    { "category": "no-customer-contact", "priority": "high" },
    { "category": "no-self-organization", "priority": "medium" }
  ]
}
```

Note the deliberate redactions: no respondent name / email, no
per-item answers or evidence, no organization legal name / website /
headcount, no flag prose or suggested actions.

## POST /api/diff

Compare two complete assessments.

```sh
curl -X POST http://127.0.0.1:5150/api/diff \
     -H 'Content-Type: application/json' \
     --data '{"before": <assessment>, "after": <assessment>}'
```

Response includes `scoreDelta`, `manifestoDelta`, `principlesDelta`,
`bandBefore`, `bandAfter`, `bandChanged`, plus full `items`,
`improved`, `regressed`, `newFlags`, and `clearedFlags` lists.

## POST /api/bulk-import

Submit a JSON-Lines document (one assessment per line). Every
accepted row is persisted into the in-memory store. Blank and
`#`-prefixed lines are skipped silently.

```sh
curl -X POST http://127.0.0.1:5150/api/bulk-import \
     -H 'Content-Type: application/x-ndjson' \
     --data-binary @scorecards.jsonl
```

Response:

```json
{
  "accepted": 3,
  "rejected": [ { "lineNumber": 5, "rawLine": "not-json", "error": "JSON parse error: …" } ],
  "totalLines": 6,
  "skippedBlank": 1,
  "skippedComment": 1
}
```

## Wire compatibility

All endpoints return camelCase JSON. The `ScorecardRow` shape is
identical to the SvelteKit dashboard's `ScorecardRow` type
(`front-end-dashboard-with-svelte/src/lib/types.ts`). The
`AgileConsultingScorecardAssessment` and `GradeResult` shapes are
identical between the TypeScript engine
(`front-end-form-with-svelte/src/lib/engine/types.ts`) and the Rust
engine (`back-end-with-loco/src/scoring/types.rs`).
The two engines are parity-tested against
`samples/sample-assessment.json` / `samples/sample-grade.json` so any
divergence breaks CI.
