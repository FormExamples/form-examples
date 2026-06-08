//! Oocg grader module.

use super::clinical_domain::grade_clinical;
use super::flagged_issues::detect_flagged_issues;
use super::operational_domain::grade_operational;
use super::prem_domain::grade_prem;
use super::prom_domain::grade_prom;
use super::types::{AssessmentData, GradingResult};
use super::utils::{grade_max, promis_gph_t_score, promis_mh_t_score};

/// Compute the full OOCG grading result from assessment data.
///
/// Overall grade = worst of the four domain grades ("highest severity wins").
pub fn grade_oocg(data: &AssessmentData) -> GradingResult {
    // Enrich PROMIS T-scores before grading (matches the front-end orchestrator).
    let mut enriched = data.clone();
    enriched.prom_promis.global_physical_health_t_score = promis_gph_t_score(&enriched.prom_promis);
    enriched.prom_promis.global_mental_health_t_score = promis_mh_t_score(&enriched.prom_promis);

    let clinical = grade_clinical(&enriched);
    let prom = grade_prom(&enriched);
    let prem = grade_prem(&enriched);
    let operational = grade_operational(&enriched);

    let overall_grade = grade_max(&[
        clinical.grade.clone(),
        prom.grade.clone(),
        prem.grade.clone(),
        operational.grade.clone(),
    ]);

    let mut fired_rules = Vec::new();
    fired_rules.extend(clinical.rules.iter().cloned());
    fired_rules.extend(prom.rules.iter().cloned());
    fired_rules.extend(prem.rules.iter().cloned());
    fired_rules.extend(operational.rules.iter().cloned());

    let flagged_issues = detect_flagged_issues(&enriched, &clinical.grade, &prem.grade);

    GradingResult {
        overall_grade,
        clinical_grade: clinical.grade,
        prom_grade: prom.grade,
        prem_grade: prem.grade,
        operational_grade: operational.grade,
        fired_rules,
        flagged_issues,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}
