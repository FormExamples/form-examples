//! Detection of additional flagged issues.

// Flagged-issue detection. Pure port of
// `front-end-form-with-html/js/flagged-issues.js`. All flag IDs preserved verbatim.

use super::types::{AdditionalFlag, AssessmentData, GradingResult, LinguisticRating};

/// Lowest non-None value across the two role-plays for the given linguistic
/// field. Returns None when neither role-play has a rating.
fn lowest_linguistic(data: &AssessmentData, f: fn(&LinguisticRating) -> Option<i32>) -> Option<i32> {
    let a = f(&data.linguistic_role_play1);
    let b = f(&data.linguistic_role_play2);
    match (a, b) {
        (None, None) => None,
        (None, Some(y)) => Some(y),
        (Some(x), None) => Some(x),
        (Some(x), Some(y)) => Some(x.min(y)),
    }
}

/// Emit the examiner-facing flag catalogue for this assessment.
/// Sorted high -> medium -> low (stable on insertion order within band).
pub fn detect_additional_flags(
    data: &AssessmentData,
    grading: &GradingResult,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let safety_critical = data.role_play1.safety_criticality == "high"
        || data.role_play2.safety_criticality == "high";

    // ─── Grade-band flags ──────────────────────────────────────
    if grading.grade == "E" || grading.grade == "D" {
        flags.push(AdditionalFlag {
            id: "FLAG-GRADE-001".to_string(),
            category: "Overall Grade".to_string(),
            message: format!(
                "Grade {} ({}/500) — well below the typical Welsh-medium clinical threshold (NHS Wales Welsh-essential roles); remediation required before Welsh-medium clinical practice.",
                grading.grade, grading.scaled_score
            ),
            priority: "high".to_string(),
        });
    } else if grading.grade == "C" {
        flags.push(AdditionalFlag {
            id: "FLAG-GRADE-002".to_string(),
            category: "Overall Grade".to_string(),
            message: format!(
                "Grade C ({}/500) — below the typical Welsh-medium clinical threshold (Grade B / CEFR C1); targeted Welsh-language preparation recommended.",
                grading.scaled_score
            ),
            priority: "medium".to_string(),
        });
    } else if grading.grade == "C+" {
        flags.push(AdditionalFlag {
            id: "FLAG-GRADE-003".to_string(),
            category: "Overall Grade".to_string(),
            message: format!(
                "Grade C+ ({}/500) — borderline; just below the typical Grade B (CEFR C1) Welsh-medium clinical threshold.",
                grading.scaled_score
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Critical linguistic floor: pronunciation ──────────────
    if let Some(p) = lowest_linguistic(data, |r| r.pronunciation) {
        if p <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-PRO-001".to_string(),
                category: "Pronunciation (Ynganu)".to_string(),
                message: format!(
                    "Pronunciation rated {}/6 in at least one role-play — Welsh-speaking patient comprehension at risk; pronunciation (including ll, ch, rh and the mutations) is a clinical-safety concern.",
                    p
                ),
                priority: "high".to_string(),
            });
        } else if p == 3 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-PRO-002".to_string(),
                category: "Pronunciation (Ynganu)".to_string(),
                message: "Pronunciation rated 3/6 — acceptable but with regular lapses; targeted Welsh phonology work recommended.".to_string(),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Fluency ───────────────────────────────────────────────
    if let Some(f) = lowest_linguistic(data, |r| r.fluency) {
        if f <= 3 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-FLU-001".to_string(),
                category: "Fluency (Rhuglder)".to_string(),
                message: format!(
                    "Fluency rated {}/6 in at least one role-play — hesitation in Welsh likely to disrupt the consultation flow.",
                    f
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Grammar (treigladau / mutations etc.) ─────────────────
    if let Some(g) = lowest_linguistic(data, |r| r.grammar) {
        if g <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-GRM-001".to_string(),
                category: "Grammar (Gramadeg)".to_string(),
                message: format!(
                    "Grammar rated {}/6 — limited control of Welsh grammar (including mutations / treigladau) may compromise the precision of clinical questions.",
                    g
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Clinical appropriateness ──────────────────────────────
    if let Some(a) = lowest_linguistic(data, |r| r.clinical_appropriateness) {
        if a <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-LING-APP-001".to_string(),
                category: "Clinical Appropriateness (Priodoldeb Clinigol)".to_string(),
                message: format!(
                    "Clinical Appropriateness rated {}/6 — register or vocabulary unsuitable for Welsh-medium patient-facing communication.",
                    a
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Clinical communication critical failures ─────────────
    let ci = &data.clinical_indicators;
    let critical_indicators: [(&str, &str, Option<i32>); 5] = [
        (
            "relationshipBuilding",
            "Relationship-building",
            ci.relationship_building,
        ),
        (
            "understandingPatientPerspective",
            "Understanding patient's perspective",
            ci.understanding_patient_perspective,
        ),
        (
            "providingStructure",
            "Providing structure",
            ci.providing_structure,
        ),
        (
            "informationGathering",
            "Information-gathering",
            ci.information_gathering,
        ),
        (
            "informationGiving",
            "Information-giving",
            ci.information_giving,
        ),
    ];

    for (field, label, value) in critical_indicators.iter() {
        match value {
            None => continue,
            Some(0) => {
                let suffix = if safety_critical {
                    "; in a high-stakes Welsh-medium scenario this is a clinical-safety failure"
                } else {
                    ""
                };
                flags.push(AdditionalFlag {
                    id: format!("FLAG-CLIN-{}-0", field),
                    category: "Clinical Communication".to_string(),
                    message: format!("{} rated 0/3 — indicator not demonstrated{}.", label, suffix),
                    priority: if safety_critical { "high" } else { "medium" }.to_string(),
                });
            }
            Some(1) => {
                flags.push(AdditionalFlag {
                    id: format!("FLAG-CLIN-{}-1", field),
                    category: "Clinical Communication".to_string(),
                    message: format!(
                        "{} rated 1/3 — only partially demonstrated; targeted coaching recommended.",
                        label
                    ),
                    priority: "medium".to_string(),
                });
            }
            Some(2) => {
                flags.push(AdditionalFlag {
                    id: format!("FLAG-CLIN-{}-2", field),
                    category: "Clinical Communication".to_string(),
                    message: format!("{} rated 2/3 — satisfactory with room to improve.", label),
                    priority: "low".to_string(),
                });
            }
            _ => {}
        }
    }

    // ─── Single low linguistic criterion (otherwise strong) ────
    if grading.grade == "B" || grading.grade == "A" {
        for s in grading
            .per_criterion_scores
            .iter()
            .filter(|s| s.domain == "linguistic")
        {
            if let Some(m) = s.mean_score {
                if m <= 3.0 {
                    flags.push(AdditionalFlag {
                        id: format!("FLAG-LING-LOW-{}", s.id),
                        category: "Improvement Area".to_string(),
                        message: format!(
                            "{} mean {}/6 — below the candidate's overall standard; isolate and rehearse this area in Welsh.",
                            s.label, m
                        ),
                        priority: "medium".to_string(),
                    });
                }
            }
        }
    }

    // ─── Imbalance between role-plays ──────────────────────────
    for d in grading.per_criterion_scores.iter().filter(|s| {
        s.domain == "linguistic"
            && s.role_play1_score.is_some()
            && s.role_play2_score.is_some()
            && (s.role_play1_score.unwrap() - s.role_play2_score.unwrap()).abs() >= 2.0
    }) {
        flags.push(AdditionalFlag {
            id: format!("FLAG-RP-DIFF-{}", d.id),
            category: "Role-play Variability".to_string(),
            message: format!(
                "{}: {}/6 in role-play 1 vs {}/6 in role-play 2 — Welsh-language performance varied with the scenario type.",
                d.label,
                d.role_play1_score.unwrap(),
                d.role_play2_score.unwrap()
            ),
            priority: "low".to_string(),
        });
    }

    // ─── Examiner notes present ────────────────────────────────
    if !data.role_play1.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTES-RP1".to_string(),
            category: "Examiner Notes".to_string(),
            message: "Examiner provided narrative comments on role-play 1 (Sgwrs gyda Chlaf)."
                .to_string(),
            priority: "low".to_string(),
        });
    }
    if !data.role_play2.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTES-RP2".to_string(),
            category: "Examiner Notes".to_string(),
            message: "Examiner provided narrative comments on role-play 2 (Esboniad Clinigol)."
                .to_string(),
            priority: "low".to_string(),
        });
    }
    if !ci.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTES-CLIN".to_string(),
            category: "Examiner Notes".to_string(),
            message: "Examiner provided narrative comments on clinical communication.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low (stable).
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
