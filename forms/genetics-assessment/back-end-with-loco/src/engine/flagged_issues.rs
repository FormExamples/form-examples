//! Detection of additional flagged issues.

use super::genetics_grader::build_context;
use super::types::{AdditionalFlag, AssessmentData};

/// Detect genetics-assessment safety / counselling flags.
///
/// Flag IDs and priorities mirror the JS engine verbatim.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();
    let ctx = build_context(data);
    let manchester_score = ctx.manchester_score;
    let bethesda_met = ctx.bethesda_met;
    let premm5_score = ctx.premm5_score;
    let tyrer_cuzick_lifetime = ctx.tyrer_cuzick_lifetime;

    // ─── HIGH priority ────────────────────────────────────────

    if manchester_score >= 15 {
        flags.push(AdditionalFlag {
            id: "FLAG-BRCA-001".to_string(),
            category: "BRCA Testing".to_string(),
            message: format!(
                "Manchester score {manchester_score} (>=15) — BRCA1/2 germline testing indicated."
            ),
            priority: "high".to_string(),
        });
    }

    if bethesda_met >= 1 {
        let word = if bethesda_met == 1 {
            "criterion"
        } else {
            "criteria"
        };
        flags.push(AdditionalFlag {
            id: "FLAG-LYNCH-001".to_string(),
            category: "Lynch Testing".to_string(),
            message: format!(
                "{bethesda_met} Revised Bethesda {word} met — MMR IHC / MSI testing on tumour indicated."
            ),
            priority: "high".to_string(),
        });
    }

    if let Some(p) = premm5_score {
        if p >= 5.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-LYNCH-002".to_string(),
                category: "Lynch Testing".to_string(),
                message: format!(
                    "PREMM5 score {p}% (>=5%) — Lynch syndrome germline panel indicated."
                ),
                priority: "high".to_string(),
            });
        }
    }

    if tyrer_cuzick_lifetime >= 30.0 {
        flags.push(AdditionalFlag {
            id: "FLAG-TC-001".to_string(),
            category: "Breast Surveillance".to_string(),
            message: format!(
                "Tyrer-Cuzick lifetime risk {tyrer_cuzick_lifetime}% — high-risk breast surveillance pathway per NICE FH."
            ),
            priority: "high".to_string(),
        });
    } else if tyrer_cuzick_lifetime >= 17.0 {
        flags.push(AdditionalFlag {
            id: "FLAG-TC-002".to_string(),
            category: "Breast Surveillance".to_string(),
            message: format!(
                "Tyrer-Cuzick lifetime risk {tyrer_cuzick_lifetime}% — moderate-risk breast surveillance pathway per NICE FH."
            ),
            priority: "medium".to_string(),
        });
    }

    // Multiple early-onset cancers
    let mut early_onset_count = 0;
    let mut paediatric_count = 0;
    let fp = &data.family_pedigree;
    let mut all: Vec<&super::types::Relative> = vec![
        &fp.maternal_grandmother,
        &fp.maternal_grandfather,
        &fp.paternal_grandmother,
        &fp.paternal_grandfather,
        &fp.mother,
        &fp.father,
    ];
    all.extend(fp.maternal_aunts_uncles.iter());
    all.extend(fp.paternal_aunts_uncles.iter());
    all.extend(fp.siblings.iter());
    all.extend(fp.children.iter());
    all.extend(fp.maternal_cousins.iter());
    all.extend(fp.paternal_cousins.iter());

    for r in &all {
        for c in &r.cancers {
            if let Some(age) = c.age_at_diagnosis {
                if age <= 50 {
                    early_onset_count += 1;
                }
                if age < 18 {
                    paediatric_count += 1;
                }
            }
        }
    }
    for c in &data.personal_medical_history.cancers {
        if let Some(age) = c.age_at_diagnosis {
            if age <= 50 {
                early_onset_count += 1;
            }
            if age < 18 {
                paediatric_count += 1;
            }
        }
    }

    if early_onset_count >= 2 {
        flags.push(AdditionalFlag {
            id: "FLAG-EARLY-001".to_string(),
            category: "Cancer Spectrum".to_string(),
            message: format!(
                "{early_onset_count} cancers diagnosed at age 50 or younger across proband and family."
            ),
            priority: "high".to_string(),
        });
    }

    if paediatric_count >= 1 {
        flags.push(AdditionalFlag {
            id: "FLAG-PAEDS-001".to_string(),
            category: "Cancer Spectrum".to_string(),
            message: "Paediatric cancer (<18) reported — consider Li-Fraumeni and other paediatric tumour syndromes.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.personal_medical_history.multiple_primary_cancers == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MPRIM-001".to_string(),
            category: "Proband History".to_string(),
            message: "Proband has multiple primary cancers — pre-test probability of pathogenic variant elevated.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM priority ──────────────────────────────────────

    let maternal_branch: Vec<&super::types::Relative> = {
        let mut v: Vec<&super::types::Relative> =
            vec![&fp.maternal_grandmother, &fp.maternal_grandfather, &fp.mother];
        v.extend(fp.maternal_aunts_uncles.iter());
        v.extend(fp.maternal_cousins.iter());
        v
    };
    let paternal_branch: Vec<&super::types::Relative> = {
        let mut v: Vec<&super::types::Relative> =
            vec![&fp.paternal_grandmother, &fp.paternal_grandfather, &fp.father];
        v.extend(fp.paternal_aunts_uncles.iter());
        v.extend(fp.paternal_cousins.iter());
        v
    };
    let maternal_affected = maternal_branch
        .iter()
        .filter(|r| r.affected_with_cancer == "yes" && !r.cancers.is_empty())
        .count();
    let paternal_affected = paternal_branch
        .iter()
        .filter(|r| r.affected_with_cancer == "yes" && !r.cancers.is_empty())
        .count();

    if maternal_affected > 0
        && paternal_affected == 0
        && (fp.paternal_aunts_uncles.len() + fp.paternal_cousins.len()) <= 1
    {
        flags.push(AdditionalFlag {
            id: "FLAG-LINE-001".to_string(),
            category: "Pedigree Limitation".to_string(),
            message: "Cancer history concentrated on the maternal line; paternal line under-represented — request additional paternal pedigree where possible.".to_string(),
            priority: "medium".to_string(),
        });
    } else if paternal_affected > 0
        && maternal_affected == 0
        && (fp.maternal_aunts_uncles.len() + fp.maternal_cousins.len()) <= 1
    {
        flags.push(AdditionalFlag {
            id: "FLAG-LINE-002".to_string(),
            category: "Pedigree Limitation".to_string(),
            message: "Cancer history concentrated on the paternal line; maternal line under-represented — request additional maternal pedigree where possible.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if paternal_affected > 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-PAT-001".to_string(),
            category: "Paternal Line".to_string(),
            message: "Affected paternal-line relatives — remember that BRCA1/2 transmits paternally; consider full paternal pedigree.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.consanguinity_ancestry.ashkenazi_jewish == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ANC-001".to_string(),
            category: "Ancestry".to_string(),
            message: "Ashkenazi Jewish ancestry — three BRCA1/2 founder variants account for the majority of mutations in this population.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.consanguinity_ancestry.sephardic_jewish == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ANC-002".to_string(),
            category: "Ancestry".to_string(),
            message: "Sephardic Jewish ancestry — population-specific founder variants exist; consider extended panel.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.consanguinity_ancestry.founding_population == "yes" {
        let detail = data
            .consanguinity_ancestry
            .founding_population_details
            .trim();
        let msg = if detail.is_empty() {
            "Founding-population ancestry — population-specific founder variants may apply.".to_string()
        } else {
            format!(
                "Founding-population ancestry ({detail}) — population-specific founder variants may apply."
            )
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ANC-003".to_string(),
            category: "Ancestry".to_string(),
            message: msg,
            priority: "medium".to_string(),
        });
    }
    if data.consanguinity_ancestry.consanguinity == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONS-001".to_string(),
            category: "Consanguinity".to_string(),
            message: "Consanguinity reported — increased recurrence risk for autosomal recessive conditions; offer carrier screening.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.targeted_risk_scoring.tyrer_cuzick.atypical_hyperplasia == "yes"
        || data.targeted_risk_scoring.tyrer_cuzick.lcis == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-TC-MOD-001".to_string(),
            category: "Breast Risk Modifier".to_string(),
            message: "Atypical hyperplasia or LCIS reported — strong individual risk modifier; ensure included in Tyrer-Cuzick model run.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.targeted_risk_scoring.tyrer_cuzick.dense == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TC-MOD-002".to_string(),
            category: "Breast Risk Modifier".to_string(),
            message: "Dense mammographic breast tissue — modest independent risk modifier and reduces mammographic sensitivity.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if !data.presenting_concern.suspected_syndrome.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-SYN-001".to_string(),
            category: "Suspected Syndrome".to_string(),
            message: format!(
                "Referrer suspects: {}",
                data.presenting_concern.suspected_syndrome
            ),
            priority: "medium".to_string(),
        });
    }

    if data
        .prior_genetic_testing
        .variants_of_uncertain_significance
        == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-VUS-001".to_string(),
            category: "Prior Testing".to_string(),
            message: "Variant(s) of uncertain significance previously reported — review variant interpretation databases for reclassification.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.prior_genetic_testing.familial_variant_known == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-FAM-VAR-001".to_string(),
            category: "Prior Testing".to_string(),
            message: "Known familial pathogenic variant — predictive testing for the proband is the appropriate first-line approach.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.patient_understanding_concerns.insurance_concerns == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PSYCH-001".to_string(),
            category: "Counselling".to_string(),
            message: "Patient has insurance concerns — discuss GINA / local protections before testing.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.patient_understanding_concerns.confidentiality_concerns == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PSYCH-002".to_string(),
            category: "Counselling".to_string(),
            message: "Patient has confidentiality concerns — review consent and information-sharing arrangements.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW priority ───────────────────────────────────────────

    if data.patient_understanding_concerns.reproductive_implications == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-REPRO-001".to_string(),
            category: "Reproductive Counselling".to_string(),
            message: "Patient asking about reproductive implications — offer preconception / prenatal genetic counselling.".to_string(),
            priority: "low".to_string(),
        });
    }

    let pgc = &data.prior_genetic_testing.prior_genetic_counselling;
    if pgc == "no" || pgc.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-COUN-001".to_string(),
            category: "General Counselling".to_string(),
            message: "No prior formal genetic counselling recorded — pre-test counselling appointment recommended.".to_string(),
            priority: "low".to_string(),
        });
    }

    if data.patient_understanding_concerns.consent_to_testing == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONSENT-001".to_string(),
            category: "Consent".to_string(),
            message: "Patient currently declines testing — document and offer further information.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
