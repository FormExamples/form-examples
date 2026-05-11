//! NHS *Learn from Patient Safety Events* (LFPSE) FHIR R5 export adapter.
//!
//! Eligibility: `issue_category` must be `clinical-safety` or
//! `medical-device`, and `score_by_harm_grade` must be `Some(>=1)` (i.e.
//! the LFPSE harm grade is at least "low harm"). Issues that don't meet
//! both criteria return `None`.
//!
//! Output shape: a FHIR R5 `Bundle` of type `collection` containing
//! - 1 `ClinicalImpression` summarising the grade.
//! - N `DetectedIssue` entries, one per safety flag.
//!
//! Patient demographics are deliberately absent from this adapter
//! because the `IssueTrackerAssessment` schema does not currently model
//! the harmed patient's NHS number / DoB. Real LFPSE submission will
//! require the caller to merge a `Patient` resource into the bundle
//! before transmission.

use crate::scoring::types::{
    AdditionalFlag, FlagPriority, GradeResult, IssueTrackerAssessment,
};
use serde_json::{json, Value};

const LFPSE_CODE_SYSTEM: &str = "https://www.england.nhs.uk/lfpse/CodeSystem/issue-tracker-flag";
const LFPSE_HARM_SYSTEM: &str = "https://www.england.nhs.uk/lfpse/CodeSystem/harm-grade";
const FHIR_R5: &str = "5.0.0";

pub fn is_eligible(data: &IssueTrackerAssessment) -> bool {
    let cat = data.reporter.issue_category.as_str();
    let clinical = matches!(cat, "clinical-safety" | "medical-device");
    let harm_at_least_low = matches!(data.scores.score_by_harm_grade, Some(h) if h >= 1);
    clinical && harm_at_least_low
}

pub fn to_lfpse_bundle(
    issue_id: &str,
    cc_summary: &str,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> Option<Value> {
    if !is_eligible(data) {
        return None;
    }

    let clinical_impression_id = format!("ci-{issue_id}");
    let mut entries: Vec<Value> = vec![clinical_impression_entry(
        &clinical_impression_id,
        issue_id,
        cc_summary,
        data,
        result,
    )];

    for (i, flag) in result.additional_flags.iter().enumerate() {
        entries.push(detected_issue_entry(
            &format!("di-{issue_id}-{i:02}"),
            issue_id,
            &clinical_impression_id,
            flag,
        ));
    }

    Some(json!({
        "resourceType": "Bundle",
        "id": format!("lfpse-{issue_id}"),
        "meta": {
            "profile": ["https://www.england.nhs.uk/lfpse/StructureDefinition/Bundle"],
            "versionId": FHIR_R5,
        },
        "type": "collection",
        "timestamp": data.reporter.reported_at,
        "entry": entries,
    }))
}

fn clinical_impression_entry(
    id: &str,
    issue_id: &str,
    cc_summary: &str,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> Value {
    let harm_grade = data.scores.score_by_harm_grade.unwrap_or(0);
    let harm_label = match harm_grade {
        0 => "no-harm",
        1 => "low-harm",
        2 => "moderate-harm",
        3 => "severe-harm",
        _ => "fatal",
    };
    json!({
        "fullUrl": format!("urn:uuid:{id}"),
        "resource": {
            "resourceType": "ClinicalImpression",
            "id": id,
            "meta": {
                "profile": ["http://hl7.org/fhir/StructureDefinition/ClinicalImpression"],
            },
            "status": "completed",
            "identifier": [{
                "system": "urn:form-examples:issue-tracker",
                "value": issue_id,
            }],
            "summary": cc_summary,
            "code": {
                "coding": [{
                    "system": LFPSE_HARM_SYSTEM,
                    "code": harm_label,
                    "display": format!("LFPSE harm grade {harm_grade}"),
                }],
            },
            "finding": [{
                "itemCodeableConcept": {
                    "coding": [{
                        "system": LFPSE_CODE_SYSTEM,
                        "code": format!("composite-{}", result.composite_priority.as_str()),
                        "display": format!("Composite priority {}", result.composite_priority.as_str()),
                    }],
                },
            }],
        },
    })
}

fn detected_issue_entry(
    id: &str,
    issue_id: &str,
    impression_id: &str,
    flag: &AdditionalFlag,
) -> Value {
    let severity = match flag.priority {
        FlagPriority::High => "high",
        FlagPriority::Medium => "moderate",
        FlagPriority::Low => "low",
    };
    json!({
        "fullUrl": format!("urn:uuid:{id}"),
        "resource": {
            "resourceType": "DetectedIssue",
            "id": id,
            "meta": {
                "profile": ["http://hl7.org/fhir/StructureDefinition/DetectedIssue"],
            },
            "status": "preliminary",
            "severity": severity,
            "identifier": [{
                "system": "urn:form-examples:issue-tracker",
                "value": format!("{issue_id}:{}", flag.flag_id),
            }],
            "code": {
                "coding": [{
                    "system": LFPSE_CODE_SYSTEM,
                    "code": serde_json::to_value(flag.category)
                        .ok()
                        .and_then(|v| v.as_str().map(str::to_owned))
                        .unwrap_or_else(|| "other".into()),
                    "display": flag.description,
                }],
            },
            "detail": flag.description,
            "mitigation": [{
                "action": {
                    "text": flag.suggested_action,
                },
            }],
            "implicated": [{
                "reference": format!("ClinicalImpression/{impression_id}"),
            }],
        },
    })
}
