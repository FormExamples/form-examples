//! Examiner-facing flag detection. Independent of the OET scaled score
//! (which the grader computes); raises improvement areas, clinical-safety
//! concerns, and borderline outcomes.
//!
//! Ported verbatim from `front-end-form-with-html/js/flagged-issues.js`.
//! All flag IDs are preserved.

use super::types::{AdditionalFlag, AssessmentData, ClinicalIndicators, GradingResult};

/// Lowest non-null value across the two role-plays for a given linguistic
/// criterion. Returns `None` if neither role-play has been rated.
fn lowest_linguistic<F>(data: &AssessmentData, accessor: F) -> Option<f64>
where
    F: Fn(&super::types::LinguisticRating) -> Option<f64>,
{
    let a = accessor(&data.linguistic_role_play1);
    let b = accessor(&data.linguistic_role_play2);
    match (a, b) {
        (None, None) => None,
        (None, Some(y)) => Some(y),
        (Some(x), None) => Some(x),
        (Some(x), Some(y)) => Some(x.min(y)),
    }
}

fn ci_get(ci: &ClinicalIndicators, field: &str) -> Option<f64> {
    match field {
        "relationshipBuilding" => ci.relationship_building,
        "understandingPatientPerspective" => ci.understanding_patient_perspective,
        "providingStructure" => ci.providing_structure,
        "informationGathering" => ci.information_gathering,
        "informationGiving" => ci.information_giving,
        _ => None,
    }
}

fn priority_rank(p: &str) -> u32 {
    match p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    }
}

fn fmt_num(n: f64) -> String {
    // Print whole values without a trailing `.0` to match the JS Number.toString()
    // output (e.g. `0`, `1`, `2`, `2.5`).
    if (n - n.trunc()).abs() < f64::EPSILON {
        format!("{}", n.trunc() as i64)
    } else {
        let r = (n * 10.0).round() / 10.0;
        let mut s = format!("{r}");
        if !s.contains('.') {
            s.push_str(".0");
        }
        s
    }
}

