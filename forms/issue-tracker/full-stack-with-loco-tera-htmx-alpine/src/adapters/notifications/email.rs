//! Email renderer — subject + plain-text body + minimal HTML body.
//!
//! No SMTP transport — the caller hands the rendered `EmailMessage` to
//! its own mail relay (lettre, AWS SES, SendGrid, etc.).

use super::should_notify;
use crate::scoring::types::{GradeResult, IssueTrackerAssessment};
use std::fmt::Write;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EmailMessage {
    pub subject: String,
    pub body_text: String,
    pub body_html: String,
}

pub fn render(
    issue_id: &str,
    cc_summary: &str,
    dashboard_url: &str,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> Option<EmailMessage> {
    if !should_notify(result.composite_priority) {
        return None;
    }

    let composite = result.composite_priority.as_str().to_uppercase();
    let subject = format!("[{composite}] [{issue_id}] {cc_summary}");

    let body_text = render_text(issue_id, cc_summary, dashboard_url, data, result);
    let body_html = render_html(issue_id, cc_summary, dashboard_url, data, result);

    Some(EmailMessage {
        subject,
        body_text,
        body_html,
    })
}

fn render_text(
    issue_id: &str,
    cc_summary: &str,
    dashboard_url: &str,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> String {
    let composite = result.composite_priority.as_str().to_uppercase();
    let mut out = String::new();
    let _ = writeln!(out, "Issue {issue_id} — composite priority {composite}");
    let _ = writeln!(out);
    let _ = writeln!(out, "Chief complaint: {cc_summary}");
    let _ = writeln!(out);
    let _ = writeln!(out, "System:      {}", non_empty(&data.reporter.system_name));
    let _ = writeln!(out, "Environment: {}", non_empty(&data.reporter.environment));
    let _ = writeln!(out, "Category:    {}", non_empty(&data.reporter.issue_category));
    let _ = writeln!(out);
    let _ = writeln!(out, "Scores:");
    let _ = writeln!(out, "  Severity of impact:    {}", scalar(result.score_by_severity_of_impact));
    let _ = writeln!(out, "  Magnitude of damage:   {}", scalar(result.score_by_magnitude_of_damage));
    let _ = writeln!(out, "  Harm grade (LFPSE):    {}", scalar(result.score_by_harm_grade));
    let _ = writeln!(out, "  Failure condition:     {}", non_empty(result.score_by_failure_condition.as_str()));
    let _ = writeln!(out, "  MoSCoW:                {}", scalar(result.score_by_moscow_requirement));
    let _ = writeln!(out, "  Frequency %:           {}", scalar(result.score_by_frequency_percent));
    let _ = writeln!(out, "  Priority rank:         {}", scalar(result.score_by_priority_rank));

    if !result.additional_flags.is_empty() {
        let _ = writeln!(out);
        let _ = writeln!(out, "Safety flags ({}):", result.additional_flags.len());
        for f in &result.additional_flags {
            let cat = serde_json::to_value(f.category)
                .ok()
                .and_then(|v| v.as_str().map(str::to_owned))
                .unwrap_or_else(|| "other".into());
            let _ = writeln!(out, "  - [{cat}] {}", f.description);
            let _ = writeln!(out, "      action: {}", f.suggested_action);
        }
    }

    let _ = writeln!(out);
    let _ = writeln!(out, "Open in dashboard: {dashboard_url}");
    out
}

fn render_html(
    issue_id: &str,
    cc_summary: &str,
    dashboard_url: &str,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> String {
    let composite = result.composite_priority.as_str();
    let composite_upper = composite.to_uppercase();
    let bg = match composite {
        "critical" => "#dc2626",
        "high" => "#ea580c",
        "moderate" => "#ca8a04",
        _ => "#16a34a",
    };
    let mut s = String::new();
    let _ = write!(
        s,
        r#"<div style="font-family:system-ui,sans-serif">
<h2><span style="display:inline-block;padding:2px 10px;border-radius:999px;background:{bg};color:white;font-size:12px;">{composite_upper}</span> {issue_id}</h2>
<p><strong>{cc_summary}</strong></p>
<table cellspacing="0" cellpadding="4" style="border-collapse:collapse;">
<tr><td>System</td><td>{}</td></tr>
<tr><td>Environment</td><td>{}</td></tr>
<tr><td>Category</td><td>{}</td></tr>
<tr><td>Severity</td><td>{}</td></tr>
<tr><td>Magnitude</td><td>{}</td></tr>
<tr><td>Harm grade</td><td>{}</td></tr>
<tr><td>Failure</td><td>{}</td></tr>
<tr><td>Frequency %</td><td>{}</td></tr>
</table>"#,
        h(&non_empty(&data.reporter.system_name)),
        h(&non_empty(&data.reporter.environment)),
        h(&non_empty(&data.reporter.issue_category)),
        scalar(result.score_by_severity_of_impact),
        scalar(result.score_by_magnitude_of_damage),
        scalar(result.score_by_harm_grade),
        h(&non_empty(result.score_by_failure_condition.as_str())),
        scalar(result.score_by_frequency_percent),
    );

    if !result.additional_flags.is_empty() {
        let _ = write!(
            s,
            r#"<h3>Safety flags ({})</h3><ul>"#,
            result.additional_flags.len()
        );
        for f in &result.additional_flags {
            let cat = serde_json::to_value(f.category)
                .ok()
                .and_then(|v| v.as_str().map(str::to_owned))
                .unwrap_or_else(|| "other".into());
            let _ = write!(
                s,
                "<li><strong>[{cat}]</strong> {}<br><em>{}</em></li>",
                h(&f.description),
                h(&f.suggested_action),
                cat = h(&cat),
            );
        }
        let _ = write!(s, "</ul>");
    }

    let _ = write!(
        s,
        r#"<p><a href="{dashboard_url}" style="color:#2563eb;">Open in dashboard</a></p></div>"#,
        dashboard_url = h(dashboard_url),
    );
    s
}

fn h(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

fn non_empty(s: &str) -> String {
    if s.is_empty() {
        "—".into()
    } else {
        s.into()
    }
}

fn scalar<T: std::fmt::Display>(v: Option<T>) -> String {
    v.map(|x| x.to_string()).unwrap_or_else(|| "—".into())
}
