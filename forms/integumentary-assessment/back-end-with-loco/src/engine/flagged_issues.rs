//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::calculate_wound_area;

/// Detect clinician-facing flags computed independently of the Braden total:
/// pressure-ulcer staging, wound infection / necrotic tissue, alarm-priority
/// alerts, Braden subscale thresholds, undernutrition, incontinence-driven
/// moisture, skin / hair / nail findings, presenting-concern severity,
/// photographic-consent gaps, and missing referral details.
///
/// Priority sort order: urgent > high > medium > low. Flag IDs are
/// preserved verbatim from the reference JavaScript engine.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Wound assessment alerts ──────────────────────────────
    if data.wound_assessment.wound_present == "yes" {
        if data.wound_assessment.wound_stage == "stage-iv"
            || data.wound_assessment.wound_stage == "unstageable"
        {
            let label = if data.wound_assessment.wound_stage == "unstageable" {
                "unstageable"
            } else {
                "stage IV"
            };
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-001".to_string(),
                category: "Wound".to_string(),
                message: format!(
                    "Pressure injury {label} — urgent tissue-viability review."
                ),
                priority: "urgent".to_string(),
            });
        } else if data.wound_assessment.wound_stage == "stage-iii" {
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-002".to_string(),
                category: "Wound".to_string(),
                message:
                    "Stage III pressure injury — full-thickness skin loss; specialist wound care required."
                        .to_string(),
                priority: "high".to_string(),
            });
        } else if data.wound_assessment.wound_stage == "deep-tissue-injury" {
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-003".to_string(),
                category: "Wound".to_string(),
                message: "Deep tissue pressure injury — high-risk evolution to stage III/IV."
                    .to_string(),
                priority: "high".to_string(),
            });
        }

        if data.wound_assessment.tissue_type == "necrotic"
            || data.wound_assessment.tissue_type == "eschar"
        {
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-004".to_string(),
                category: "Wound".to_string(),
                message: "Necrotic tissue / eschar present — debridement may be indicated."
                    .to_string(),
                priority: "high".to_string(),
            });
        }

        if data.wound_assessment.infection_signs == "yes" {
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-005".to_string(),
                category: "Wound".to_string(),
                message:
                    "Clinical signs of wound infection — consider swab and antimicrobial review."
                        .to_string(),
                priority: "urgent".to_string(),
            });
        }

        if data.wound_assessment.wound_odour == "strong"
            || data.wound_assessment.wound_odour == "foul"
        {
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-006".to_string(),
                category: "Wound".to_string(),
                message: "Strong / foul wound odour — possible anaerobic infection.".to_string(),
                priority: "high".to_string(),
            });
        }

        if data.wound_assessment.exudate_amount == "heavy" {
            flags.push(AdditionalFlag {
                id: "FLAG-WOUND-007".to_string(),
                category: "Wound".to_string(),
                message: "Heavy wound exudate — review absorbent dressing strategy.".to_string(),
                priority: "medium".to_string(),
            });
        }

        if let Some(area) = calculate_wound_area(
            data.wound_assessment.wound_length,
            data.wound_assessment.wound_width,
        ) {
            if area >= 25.0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-WOUND-008".to_string(),
                    category: "Wound".to_string(),
                    message: format!(
                        "Large wound area ({area} cm²) — escalate to tissue-viability nurse."
                    ),
                    priority: "high".to_string(),
                });
            }
        }
    }

    // ─── Braden subscale alerts ───────────────────────────────
    let b = &data.braden_scale;
    if matches!(b.sensory_perception, Some(v) if v <= 2) {
        flags.push(AdditionalFlag {
            id: "FLAG-BRADEN-001".to_string(),
            category: "Braden — Sensory".to_string(),
            message:
                "Severely limited sensory perception — patient may not feel pressure-related discomfort."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if matches!(b.moisture, Some(v) if v <= 2) {
        flags.push(AdditionalFlag {
            id: "FLAG-BRADEN-002".to_string(),
            category: "Braden — Moisture".to_string(),
            message: "Skin frequently moist — incontinence / perspiration management required."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if matches!(b.activity, Some(v) if v <= 2) {
        flags.push(AdditionalFlag {
            id: "FLAG-BRADEN-003".to_string(),
            category: "Braden — Activity".to_string(),
            message: "Bedfast or chairfast — implement repositioning schedule.".to_string(),
            priority: "high".to_string(),
        });
    }
    if matches!(b.mobility, Some(v) if v <= 2) {
        flags.push(AdditionalFlag {
            id: "FLAG-BRADEN-004".to_string(),
            category: "Braden — Mobility".to_string(),
            message: "Very limited mobility — pressure-redistribution surface indicated."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if matches!(b.nutrition, Some(v) if v <= 2) {
        flags.push(AdditionalFlag {
            id: "FLAG-BRADEN-005".to_string(),
            category: "Braden — Nutrition".to_string(),
            message: "Probably-inadequate nutrition — dietitian referral recommended.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if matches!(b.friction_shear, Some(v) if v == 1) {
        flags.push(AdditionalFlag {
            id: "FLAG-BRADEN-006".to_string(),
            category: "Braden — Friction & Shear".to_string(),
            message:
                "Significant friction/shear problem — review transfer technique and bed surface."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Skin inspection alerts ───────────────────────────────
    if data.skin_inspection.integrity == "breakdown"
        || data.skin_inspection.integrity == "open-lesions"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-001".to_string(),
            category: "Skin Integrity".to_string(),
            message: "Skin breakdown / open lesions identified on inspection.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.skin_inspection.turgor == "tenting" || data.skin_inspection.turgor == "poor" {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-002".to_string(),
            category: "Skin Turgor".to_string(),
            message: "Reduced skin turgor — assess hydration status.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.skin_inspection.colour == "jaundiced" {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-003".to_string(),
            category: "Skin Colour".to_string(),
            message: "Jaundice noted — investigate hepatobiliary cause.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.skin_inspection.colour == "cyanotic" {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-004".to_string(),
            category: "Skin Colour".to_string(),
            message: "Cyanosis noted — assess oxygenation urgently.".to_string(),
            priority: "urgent".to_string(),
        });
    }
    if data
        .skin_inspection
        .lesion_types
        .iter()
        .any(|l| l == "ulcer")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-005".to_string(),
            category: "Lesions".to_string(),
            message: "Ulcerative lesion present — characterise and document carefully."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data
        .skin_inspection
        .lesion_types
        .iter()
        .any(|l| l == "suspicious-pigmented")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SKIN-006".to_string(),
            category: "Lesions".to_string(),
            message:
                "Suspicious pigmented lesion — consider dermatology referral for ABCDE evaluation."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Hair / scalp alerts ──────────────────────────────────
    if data.hair_scalp_examination.alopecia == "yes" {
        let pattern = data.hair_scalp_examination.alopecia_pattern.trim();
        let msg = if pattern.is_empty() {
            "Alopecia present — consider underlying cause.".to_string()
        } else {
            format!("Alopecia present ({pattern}) — consider underlying cause.")
        };
        flags.push(AdditionalFlag {
            id: "FLAG-HAIR-001".to_string(),
            category: "Hair".to_string(),
            message: msg,
            priority: "low".to_string(),
        });
    }
    if data
        .hair_scalp_examination
        .scalp_findings
        .iter()
        .any(|f| f == "lice")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-HAIR-002".to_string(),
            category: "Scalp".to_string(),
            message: "Pediculosis (head lice) identified — treat and inform contacts.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Nail alerts ──────────────────────────────────────────
    if data
        .nail_examination
        .nail_findings
        .iter()
        .any(|f| f == "clubbing")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-NAIL-001".to_string(),
            category: "Nails".to_string(),
            message: "Nail clubbing — investigate cardiopulmonary cause.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data
        .nail_examination
        .nail_findings
        .iter()
        .any(|f| f == "koilonychia")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-NAIL-002".to_string(),
            category: "Nails".to_string(),
            message: "Koilonychia (spoon nails) — investigate iron-deficiency anaemia.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.nail_examination.nail_capillary_refill == "sluggish"
        || data.nail_examination.nail_capillary_refill == "absent"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-NAIL-003".to_string(),
            category: "Nails".to_string(),
            message: "Sluggish/absent capillary refill — assess peripheral perfusion.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Presenting concern alerts ───────────────────────────
    if data.presenting_skin_concern.bleeding == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONCERN-001".to_string(),
            category: "Presenting Concern".to_string(),
            message: "Active bleeding from skin lesion reported.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.presenting_skin_concern.discharge == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONCERN-002".to_string(),
            category: "Presenting Concern".to_string(),
            message: "Discharge from skin lesion reported — consider infection.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if matches!(data.presenting_skin_concern.pain_score, Some(v) if v >= 7) {
        let n = data.presenting_skin_concern.pain_score.unwrap();
        flags.push(AdditionalFlag {
            id: "FLAG-CONCERN-003".to_string(),
            category: "Pain".to_string(),
            message: format!("Severe pain ({n}/10) — analgesia review required."),
            priority: "high".to_string(),
        });
    }

    // ─── Documentation alerts ────────────────────────────────
    if data.photography_documentation.photos_taken == "yes"
        && data.photography_documentation.consent_obtained != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DOC-001".to_string(),
            category: "Documentation".to_string(),
            message:
                "Photographs taken without documented consent — review information-governance policy."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Care-plan alerts ────────────────────────────────────
    if data.clinical_impression_care_plan.referral_required == "yes"
        && data
            .clinical_impression_care_plan
            .referral_details
            .trim()
            .is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-PLAN-001".to_string(),
            category: "Care Plan".to_string(),
            message: "Referral required but no referral details recorded.".to_string(),
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
