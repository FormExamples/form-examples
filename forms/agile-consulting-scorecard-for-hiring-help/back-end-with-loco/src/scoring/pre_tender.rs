//! Rust port of `front-end-form-with-svelte/src/lib/engine/pre-tender.ts`.
//!
//! Builds a redacted, vendor-facing summary of a scorecard suitable to
//! share with prospective agile consultants in a request-for-proposal.
//! Drops respondent PII and per-item evidence; keeps the org name +
//! sector + size + date + score + band + recommendation + flag
//! categories/priorities.

use serde::{Deserialize, Serialize};

use crate::scoring::grader::grade_scorecard;
use crate::scoring::types::{AgileConsultingScorecardAssessment, Band, GradeResult};
use crate::scoring::utils::band_to_recommendation;

/// Pre tender organization.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreTenderOrganization {
    /// Organization name.
    pub organization_name: String,
    /// Sector.
    pub sector: String,
    /// Size band.
    pub size_band: String,
}

/// Pre tender assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreTenderAssessment {
    /// Assessment date.
    pub assessment_date: String,
}

/// Pre tender score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreTenderScore {
    /// Total.
    pub total: u8,
    /// Manifesto subtotal.
    pub manifesto_subtotal: u8,
    /// Principles subtotal.
    pub principles_subtotal: u8,
    /// Band.
    pub band: Band,
    /// Recommendation.
    pub recommendation: String,
}

/// Pre tender flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreTenderFlag {
    /// Category.
    pub category: String,
    /// Priority.
    pub priority: String,
}

/// Pre tender summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreTenderSummary {
    /// Schema version.
    #[serde(rename = "$schemaVersion")]
    pub schema_version: u8,
    /// Organization.
    pub organization: PreTenderOrganization,
    /// Assessment.
    pub assessment: PreTenderAssessment,
    /// Score.
    pub score: PreTenderScore,
    /// Flags.
    pub flags: Vec<PreTenderFlag>,
}

fn recommendation_slug(band: Band) -> &'static str {
    match band_to_recommendation(band) {
        crate::scoring::types::Recommendation::DoNotHireYet => "do-not-hire-yet",
        crate::scoring::types::Recommendation::DoHomeworkFirst => "do-homework-first",
        crate::scoring::types::Recommendation::TrialEngagement => "trial-engagement",
        crate::scoring::types::Recommendation::HireWithFocusAreas => "hire-with-focus-areas",
        crate::scoring::types::Recommendation::ReassessIn3Months => "reassess-in-3-months",
    }
}

fn flag_category_slug(c: crate::scoring::types::FlagCategory) -> &'static str {
    use crate::scoring::types::FlagCategory::*;
    match c {
        NoSeniorLeadershipBuyin => "no-senior-leadership-buyin",
        NoCustomerContact => "no-customer-contact",
        NoWorkingSoftware => "no-working-software",
        NoSustainableBudget => "no-sustainable-budget",
        NoSelfOrganization => "no-self-organization",
        NoReflectionCulture => "no-reflection-culture",
        Other => "other",
    }
}

fn flag_priority_slug(p: crate::scoring::types::FlagPriority) -> &'static str {
    use crate::scoring::types::FlagPriority::*;
    match p {
        Low => "low",
        Medium => "medium",
        High => "high",
    }
}

/// To pre tender summary.
pub fn to_pre_tender_summary(
    data: &AgileConsultingScorecardAssessment,
    grade: &GradeResult,
) -> PreTenderSummary {
    PreTenderSummary {
        schema_version: 1,
        organization: PreTenderOrganization {
            organization_name: data.organization.organization_name.clone(),
            sector: data.organization.sector.clone(),
            size_band: data.organization.size_band.clone(),
        },
        assessment: PreTenderAssessment {
            assessment_date: data.assessment.assessment_date.clone(),
        },
        score: PreTenderScore {
            total: grade.score_total,
            manifesto_subtotal: grade.manifesto_subtotal,
            principles_subtotal: grade.principles_subtotal,
            band: grade.computed_band,
            recommendation: recommendation_slug(grade.computed_band).into(),
        },
        flags: grade
            .additional_flags
            .iter()
            .map(|f| PreTenderFlag {
                category: flag_category_slug(f.category).into(),
                priority: flag_priority_slug(f.priority).into(),
            })
            .collect(),
    }
}

/// Convenience helper: grade and summarise in one call.
pub fn summarise(data: &AgileConsultingScorecardAssessment) -> PreTenderSummary {
    let grade = grade_scorecard(data);
    to_pre_tender_summary(data, &grade)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn golden() -> AgileConsultingScorecardAssessment {
        let json = include_str!("../../../samples/sample-assessment.json");
        serde_json::from_str(json).expect("parse sample")
    }

    #[test]
    fn schema_version_is_stamped() {
        let s = summarise(&golden());
        assert_eq!(s.schema_version, 1);
    }

    #[test]
    fn organization_keeps_three_fields_only() {
        let data = golden();
        let s = summarise(&data);
        assert_eq!(s.organization.organization_name, data.organization.organization_name);
        assert_eq!(s.organization.sector, data.organization.sector);
        assert_eq!(s.organization.size_band, data.organization.size_band);
    }

    #[test]
    fn score_mirrors_engine_for_golden_sample() {
        let s = summarise(&golden());
        assert_eq!(s.score.total, 9);
        assert_eq!(s.score.manifesto_subtotal, 3);
        assert_eq!(s.score.principles_subtotal, 6);
        assert_eq!(s.score.band, Band::Medium);
        assert_eq!(s.score.recommendation, "do-homework-first");
    }

    #[test]
    fn flags_only_carry_category_and_priority() {
        let s = summarise(&golden());
        let json = serde_json::to_string(&s.flags).expect("serialise flags");
        // Flag entries must not include description or suggestedAction.
        assert!(!json.contains("description"));
        assert!(!json.contains("suggestedAction"));
        assert!(!json.contains("Suggested action"));
    }

    #[test]
    fn does_not_leak_respondent_or_evidence() {
        let data = golden();
        let s = summarise(&data);
        let json = serde_json::to_string(&s).expect("serialise");
        // No respondent identity.
        assert!(!json.contains(&data.respondent.respondent_name));
        assert!(!json.contains(&data.respondent.respondent_email));
        // No per-item evidence.
        for ev in [
            data.manifesto.m1.evidence.as_str(),
            data.manifesto.m4.evidence.as_str(),
            data.principles.p2.evidence.as_str(),
            data.principles.p11.evidence.as_str(),
        ] {
            if !ev.is_empty() {
                assert!(!json.contains(ev), "leaked evidence: {ev}");
            }
        }
        // No legal name / website / headcount.
        assert!(!json.contains(&data.organization.legal_name) || data.organization.legal_name.is_empty());
        assert!(!json.contains(&data.organization.website) || data.organization.website.is_empty());
        // No "done": markers.
        assert!(!json.contains("\"done\""));
    }
}
