# Tutorial 5 — Consume the API

This tutorial boots the **`apgar-score`** Loco crate, drives full CRUD with
`curl`, maps each call to the form's OpenAPI spec, and reads the FHIR R5 bundle
that represents a submitted assessment. It assumes you have the API running from
Tutorial 1 (`01-quickstart.md`, §3) — the same Postgres and
`cargo loco start`.

Run from the repository root unless a `cd` says otherwise.

## 1. Boot the crate

Recap of Tutorial 1 §3 (throwaway Postgres, then migrate and start):

```sh
cd forms/apgar-score/back-end-with-loco
export DATABASE_URL="postgres://loco@localhost/apgar_score_development?host=$SOCK&port=5433"
cargo loco db migrate
cargo loco start
```

Loco serves on `localhost:5150` and mounts controllers under the `api/` prefix.

## 2. The OpenAPI ↔ live-route mapping

The OpenAPI specs are generated per SQL entity into
`forms/apgar-score/openapi/`. Each spec documents the resource path (e.g.
`/patients`); the running crate serves that resource under `api/`. So:

| OpenAPI path (`openapi/patient.yaml`) | Live route | Verb → handler |
| --- | --- | --- |
| `GET /patients` | `GET /api/patients` | list |
| `POST /patients` | `POST /api/patients` | create |
| `GET /patients/{id}` | `GET /api/patients/{id}` | get one |
| `PUT /patients/{id}` | `PUT /api/patients/{id}` | update |
| `DELETE /patients/{id}` | `DELETE /api/patients/{id}` | delete |

Every entity has the same five-verb shape: `apgar_score`,
`apgar_score_timepoint`, `clinician`, etc., each with its own
`openapi/<entity>.yaml` and its own `api/<plural>` route.

Read the spec you are about to exercise:

```sh
sed -n '1,60p' forms/apgar-score/openapi/patient.yaml
```

## 3. CRUD with curl

Run these in a second shell while `cargo loco start` holds the first.

**Create** (POST — the request body matches the controller's `Params`; required
fields are `name`, `birth_date`, `sex`, `united_kingdom_nhs_number`,
`allergies_summary`):

```sh
curl -s -X POST http://localhost:5150/api/patients \
  -H 'content-type: application/json' \
  -d '{
    "name": "Baby Okoro",
    "birth_date": "2026-04-09",
    "sex": "female",
    "united_kingdom_nhs_number": "943 476 5919",
    "allergies_summary": ""
  }'
```

The response echoes the created row including its `id`. Capture it:

```sh
ID=$(curl -s http://localhost:5150/api/patients | python3 -c 'import sys,json; print(json.load(sys.stdin)[0]["id"])')
```

**Read one:**

```sh
curl -s http://localhost:5150/api/patients/"$ID"
```

**List:**

```sh
curl -s http://localhost:5150/api/patients
```

**Update** (PUT — send the full body, same shape as create):

```sh
curl -s -X PUT http://localhost:5150/api/patients/"$ID" \
  -H 'content-type: application/json' \
  -d '{
    "name": "Baby Okoro",
    "birth_date": "2026-04-09",
    "sex": "female",
    "united_kingdom_nhs_number": "943 476 5919",
    "allergies_summary": "no known allergies"
  }'
```

**Delete:**

```sh
curl -s -X DELETE http://localhost:5150/api/patients/"$ID"
```

The same verbs work against `/api/apgar_scores`, `/api/clinicians`, and the
child tables — one route set per SQL entity.

## 4. Export the FHIR R5 bundle

The clinical-interchange representation of a completed assessment is a FHIR R5
document bundle, shipped as a canonical example per form:

```sh
ls forms/apgar-score/examples/fhir-bundle.json
```

Inspect it — it is a `Bundle` of `type: document` whose entries are the FHIR
resources (`Observation`, `Patient`, …) derived from the same SQL entities the
API exposes:

```sh
python3 -c 'import json; b=json.load(open("forms/apgar-score/examples/fhir-bundle.json")); print(b["resourceType"], b["type"], "-", len(b["entry"]), "entries")'
```

The per-entity FHIR JSON under `forms/apgar-score/fhir/r5/` is generated from
SQL by `bin/fhir-r5/generate-fhir-r5-representations.py` (Tutorial 4); the
`examples/fhir-bundle.json` bundle assembles a filled instance you can hand to a
FHIR consumer as the interoperable export of a submitted record.

## Verify you got here

```sh
# The crate, its OpenAPI specs, and the FHIR bundle this tutorial uses exist:
ls forms/apgar-score/back-end-with-loco/Cargo.toml
ls forms/apgar-score/openapi/patient.yaml
ls forms/apgar-score/openapi/apgar_score.yaml
ls forms/apgar-score/examples/fhir-bundle.json
ls forms/apgar-score/fhir/r5
```
