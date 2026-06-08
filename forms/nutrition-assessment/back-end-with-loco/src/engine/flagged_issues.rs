//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect clinician-facing safety flags independently of the MUST score.
/// Flags cover BMI extremes, significant weight loss, swallowing difficulty
/// / choking, poor intake, GI symptoms, food allergies / anaphylaxis,
/// dehydration, parenteral / enteral feeding, and missing dietician review.
///
/// Sort order: urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let anthro = &data.anthropometric_measurements;
    let screen = &data.nutritional_screening;
    let diet = &data.dietary_history;
    let swal = &data.swallowing_oral_health;
    let gi = &data.gastrointestinal_function;
    let allergies = &data.food_allergies_intolerances;
    let support = &data.current_nutritional_support;

    // ─── BMI alerts ───────────────────────────────────────────
    if let Some(bmi) = anthro.bmi {
        if bmi < 16.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-001".to_string(),
                category: "Anthropometrics".to_string(),
                message: format!(
                    "BMI {bmi} - severe underweight (<16); urgent dietetic review recommended."
                ),
                priority: "urgent".to_string(),
            });
        } else if bmi < 18.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-002".to_string(),
                category: "Anthropometrics".to_string(),
                message: format!("BMI {bmi} - underweight (<18.5)."),
                priority: "high".to_string(),
            });
        } else if bmi >= 40.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-003".to_string(),
                category: "Anthropometrics".to_string(),
                message: format!("BMI {bmi} - obese class III."),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Weight-loss alerts ───────────────────────────────────
    if let Some(pct) = anthro.weight_loss_percent {
        if pct > 15.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-WL-001".to_string(),
                category: "Weight Loss".to_string(),
                message: format!(
                    "{pct}% unplanned weight loss - severe loss; urgent assessment recommended."
                ),
                priority: "urgent".to_string(),
            });
        } else if pct > 10.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-WL-002".to_string(),
                category: "Weight Loss".to_string(),
                message: format!(
                    "{pct}% unplanned weight loss in the past 3-6 months."
                ),
                priority: "high".to_string(),
            });
        } else if pct >= 5.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-WL-003".to_string(),
                category: "Weight Loss".to_string(),
                message: format!(
                    "{pct}% unplanned weight loss in the past 3-6 months."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── MUST acute disease ───────────────────────────────────
    if screen.acute_disease == "acutely-ill-no-intake-5d" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACUTE-001".to_string(),
            category: "Acute Illness".to_string(),
            message:
                "Acutely ill with no nutritional intake for >5 days - immediate intervention indicated."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Reduced intake / poor appetite ───────────────────────
    if diet.appetite_decreased == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-INTAKE-001".to_string(),
            category: "Dietary Intake".to_string(),
            message: "Decreased appetite reported.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if diet.food_intake_reduced == "yes"
        && diet.reduced_intake_days.map(|d| d > 5).unwrap_or(false)
    {
        let days = diet.reduced_intake_days.unwrap_or(0);
        flags.push(AdditionalFlag {
            id: "FLAG-INTAKE-002".to_string(),
            category: "Dietary Intake".to_string(),
            message: format!("Reduced food intake for {days} days - escalating concern."),
            priority: "high".to_string(),
        });
    } else if diet.food_intake_reduced == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-INTAKE-003".to_string(),
            category: "Dietary Intake".to_string(),
            message: "Reduced food intake reported.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Hydration ────────────────────────────────────────────
    if diet.fluid_intake_adequate == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-HYDR-001".to_string(),
            category: "Hydration".to_string(),
            message: "Inadequate fluid intake reported - dehydration risk.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Swallowing alerts ────────────────────────────────────
    if swal.choking_episodes == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SWAL-001".to_string(),
            category: "Swallowing".to_string(),
            message:
                "Choking episodes reported - urgent SLT (speech and language therapy) referral."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }
    if swal.swallowing_difficulty == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SWAL-002".to_string(),
            category: "Swallowing".to_string(),
            message:
                "Difficulty swallowing - assess dysphagia and texture-modified diet need."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if swal.coughing_while_eating == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SWAL-003".to_string(),
            category: "Swallowing".to_string(),
            message: "Coughing while eating - possible aspiration risk.".to_string(),
            priority: "high".to_string(),
        });
    }
    if swal.denture_use == "yes" && swal.dentures_fit_well == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ORAL-001".to_string(),
            category: "Oral Health".to_string(),
            message: "Ill-fitting dentures - may compromise food intake.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if swal.mouth_sores == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ORAL-002".to_string(),
            category: "Oral Health".to_string(),
            message: "Mouth sores reported - may limit oral intake.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── GI symptom alerts ────────────────────────────────────
    if gi.vomiting == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GI-001".to_string(),
            category: "Gastrointestinal".to_string(),
            message: "Vomiting reported - assess hydration and intake.".to_string(),
            priority: "high".to_string(),
        });
    }
    if gi.diarrhea == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GI-002".to_string(),
            category: "Gastrointestinal".to_string(),
            message: "Diarrhoea reported - hydration and electrolyte risk.".to_string(),
            priority: "high".to_string(),
        });
    }
    if gi.nausea == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GI-003".to_string(),
            category: "Gastrointestinal".to_string(),
            message: "Nausea reported - may limit oral intake.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if gi.constipation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GI-004".to_string(),
            category: "Gastrointestinal".to_string(),
            message: "Constipation reported - review fluid and fibre intake.".to_string(),
            priority: "low".to_string(),
        });
    }
    if gi.earlysatiety == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GI-005".to_string(),
            category: "Gastrointestinal".to_string(),
            message: "Early satiety reported - may limit total daily intake.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Allergy alerts ───────────────────────────────────────
    for (i, a) in allergies.food_allergies.iter().enumerate() {
        if a.severity == "anaphylaxis" {
            let allergen = if a.allergen.trim().is_empty() {
                "(allergen not specified)".to_string()
            } else {
                a.allergen.clone()
            };
            flags.push(AdditionalFlag {
                id: format!("FLAG-ALLERGY-ANAPH-{i}"),
                category: "Food Allergy".to_string(),
                message: format!("ANAPHYLAXIS history: {allergen}."),
                priority: "urgent".to_string(),
            });
        }
    }
    if !allergies.food_allergies.is_empty() {
        let n = allergies.food_allergies.len();
        flags.push(AdditionalFlag {
            id: "FLAG-ALLERGY-001".to_string(),
            category: "Food Allergy".to_string(),
            message: format!("{n} food allergy/allergies documented."),
            priority: "medium".to_string(),
        });
    }

    // ─── Nutritional support alerts ───────────────────────────
    if support.parenteral_nutrition == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-001".to_string(),
            category: "Nutritional Support".to_string(),
            message: "Currently receiving parenteral nutrition - close monitoring required."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if support.enteral_feeding == "yes" {
        let route = if support.enteral_route.trim().is_empty() {
            "route not specified".to_string()
        } else {
            support.enteral_route.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-002".to_string(),
            category: "Nutritional Support".to_string(),
            message: format!("Currently on enteral feeding ({route})."),
            priority: "medium".to_string(),
        });
    }
    if support.dietician_involvement == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-003".to_string(),
            category: "Nutritional Support".to_string(),
            message: "No current dietician involvement - referral may be indicated.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Alcohol alerts ───────────────────────────────────────
    if diet.alcohol_use == "yes"
        && diet
            .alcohol_units_per_week
            .map(|u| u > 14)
            .unwrap_or(false)
    {
        let units = diet.alcohol_units_per_week.unwrap_or(0);
        flags.push(AdditionalFlag {
            id: "FLAG-ALC-001".to_string(),
            category: "Lifestyle".to_string(),
            message: format!(
                "Alcohol intake {units} units/week - exceeds low-risk guidance (14 units/week)."
            ),
            priority: "medium".to_string(),
        });
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
