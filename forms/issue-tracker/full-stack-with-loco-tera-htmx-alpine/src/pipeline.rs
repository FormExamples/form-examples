//! Integration pipeline.
//!
//! Given a graded issue (an `IssueTrackerAssessment` and its
//! `GradeResult`), invokes every eligible outbound adapter and returns
//! the results in a single struct. None of the adapters do transport —
//! the caller posts the rendered payloads to the right webhook URL,
//! SMTP relay, or regulator portal.
//!
//! Eligibility is delegated to each adapter's `is_eligible` /
//! `should_notify` predicate; non-eligible outputs are `None`.

use crate::adapters::ico::{self, IcoBreachExtras};
use crate::adapters::lfpse;
use crate::adapters::notifications::{email, slack, teams};
use crate::adapters::riddor::{self, RiddorReportExtras};
use crate::scoring::types::{GradeResult, IssueTrackerAssessment};
use serde_json::Value;

/// Out-of-band fields the regulatory exports need that the core schema
/// does not carry. Pass once per pipeline invocation.
#[derive(Debug, Clone, Default)]
pub struct PipelineExtras {
    pub ico: IcoBreachExtras,
    pub riddor: RiddorReportExtras,
    pub ico_breach_long_description: String,
}

#[derive(Debug, Clone, Default)]
pub struct IntegrationOutputs {
    pub lfpse_bundle: Option<Value>,
    pub ico_breach_report: Option<Value>,
    pub riddor_report: Option<Value>,
    pub slack_payload: Option<Value>,
    pub teams_payload: Option<Value>,
    pub email_message: Option<email::EmailMessage>,
}

impl IntegrationOutputs {
    /// Number of outputs that fired (i.e. were eligible).
    pub fn count(&self) -> usize {
        [
            self.lfpse_bundle.is_some(),
            self.ico_breach_report.is_some(),
            self.riddor_report.is_some(),
            self.slack_payload.is_some(),
            self.teams_payload.is_some(),
            self.email_message.is_some(),
        ]
        .iter()
        .filter(|x| **x)
        .count()
    }
}

pub fn run_integrations(
    issue_id: &str,
    cc_summary: &str,
    dashboard_url: &str,
    extras: &PipelineExtras,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> IntegrationOutputs {
    IntegrationOutputs {
        lfpse_bundle: lfpse::to_lfpse_bundle(issue_id, cc_summary, data, result),
        ico_breach_report: ico::to_ico_breach_report(
            issue_id,
            cc_summary,
            &extras.ico_breach_long_description,
            &extras.ico,
            data,
            result,
        ),
        riddor_report: riddor::to_riddor_report(issue_id, cc_summary, &extras.riddor, data, result),
        slack_payload: slack::render(issue_id, cc_summary, dashboard_url, data, result),
        teams_payload: teams::render(issue_id, cc_summary, dashboard_url, data, result),
        email_message: email::render(issue_id, cc_summary, dashboard_url, data, result),
    }
}
