# Completeness Rules

Per-section rules that map observable content indicators to the 0–3 completeness
score used by the scoring engine. Rules are applied by the respondent
self-assessment but agents may also use them to evaluate a real arc42 document.

## Score definitions

| Score | Label | General criterion |
| --- | --- | --- |
| 0 | Missing | Section is absent or contains only the arc42 template placeholder text |
| 1 | Stub | Section exists but covers fewer than half the required content items listed below |
| 2 | Partial | Section covers most required items but at least one significant item is absent or superficial |
| 3 | Complete | Section fully addresses all required content items |

## Per-section rules

### Section 1 — Introduction and goals

Required content items:
- Brief description of the system purpose (1–3 sentences)
- At least 3 quality goals, each with a measurable criterion
- Stakeholder table with at least 3 entries (name/role, expectations, concerns)

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Purpose described; fewer than 3 quality goals or no stakeholder table |
| 2 | Purpose + quality goals + stakeholder table present; fewer than 3 stakeholders or goals lack measurable criteria |
| 3 | Purpose, 3+ quality goals with criteria, 3+ stakeholders all present |

### Section 2 — Constraints

Required content items:
- Technical constraints (technology choices mandated externally)
- Organisational constraints (team, budget, timeline, regulatory)
- Conventions (coding standards, tooling, process)

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | At least one category partially listed |
| 2 | All three categories present but at least one is incomplete |
| 3 | All three categories fully populated |

### Section 3 — Context and scope

Required content items:
- Business context diagram or table (external actors and interfaces)
- Technical context diagram or table (channels, protocols, data formats)

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | One of business or technical context present |
| 2 | Both present but one is incomplete (e.g. diagram without protocol details) |
| 3 | Both business and technical context fully described |

### Section 4 — Solution strategy

Required content items:
- Technology decisions (key languages, frameworks, platforms)
- Top-level decomposition approach (e.g. layered, microservices, event-driven)
- How the strategy addresses the top 3 quality goals from section 1

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Technology decisions listed only; no decomposition rationale |
| 2 | Technology + decomposition present; quality-goal link missing or superficial |
| 3 | All three items fully addressed |

### Section 5 — Building block view

Required content items:
- Level-1 whitebox diagram or equivalent table showing top-level building blocks
- Responsibility description for each level-1 block
- At least one level-2 decomposition for a non-trivial block

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Level-1 blocks listed but no responsibilities or diagram |
| 2 | Level-1 complete with responsibilities; level-2 absent |
| 3 | Level-1 complete + at least one level-2 decomposition |

### Section 6 — Runtime view

Required content items:
- At least one primary-use-case scenario (sequence or flow)
- At least one error/exception scenario
- At least one operational or background scenario (e.g. scheduled job, health check)

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | One scenario of any type |
| 2 | Two scenarios; missing one of the three required types |
| 3 | All three scenario types represented |

### Section 7 — Deployment view

Required content items:
- Infrastructure environment description (cloud, on-premise, hybrid)
- Deployment diagram or equivalent table
- Quality/performance characteristics of the deployment (SLAs, scaling approach)

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Infrastructure described in prose only; no diagram or table |
| 2 | Diagram + environment description present; SLA/scaling absent |
| 3 | All three items present |

### Section 8 — Cross-cutting concepts

Required content items:
- Domain/data model (if applicable)
- UX and UI patterns
- At least one safety, security, or operational concept

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | One concept listed |
| 2 | Two of three categories present |
| 3 | All three categories addressed |

### Section 9 — Architectural decisions

Required content items:
- At least 3 ADRs in a consistent format (context, decision, consequences)
- Each ADR has a status (proposed / accepted / superseded / deprecated)
- At least one ADR captures a rejected alternative

| Score | Observed state |
| --- | --- |
| 0 | Section absent, placeholder, or zero ADRs |
| 1 | 1–2 ADRs present; incomplete format |
| 2 | 3+ ADRs in consistent format; no rejected alternative captured |
| 3 | 3+ ADRs, consistent format, status field, at least one rejected alternative |

### Section 10 — Quality requirements

Required content items:
- Quality tree (hierarchy of quality goals)
- At least 3 quality scenarios with stimulus, response, and measurable criterion
- Acceptance criteria linked to section 1 quality goals

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Quality goals listed without scenarios |
| 2 | Scenarios present; fewer than 3 or missing measurable criteria |
| 3 | Quality tree + 3+ scenarios with criteria + links to section 1 |

### Section 11 — Risks and technical debt

Required content items:
- Risk table with at least 3 entries (risk, probability, impact, mitigation)
- Technical-debt register with at least 1 entry
- Priority ordering of risks

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Risks mentioned in prose; no structured table |
| 2 | Risk table present; technical-debt register absent or empty |
| 3 | Risk table (3+ entries, prioritised) + technical-debt register both present |

### Section 12 — Glossary

Required content items:
- At least 5 domain terms defined
- At least 3 technical/architecture terms defined
- Each term has a concise, unambiguous definition

| Score | Observed state |
| --- | --- |
| 0 | Section absent or placeholder only |
| 1 | Fewer than 5 total terms |
| 2 | 5+ terms but either domain or technical terms missing |
| 3 | 5+ domain terms + 3+ technical terms, all with clear definitions |
