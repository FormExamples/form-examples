# Methodology reference — issue tracker

Issue trackers are the system of record for defects, change requests,
support tickets, and incidents in software projects. The field has
strong de-facto conventions from Atlassian, GitHub, GitLab, and the
ITIL service-management framework.

## Industry conventions

### Atlassian Jira

Jira's issue model — Project / Issue Type / Status / Priority /
Assignee / Reporter / Resolution — is the most-cited convention. Issue
types commonly distinguish Story, Task, Bug, Epic, and Sub-task.

- Jira documentation hub:
  <https://support.atlassian.com/jira-software-cloud/>
- Jira issue fields reference:
  <https://support.atlassian.com/jira-cloud-administration/docs/configure-fields-and-screens/>

### GitHub Issues

GitHub uses an open / closed binary state, with Labels, Milestones,
Assignees, and Linked PRs. The model is simpler than Jira and oriented
to repositories rather than projects.

- GitHub Issues docs:
  <https://docs.github.com/en/issues>

### GitLab Issues

GitLab issues add iterations, weights, health status, and confidentiality
flags.

- GitLab Issues docs:
  <https://docs.gitlab.com/ee/user/project/issues/>

## Service-management standards

### ITIL 4 — incident management

ITIL 4 (the Information Technology Infrastructure Library) defines
incident management as the practice of minimising the negative impact
of incidents by restoring normal service as quickly as possible.

ITIL distinguishes:

- **Incident** — unplanned interruption or reduction in service quality.
- **Problem** — root cause of one or more incidents.
- **Service request** — formal request for something new (access,
  information).
- **Change** — addition, modification, or removal of anything that
  could have an effect.

The implementation models all four as variants of a base "issue" record
with a categorical Type field.

- AXELOS / PeopleCert ITIL 4 home:
  <https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1>

### ISO/IEC 20000-1:2018 — IT service management

ISO/IEC 20000-1:2018 specifies requirements for a service management
system. Clauses 8.6 (incident management) and 8.7 (service request
management) underpin the issue-tracker workflow used here.

- ISO/IEC 20000-1:2018:
  <https://www.iso.org/standard/70636.html>

## Severity / priority taxonomies

Severity (impact) and priority (urgency) are conventionally orthogonal:

| Severity | Definition |
| --- | --- |
| Critical | system down; data loss; no workaround |
| High | major function broken; workaround painful |
| Medium | function broken with reasonable workaround |
| Low | cosmetic or minor inconvenience |

| Priority | Definition |
| --- | --- |
| P1 | act now; pager / on-call |
| P2 | act today |
| P3 | act this sprint |
| P4 | backlog |

Severity describes the world; priority describes the response. The
implementation persists both as separate enumerations.

## Workflow

Issues progress through a deterministic state machine:

```
new → triaged → in-progress → in-review → done
        ↓             ↓            ↓
     wont-fix     blocked       blocked
```

The implementation persists every transition with timestamp, actor, and
optional comment, supporting the SLA reporting required by ITIL 4 and
ISO/IEC 20000-1.

## SLA and SLO

Service-level agreements (SLA) and service-level objectives (SLO)
attach time targets to states. Example: P1 incidents must be
acknowledged within 15 minutes and resolved within 4 hours. The
implementation captures SLA / SLO clocks per priority level.

## References

- ITIL 4 Foundation: AXELOS, 2019.
- ISO/IEC 20000-1:2018.
  <https://www.iso.org/standard/70636.html>
- Atlassian Jira documentation.
  <https://support.atlassian.com/jira-software-cloud/>
- GitHub Issues documentation.
  <https://docs.github.com/en/issues>
- GitLab Issues documentation.
  <https://docs.gitlab.com/ee/user/project/issues/>
- Google SRE Workbook — Incident Response.
  <https://sre.google/workbook/incident-response/>
