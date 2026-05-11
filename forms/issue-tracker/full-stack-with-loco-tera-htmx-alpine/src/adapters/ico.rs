//! UK Information Commissioner's Office (ICO) personal-data-breach
//! export adapter.
//!
//! Generates a JSON document aligned with UK GDPR Article 33's mandatory
//! breach-notification fields, suitable for staging a submission to the
//! ICO self-service portal at <https://ico.org.uk/for-organisations/report-a-breach/>.
//!
//! Eligibility: `issue_category` is `data-protection`, OR the issue is a
//! security event with harm `>= 1`. ICO submission must occur within
//! 72 hours of awareness.
//!
//! The Issue Tracker schema does not capture every Article 33 field
//! (data-subject categories, approximate counts, etc.). Those fields
//! are accepted as explicit `IcoBreachExtras` parameters so the caller
//! can populate them from out-of-band sources (CRM, GA, audit logs)
//! without expanding the core schema.

use crate::scoring::types::{
    AdditionalFlag, FlagPriority, GradeResult, IssueTrackerAssessment,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

const ICO_SCHEMA_VERSION: &str = "ico-personal-data-breach-v1";

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct IcoBreachExtras {
    pub data_subject_categories: Vec<String>,
    pub data_subjects_approximate_count: Option<u32>,
    pub personal_data_categories: Vec<String>,
    pub personal_data_records_approximate_count: Option<u32>,
    pub likely_consequences: String,
    pub mitigation_measures: String,
    pub controller_name: String,
    pub controller_contact: String,
    pub data_protection_officer_name: String,
    pub data_protection_officer_contact: String,
    pub cross_border: bool,
}

pub fn is_eligible(data: &IssueTrackerAssessment) -> bool {
    let cat = data.reporter.issue_category.as_str();
    if cat == "data-protection" {
        return true;
    }
    if cat == "security" && matches!(data.scores.score_by_harm_grade, Some(h) if h >= 1) {
        return true;
    }
    false
}

pub fn to_ico_breach_report(
    issue_id: &str,
    cc_summary: &str,
    breach_long_description: &str,
    extras: &IcoBreachExtras,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> Option<Value> {
    if !is_eligible(data) {
        return None;
    }

    let high_priority_flags: Vec<&AdditionalFlag> = result
        .additional_flags
        .iter()
        .filter(|f| matches!(f.priority, FlagPriority::High | FlagPriority::Medium))
        .collect();

    Some(json!({
        "schema": ICO_SCHEMA_VERSION,
        "incidentId": issue_id,
        "discoveredAt": data.reporter.discovered_at,
        "reportedAt": data.reporter.reported_at,
        "submittedAt": data.reporter.reported_at,
        "controller": {
            "name": extras.controller_name,
            "contact": extras.controller_contact,
        },
        "dataProtectionOfficer": {
            "name": extras.data_protection_officer_name,
            "contact": extras.data_protection_officer_contact,
        },
        "breach": {
            "summary": cc_summary,
            "description": breach_long_description,
            "category": data.reporter.issue_category,
            "system": data.reporter.system_name,
            "component": data.reporter.component,
            "environment": data.reporter.environment,
            "crossBorder": extras.cross_border,
            "dataSubjectCategories": extras.data_subject_categories,
            "dataSubjectsApproximateCount": extras.data_subjects_approximate_count,
            "personalDataCategories": extras.personal_data_categories,
            "personalDataRecordsApproximateCount": extras.personal_data_records_approximate_count,
            "likelyConsequences": extras.likely_consequences,
            "mitigationMeasures": extras.mitigation_measures,
        },
        "assessment": {
            "compositePriority": result.composite_priority.as_str(),
            "harmGrade": result.score_by_harm_grade,
            "severityOfImpact": result.score_by_severity_of_impact,
            "magnitudeOfDamage": result.score_by_magnitude_of_damage,
            "frequencyPercent": result.score_by_frequency_percent,
            "regulatoryFlags": high_priority_flags
                .iter()
                .map(|f| {
                    let category = serde_json::to_value(f.category)
                        .ok()
                        .and_then(|v| v.as_str().map(str::to_owned))
                        .unwrap_or_else(|| "other".into());
                    json!({
                        "id": f.flag_id,
                        "category": category,
                        "description": f.description,
                        "priority": severity_label(f.priority),
                        "suggestedAction": f.suggested_action,
                    })
                })
                .collect::<Vec<_>>(),
        },
    }))
}

fn severity_label(p: FlagPriority) -> &'static str {
    match p {
        FlagPriority::High => "high",
        FlagPriority::Medium => "medium",
        FlagPriority::Low => "low",
    }
}
