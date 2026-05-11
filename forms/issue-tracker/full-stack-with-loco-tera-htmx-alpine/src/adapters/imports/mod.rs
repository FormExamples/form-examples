//! Bulk-import parsers for existing ticket trackers.
//!
//! Companion to `webhooks` — webhooks ingest *new* alerts; imports
//! ingest *existing* tickets in bulk (CSV / JSON). Each parser emits
//! an `ImportDraft` per source row.

pub mod github;
pub mod jira;

use crate::scoring::types::IssueTrackerAssessment;

/// Result of parsing one external ticket into a draft assessment, plus
/// metadata used by the bulk-import dashboard preview before insert.
#[derive(Debug, Clone)]
pub struct ImportDraft {
    pub assessment: IssueTrackerAssessment,
    pub cc_summary: String,
    pub external_reference: String,
    pub source: &'static str,
}
