//! Vaccination grader module.

use super::flagged_issues::detect_additional_flags;
use super::types::{
    AssessmentData, ComplianceStatus, FiredRule, GradingResult, RiskLevel,
};
use super::vaccination_rules::all_rules;

/// Pure function: grades a Vaccinations Checklist. Ported 1:1 from
/// `vaccination-grader.js`.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);

    let childhood_complete = derive_childhood_complete(data);
    let occupational_complete = derive_occupational_complete(data);
    let covid_complete = data.covid19_vaccination.covid_primary_course == "yes";
    let flu_current = data.influenza_vaccination.flu_vaccine_current_season == "yes";

    let compliance_status = derive_compliance_status(
        data,
        &fired_rules,
        childhood_complete,
        occupational_complete,
        covid_complete,
    );
    let overall_risk = derive_overall_risk(&fired_rules, &compliance_status, data);
    let additional_flags = detect_additional_flags(data);
    let missing_vaccinations = derive_missing_vaccinations(data);

    GradingResult {
        compliance_status,
        overall_risk,
        childhood_complete,
        occupational_complete,
        covid_complete,
        flu_current,
        fired_rules,
        additional_flags,
        missing_vaccinations,
        timestamp,
    }
}

/// Evaluate every rule against the data, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    out
}

/// Determine whether childhood immunisation schedule is complete.
pub fn derive_childhood_complete(data: &AssessmentData) -> bool {
    let c = &data.childhood_immunisations;
    c.mmr_dose1 == "yes"
        && c.mmr_dose2 == "yes"
        && c.dtp_primary_course == "yes"
        && c.dtp_booster == "yes"
        && c.polio_primary_course == "yes"
        && c.polio_booster == "yes"
}

/// Determine whether occupational vaccine requirements are met. Only
/// applicable to healthcare workers.
pub fn derive_occupational_complete(data: &AssessmentData) -> bool {
    let is_healthcare = data.demographics.occupation_category == "healthcare";
    if !is_healthcare {
        return true;
    }
    let o = &data.occupational_vaccines;
    o.hepatitis_b_course == "yes"
        && o.hepatitis_b_anti_body_level != "inadequate"
        && (o.varicella_vaccine == "yes" || o.varicella_history == "yes")
}

/// Build a list of human-readable missing-vaccination labels.
pub fn derive_missing_vaccinations(data: &AssessmentData) -> Vec<String> {
    let mut missing: Vec<String> = Vec::new();
    let c = &data.childhood_immunisations;
    if c.mmr_dose1 != "yes" {
        missing.push("MMR dose 1".to_string());
    }
    if c.mmr_dose2 != "yes" {
        missing.push("MMR dose 2".to_string());
    }
    if c.dtp_primary_course != "yes" {
        missing.push("DTP primary course".to_string());
    }
    if c.dtp_booster != "yes" {
        missing.push("DTP booster".to_string());
    }
    if c.polio_primary_course != "yes" {
        missing.push("Polio primary course".to_string());
    }
    if c.polio_booster != "yes" {
        missing.push("Polio booster".to_string());
    }

    if data.demographics.occupation_category == "healthcare" {
        let o = &data.occupational_vaccines;
        if o.hepatitis_b_course != "yes" {
            missing.push("Hepatitis B course".to_string());
        }
        if o.hepatitis_b_anti_body_level == "inadequate" {
            missing.push("Hepatitis B booster (antibody inadequate)".to_string());
        }
        if o.varicella_vaccine != "yes" && o.varicella_history != "yes" {
            missing.push("Varicella vaccination / history".to_string());
        }
    }

    if data.covid19_vaccination.covid_primary_course != "yes" {
        missing.push("COVID-19 primary course".to_string());
    }
    if data.influenza_vaccination.flu_vaccine_current_season != "yes" {
        missing.push("Current-season influenza vaccine".to_string());
    }
    if data.travel_vaccines.travel_planned == "yes"
        && data.travel_vaccines.yellow_fever_vaccine == "no"
    {
        missing.push("Yellow fever vaccine (for planned travel)".to_string());
    }
    missing
}

/// Derive overall compliance status from data + fired rules.
pub fn derive_compliance_status(
    data: &AssessmentData,
    fired_rules: &[FiredRule],
    childhood_complete: bool,
    occupational_complete: bool,
    covid_complete: bool,
) -> ComplianceStatus {
    if data.contraindications_allergies.live_vaccine_contraindicated == "yes"
        || (data.vaccination_history.immunocompromised == "yes"
            && data.vaccination_history.adverse_reaction_severity == "anaphylaxis")
    {
        return "contraindicated".to_string();
    }

    let has_critical_rule = fired_rules.iter().any(|r| r.grade >= 4);
    if has_critical_rule {
        return "non-compliant".to_string();
    }

    let has_significant_rule = fired_rules.iter().any(|r| r.grade >= 3);
    if has_significant_rule || !childhood_complete || !occupational_complete {
        return "partially-immunised".to_string();
    }

    if fired_rules.iter().any(|r| r.grade >= 2) {
        return "partially-immunised".to_string();
    }

    if childhood_complete && occupational_complete && covid_complete {
        return "fully-immunised".to_string();
    }

    "partially-immunised".to_string()
}

/// Derive overall risk level.
pub fn derive_overall_risk(
    fired_rules: &[FiredRule],
    compliance_status: &str,
    data: &AssessmentData,
) -> RiskLevel {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);

    if max_grade >= 4 || data.schedule_compliance.active_exposure_incident == "yes" {
        return "critical".to_string();
    }

    if max_grade >= 3
        || (compliance_status == "non-compliant"
            && data.demographics.occupation_category == "healthcare")
    {
        return "high".to_string();
    }

    if max_grade >= 2 || compliance_status == "partially-immunised" {
        return "moderate".to_string();
    }

    "low".to_string()
}

/// Map the four-way compliance status onto the simpler three-way wizard
/// status used in the HTML report header.
pub fn simplify_status(status: &str) -> &'static str {
    match status {
        "fully-immunised" => "compliant",
        "partially-immunised" => "partial",
        "non-compliant" => "non-compliant",
        "contraindicated" => "non-compliant",
        _ => "partial",
    }
}
