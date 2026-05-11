//! External-system adapters.
//!
//! - **Outbound (regulatory):** `lfpse`, `ico`, `riddor` — each turns an
//!   `IssueTrackerAssessment` plus its `GradeResult` into a FHIR R5 or
//!   regulator-specific JSON document suitable for submission. Adapters
//!   return `Option<Value>` so the caller can short-circuit when the
//!   issue is not eligible (e.g. a software-defect is not LFPSE-eligible).
//!
//! - **Inbound (`webhooks`):** `webhooks::sentry`, `webhooks::pagerduty`
//!   — each parses an external alerting service's webhook payload into a
//!   draft `IssueTrackerAssessment` ready to insert with status `draft`.
//!
//! - **Outbound notifications (`notifications`):** `notifications::slack`,
//!   `notifications::teams`, `notifications::email` — each turns a graded
//!   issue into the wire format of a chat / email channel. None of the
//!   adapters do transport — the caller posts to its own webhook URLs or
//!   SMTP relay.
//!
//! - **Bulk imports (`imports`):** `imports::github`, `imports::jira` —
//!   each parses one external ticket (e.g. `GET /repos/.../issues/N` for
//!   GitHub or `GET /rest/api/3/issue/{key}` for Jira) into an
//!   `ImportDraft`. Designed to run in batch from a CSV / JSON loader.

pub mod ico;
pub mod imports;
pub mod lfpse;
pub mod notifications;
pub mod riddor;
pub mod webhooks;
