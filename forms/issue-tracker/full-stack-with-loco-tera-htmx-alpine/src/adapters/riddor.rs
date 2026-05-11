//! UK Health and Safety Executive *RIDDOR* (Reporting of Injuries,
//! Diseases and Dangerous Occurrences Regulations 2013) export adapter.
//!
//! Generates a JSON document aligned with the HSE F2508 family of
//! reporting forms, suitable for staging a submission to the HSE
//! reporting service at <https://www.hse.gov.uk/riddor/>.
//!
//! Eligibility: `issue_category` in {`workplace-safety`,
//! `medical-device`} AND `score_by_harm_grade >= 1`. Issues that do not
//! meet both criteria return `None`.
//!
//! As with the ICO adapter, RIDDOR-specific fields the core
//! `IssueTrackerAssessment` schema does not carry (incident type per
//! the 2013 regulations, injured-person details, site address, etc.)
//! are accepted via the explicit `RiddorReportExtras` struct so the
//! core schema doesn't need to grow.

use crate::scoring::types::{GradeResult, IssueTrackerAssessment};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

const RIDDOR_SCHEMA_VERSION: &str = "hse-riddor-f2508-v1";

/// RIDDOR-reportable incident classifications per the 2013 regulations.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RiddorIncidentType {
    /// Death of any person (Reg 6).
    Death,
    /// Specified injury to a worker — fracture, amputation, loss of
    /// sight, scalping, etc. per Schedule 1 (Reg 4).
    SpecifiedInjury,
    /// Over-seven-day injury — worker incapacitated > 7 days (Reg 4).
    OverSevenDayInjury,
    /// Non-fatal injury to a non-worker member of the public (Reg 5).
    NonWorkerInjury,
    /// Dangerous occurrence per Schedule 2 (Reg 7) — near-miss.
    DangerousOccurrence,
    /// Occupational disease per Schedule 3 (Reg 8 / 9).
    OccupationalDisease,
    /// Gas incident (Reg 11).
    GasIncident,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum InjuredPersonRole {
    Employee,
    SelfEmployed,
    Contractor,
    MemberOfPublic,
    Trainee,
    Other,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct RiddorReportExtras {
    pub incident_type: Option<RiddorIncidentType>,
    pub injured_person_role: Option<InjuredPersonRole>,
    pub injured_person_age: Option<u8>,
    pub injured_person_sex: String,
    pub site_address_lines: Vec<String>,
    pub site_postcode: String,
    pub activity_at_time: String,
    pub how_it_happened: String,
    pub injury_or_condition: String,
    pub days_off_work: Option<u32>,
    pub responsible_person_name: String,
    pub responsible_person_position: String,
    pub responsible_person_contact: String,
}

pub fn is_eligible(data: &IssueTrackerAssessment) -> bool {
    let cat = data.reporter.issue_category.as_str();
    let category_ok = matches!(cat, "workplace-safety" | "medical-device");
    let harm_ok = matches!(data.scores.score_by_harm_grade, Some(h) if h >= 1);
    category_ok && harm_ok
}

pub fn to_riddor_report(
    issue_id: &str,
    cc_summary: &str,
    extras: &RiddorReportExtras,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> Option<Value> {
    if !is_eligible(data) {
        return None;
    }

    Some(json!({
        "schema": RIDDOR_SCHEMA_VERSION,
        "incidentId": issue_id,
        "incidentType": extras.incident_type,
        "summary": cc_summary,
        "discoveredAt": data.reporter.discovered_at,
        "reportedAt": data.reporter.reported_at,
        "responsiblePerson": {
            "name": extras.responsible_person_name,
            "position": extras.responsible_person_position,
            "contact": extras.responsible_person_contact,
        },
        "injuredPerson": {
            "role": extras.injured_person_role,
            "age": extras.injured_person_age,
            "sex": extras.injured_person_sex,
        },
        "site": {
            "addressLines": extras.site_address_lines,
            "postcode": extras.site_postcode,
            "system": data.reporter.system_name,
            "component": data.reporter.component,
            "environment": data.reporter.environment,
        },
        "circumstances": {
            "activityAtTime": extras.activity_at_time,
            "howItHappened": extras.how_it_happened,
            "injuryOrCondition": extras.injury_or_condition,
            "daysOffWork": extras.days_off_work,
        },
        "assessment": {
            "compositePriority": result.composite_priority.as_str(),
            "harmGrade": result.score_by_harm_grade,
            "severityOfImpact": result.score_by_severity_of_impact,
            "magnitudeOfDamage": result.score_by_magnitude_of_damage,
        },
    }))
}
