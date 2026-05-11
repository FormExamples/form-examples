//! Inbound webhook parsers.
//!
//! Each parser turns an external alerting service's webhook payload
//! into a draft `IssueTrackerAssessment` ready to insert with status
//! `draft`. The triager then reviews / completes the SOAP sections and
//! signs off.

pub mod cloudwatch;
pub mod datadog;
pub mod pagerduty;
pub mod sentry;

use crate::scoring::types::IssueTrackerAssessment;

/// Result of parsing an inbound webhook into a draft assessment, plus
/// the suggested chief-complaint summary that the triager will see in
/// the dashboard before they open the form.
#[derive(Debug, Clone)]
pub struct WebhookDraft {
    pub assessment: IssueTrackerAssessment,
    pub cc_summary: String,
    pub external_reference: String,
}
