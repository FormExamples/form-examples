use super::flagged_issues::detect_additional_flags;
use super::genetics_rules::all_rules;
use super::types::{
    AssessmentData, FiredRule, GraderContext, GradingResult, ManchesterInputs, Relative,
};
use super::utils::max_risk_level;

// Manchester scoring weights (Evans 2004 / Evans & Lalloo).
const MAN_W_FEMALE_BREAST_UNDER30: i32 = 6;
const MAN_W_FEMALE_BREAST_30_39: i32 = 4;
const MAN_W_FEMALE_BREAST_40_49: i32 = 3;
const MAN_W_MALE_BREAST: i32 = 8;
const MAN_W_OVARIAN_UNDER60: i32 = 8;
const MAN_W_PANCREATIC_UNDER60: i32 = 1;
const MAN_W_PROSTATE_UNDER60: i32 = 1;

fn nzi(n: Option<i32>) -> i32 {
    n.unwrap_or(0)
}

/// Compute the Manchester score for BRCA1/2 from per-cancer counts.
pub fn calculate_manchester_score(d: &AssessmentData) -> i32 {
    let m: &ManchesterInputs = &d.targeted_risk_scoring.manchester;
    let mut s = 0;
    // Proband contributions
    s += nzi(m.proband_female_breast_under30) * MAN_W_FEMALE_BREAST_UNDER30;
    s += nzi(m.proband_female_breast30to39) * MAN_W_FEMALE_BREAST_30_39;
    s += nzi(m.proband_female_breast40to49) * MAN_W_FEMALE_BREAST_40_49;
    s += nzi(m.proband_ovarian_under60) * MAN_W_OVARIAN_UNDER60;
    s += nzi(m.proband_male_breast) * MAN_W_MALE_BREAST;
    // Relative contributions
    s += nzi(m.relative_female_breast_under30) * MAN_W_FEMALE_BREAST_UNDER30;
    s += nzi(m.relative_female_breast30to39) * MAN_W_FEMALE_BREAST_30_39;
    s += nzi(m.relative_female_breast40to49) * MAN_W_FEMALE_BREAST_40_49;
    s += nzi(m.relative_ovarian_under60) * MAN_W_OVARIAN_UNDER60;
    s += nzi(m.relative_male_breast) * MAN_W_MALE_BREAST;
    s += nzi(m.relative_pancreatic_under60) * MAN_W_PANCREATIC_UNDER60;
    s += nzi(m.relative_prostate_under60) * MAN_W_PROSTATE_UNDER60;
    s
}

/// Count how many of the five Revised Bethesda criteria are met.
pub fn count_bethesda_met(d: &AssessmentData) -> i32 {
    let b = &d.targeted_risk_scoring.bethesda;
    let mut n = 0;
    if b.crc_under50 == "yes" {
        n += 1;
    }
    if b.synchronous_metachronous == "yes" {
        n += 1;
    }
    if b.msi_histology == "yes" {
        n += 1;
    }
    if b.first_degree_lynch_tumour == "yes" {
        n += 1;
    }
    if b.multiple_relatives_lynch == "yes" {
        n += 1;
    }
    n
}

/// Flatten every relative in the pedigree.
pub fn flatten_pedigree(d: &AssessmentData) -> Vec<&Relative> {
    let fp = &d.family_pedigree;
    let mut out: Vec<&Relative> = vec![
        &fp.maternal_grandmother,
        &fp.maternal_grandfather,
        &fp.paternal_grandmother,
        &fp.paternal_grandfather,
        &fp.mother,
        &fp.father,
    ];
    out.extend(fp.maternal_aunts_uncles.iter());
    out.extend(fp.paternal_aunts_uncles.iter());
    out.extend(fp.siblings.iter());
    out.extend(fp.children.iter());
    out.extend(fp.maternal_cousins.iter());
    out.extend(fp.paternal_cousins.iter());
    out
}

/// Build the grader context.
pub fn build_context(d: &AssessmentData) -> GraderContext {
    let manchester_score = calculate_manchester_score(d);
    let bethesda_met = count_bethesda_met(d);
    let premm5_score = d.targeted_risk_scoring.premm5.external_premm5_percent;
    let tyrer_cuzick_lifetime = d
        .targeted_risk_scoring
        .tyrer_cuzick
        .external_lifetime_risk
        .unwrap_or(0.0);

    let mut affected_first_degree = 0;
    let mut early_onset_under50 = 0;
    let mut paediatric_cancers = 0;
    let mut has_male_breast = false;
    let mut has_ovarian = false;
    let mut has_pancreatic = false;

    let fp = &d.family_pedigree;
    let mut first_degree: Vec<&Relative> = vec![&fp.mother, &fp.father];
    first_degree.extend(fp.siblings.iter());
    first_degree.extend(fp.children.iter());

    for r in &first_degree {
        if r.affected_with_cancer == "yes" && !r.cancers.is_empty() {
            affected_first_degree += 1;
        }
    }

    let all = flatten_pedigree(d);
    for r in &all {
        for c in &r.cancers {
            let t = c.kind.to_lowercase();
            if let Some(age) = c.age_at_diagnosis {
                if age <= 50 {
                    early_onset_under50 += 1;
                }
                if age < 18 {
                    paediatric_cancers += 1;
                }
            }
            if t.contains("male breast") || (t.contains("breast") && r.sex == "male") {
                has_male_breast = true;
            }
            if t.contains("ovar") {
                has_ovarian = true;
            }
            if t.contains("pancrea") {
                has_pancreatic = true;
            }
        }
    }

    let mut has_bilateral_breast = false;
    for c in &d.personal_medical_history.cancers {
        let t = c.kind.to_lowercase();
        if t.contains("breast") && c.bilateral == "yes" {
            has_bilateral_breast = true;
        }
        if let Some(age) = c.age_at_diagnosis {
            if age <= 50 {
                early_onset_under50 += 1;
            }
            if age < 18 {
                paediatric_cancers += 1;
            }
        }
        if t.contains("ovar") {
            has_ovarian = true;
        }
        if t.contains("pancrea") {
            has_pancreatic = true;
        }
    }
    let has_multiple_primaries =
        d.personal_medical_history.multiple_primary_cancers == "yes";

    GraderContext {
        manchester_score,
        bethesda_met,
        premm5_score,
        tyrer_cuzick_lifetime,
        affected_first_degree,
        early_onset_under50,
        paediatric_cancers,
        has_male_breast,
        has_ovarian,
        has_pancreatic,
        has_bilateral_breast,
        has_multiple_primaries,
    }
}

/// Evaluate every rule against the data, returning the fired rules.
pub fn run_rules(data: &AssessmentData) -> (Vec<FiredRule>, String) {
    let ctx = build_context(data);
    let mut fired: Vec<FiredRule> = Vec::new();
    let mut level = "low".to_string();
    for rule in all_rules() {
        let severity = (rule.evaluate)(data, &ctx);
        if severity == "low" || severity == "moderate" || severity == "high" {
            fired.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                severity: severity.clone(),
            });
            level = max_risk_level(&level, &severity);
        }
    }
    (fired, level)
}

/// Pure function: grade a genetics assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let ctx = build_context(data);
    let (fired_rules, risk_level) = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        risk_level,
        manchester_score: ctx.manchester_score,
        bethesda_met: ctx.bethesda_met,
        premm5_score: ctx.premm5_score,
        tyrer_cuzick_lifetime: ctx.tyrer_cuzick_lifetime,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