/// Examiner-facing flag detection. Ported from `flagged-issues.js`.
pub fn detect_additional_flags(
    data: &AssessmentData,
    grading: &GradingResult,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let safety_critical = data.role_play1.safety_criticality == "high"
        || data.role_play2.safety_criticality == "high";

    // ─── Grade-band flags ────────────────────────────────────────────
    if grading.grade == "E" || grading.grade == "D" {
        flags.push(AdditionalFlag {
            id: "FLAG-GRADE-001".to_string(),
            category: "Overall Grade".to_string(),
            message: format!(
                "Grade {} ({}/500) \u{2014} well below typical clinical registration threshold; remediation required before clinical practice.",
                grading.grade, grading.scaled_score
            ),
            priority: "high".to_string(),
        });
    } else if grading.grade == "C" {
        flags.push(AdditionalFlag {
            id: "FLAG-GRADE-002".to_string(),
            category: "Overall Grade".to_string(),
            message: format!(
                "Grade C ({}/500) \u{2014} below typical clinical registration threshold (Grade B); targeted preparation recommended.",
                grading.scaled_score
            ),
            priority: "medium".to_string(),
        });
    } else if grading.grade == "C+" {
        flags.push(AdditionalFlag {
            id: "FLAG-GRADE-003".to_string(),
            category: "Overall Grade".to_string(),
            message: format!(
                "Grade C+ ({}/500) \u{2014} borderline; just below the typical Grade B clinical threshold.",
                grading.scaled_score
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Critical linguistic floor: intelligibility ──────────────────
    let intel_low = lowest_linguistic(data, |r| r.intelligibility);
    if let Some(v) = intel_low {
        if v <= 2.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-INT-001".to_string(),
                category: "Intelligibility".to_string(),
                message: format!(
                    "Intelligibility rated {}/6 in at least one role-play \u{2014} patient comprehension at risk; intelligibility is a clinical-safety concern.",
                    fmt_num(v)
                ),
                priority: "high".to_string(),
            });
        } else if (v - 3.0).abs() < f64::EPSILON {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-INT-002".to_string(),
                category: "Intelligibility".to_string(),
                message: "Intelligibility rated 3/6 \u{2014} acceptable but with regular lapses; pronunciation work recommended.".to_string(),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Fluency ─────────────────────────────────────────────────────
    let fluency_low = lowest_linguistic(data, |r| r.fluency);
    if let Some(v) = fluency_low {
        if v <= 3.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-FLU-001".to_string(),
                category: "Fluency".to_string(),
                message: format!(
                    "Fluency rated {}/6 in at least one role-play \u{2014} hesitation likely to disrupt the consultation flow.",
                    fmt_num(v)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Appropriateness of language ─────────────────────────────────
    let app_low = lowest_linguistic(data, |r| r.appropriateness_of_language);
    if let Some(v) = app_low {
        if v <= 2.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-APP-001".to_string(),
                category: "Appropriateness of Language".to_string(),
                message: format!(
                    "Appropriateness of Language rated {}/6 \u{2014} register or jargon unsuitable for patient-facing communication.",
                    fmt_num(v)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Grammar & expression ────────────────────────────────────────
    let grm_low = lowest_linguistic(data, |r| r.resources_of_grammar_and_expression);
    if let Some(v) = grm_low {
        if v <= 2.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-GRM-001".to_string(),
                category: "Resources of Grammar & Expression".to_string(),
                message: format!(
                    "Grammar & Expression rated {}/6 \u{2014} limited range may compromise the precision of clinical questions.",
                    fmt_num(v)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Clinical communication critical failures ────────────────────
    let critical_indicators: [(&str, &str); 5] = [
        ("relationshipBuilding", "Relationship-building"),
        ("understandingPatientPerspective", "Understanding patient\u{2019}s perspective"),
        ("providingStructure", "Providing structure"),
        ("informationGathering", "Information-gathering"),
        ("informationGiving", "Information-giving"),
    ];

    for (field, label) in critical_indicators {
        let v = match ci_get(&data.clinical_indicators, field) {
            Some(v) => v,
            None => continue,
        };
        if (v - 0.0).abs() < f64::EPSILON {
            let suffix = if safety_critical {
                "; in a high-stakes scenario this is a clinical-safety failure"
            } else {
                ""
            };
            flags.push(AdditionalFlag {
                id: format!("FLAG-CLIN-{field}-0"),
                category: "Clinical Communication".to_string(),
                message: format!(
                    "{label} rated 0/3 \u{2014} indicator not demonstrated{suffix}."
                ),
                priority: if safety_critical { "high".to_string() } else { "medium".to_string() },
            });
        } else if (v - 1.0).abs() < f64::EPSILON {
            flags.push(AdditionalFlag {
                id: format!("FLAG-CLIN-{field}-1"),
                category: "Clinical Communication".to_string(),
                message: format!(
                    "{label} rated 1/3 \u{2014} only partially demonstrated; targeted coaching recommended."
                ),
                priority: "medium".to_string(),
            });
        } else if (v - 2.0).abs() < f64::EPSILON {
            flags.push(AdditionalFlag {
                id: format!("FLAG-CLIN-{field}-2"),
                category: "Clinical Communication".to_string(),
                message: format!(
                    "{label} rated 2/3 \u{2014} satisfactory with room to improve."
                ),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Single low linguistic criterion (otherwise strong) ──────────
    if grading.grade == "A" || grading.grade == "B" {
        for s in grading.per_criterion_scores.iter() {
            if s.domain == "linguistic" {
                if let Some(m) = s.mean_score {
                    if m <= 3.0 {
                        flags.push(AdditionalFlag {
                            id: format!("FLAG-LING-LOW-{}", s.id),
                            category: "Improvement Area".to_string(),
                            message: format!(
                                "{} mean {}/6 \u{2014} below the candidate\u{2019}s overall standard; isolate and rehearse this area.",
                                s.label,
                                fmt_num(m)
                            ),
                            priority: "medium".to_string(),
                        });
                    }
                }
            }
        }
    }

    // ─── Imbalance between role-plays ────────────────────────────────
    for s in grading.per_criterion_scores.iter() {
        if s.domain != "linguistic" {
            continue;
        }
        if let (Some(a), Some(b)) = (s.role_play1_score, s.role_play2_score) {
            if (a - b).abs() >= 2.0 {
                flags.push(AdditionalFlag {
                    id: format!("FLAG-RP-DIFF-{}", s.id),
                    category: "Role-play Variability".to_string(),
                    message: format!(
                        "{}: {}/6 in role-play 1 vs {}/6 in role-play 2 \u{2014} performance varied with the scenario type.",
                        s.label, fmt_num(a), fmt_num(b)
                    ),
                    priority: "low".to_string(),
                });
            }
        }
    }

    // ─── Examiner notes present ──────────────────────────────────────
    if !data.role_play1.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTES-RP1".to_string(),
            category: "Examiner Notes".to_string(),
            message: "Examiner provided narrative comments on role-play 1.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !data.role_play2.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTES-RP2".to_string(),
            category: "Examiner Notes".to_string(),
            message: "Examiner provided narrative comments on role-play 2.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !data.clinical_indicators.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTES-CLIN".to_string(),
            category: "Examiner Notes".to_string(),
            message: "Examiner provided narrative comments on clinical communication.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| priority_rank(&f.priority));

    flags
}
