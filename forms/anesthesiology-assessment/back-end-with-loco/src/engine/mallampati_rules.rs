//! Mallampati rules module.

// Mallampati / Airway difficulty risk rules.
//
// Inputs: Mallampati class, mouth opening (cm), thyromental distance (cm),
// neck mobility, dentition, jaw protrusion, and difficult-intubation
// history (from Step 6 — Previous Anaesthesia).
//
// MALL-001  Mallampati class III              -> medium-risk factor
// MALL-002  Mallampati class IV               -> high risk
// MALL-003  Mouth opening <3cm                -> medium-risk factor
// MALL-004  Thyromental <6.5cm                -> medium-risk factor
// MALL-005  Limited neck mobility             -> medium-risk factor
// MALL-006  Loose teeth or prominent incisors -> medium-risk factor
// MALL-007  Jaw protrusion limited            -> medium-risk factor
// MALL-008  Difficult intubation history      -> high risk
//
// Composition:
//   - Mallampati IV OR difficult-intubation history -> high
//   - >= 2 medium factors -> high
//   - any single medium factor -> medium
//   - otherwise -> low

use super::types::{AirwayResult, AssessmentData, FiredRule};

/// Friendly label for a Mallampati class.
pub fn mallampati_label(class: &str) -> String {
    match class {
        "i" => "Mallampati Class I".to_string(),
        "ii" => "Mallampati Class II".to_string(),
        "iii" => "Mallampati Class III".to_string(),
        "iv" => "Mallampati Class IV".to_string(),
        _ => String::new(),
    }
}

/// Evaluate airway.
pub fn evaluate_airway(d: &AssessmentData) -> AirwayResult {
    let ex = &d.physical_exam;
    let prev = &d.previous_anaesthesia;
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut high_risk = false;
    let mut medium_count: u32 = 0;

    if ex.mallampati_class == "iv" {
        high_risk = true;
        fired_rules.push(FiredRule {
            id: "MALL-002".to_string(),
            category: "Airway".to_string(),
            description: "Mallampati Class IV — high airway difficulty risk.".to_string(),
            risk_level: "high".to_string(),
        });
    } else if ex.mallampati_class == "iii" {
        medium_count += 1;
        fired_rules.push(FiredRule {
            id: "MALL-001".to_string(),
            category: "Airway".to_string(),
            description: "Mallampati Class III — moderate airway difficulty risk factor.".to_string(),
            risk_level: "medium".to_string(),
        });
    }

    if prev.difficult_intubation {
        high_risk = true;
        fired_rules.push(FiredRule {
            id: "MALL-008".to_string(),
            category: "Airway".to_string(),
            description: "Previous difficult intubation — high airway difficulty risk.".to_string(),
            risk_level: "high".to_string(),
        });
    }

    if let Some(mo) = ex.mouth_opening
        && mo < 3.0
    {
        medium_count += 1;
        fired_rules.push(FiredRule {
            id: "MALL-003".to_string(),
            category: "Airway".to_string(),
            description: format!("Mouth opening {mo} cm (<3cm) — limited oral access."),
            risk_level: "medium".to_string(),
        });
    }

    if let Some(td) = ex.thyromental_distance
        && td < 6.5
    {
        medium_count += 1;
        fired_rules.push(FiredRule {
            id: "MALL-004".to_string(),
            category: "Airway".to_string(),
            description: format!(
                "Thyromental distance {td} cm (<6.5cm) — anterior larynx risk."
            ),
            risk_level: "medium".to_string(),
        });
    }

    if ex.neck_mobility == "limited" || ex.neck_mobility == "fixed" {
        medium_count += 1;
        let risk = if ex.neck_mobility == "fixed" {
            "high"
        } else {
            "medium"
        };
        fired_rules.push(FiredRule {
            id: "MALL-005".to_string(),
            category: "Airway".to_string(),
            description: format!(
                "Neck mobility {} — restricted laryngoscopy.",
                ex.neck_mobility
            ),
            risk_level: risk.to_string(),
        });
        if ex.neck_mobility == "fixed" {
            high_risk = true;
        }
    }

    if ex.dentition_loose_teeth || ex.dentition_prominent_incisors {
        medium_count += 1;
        let mut parts: Vec<&str> = Vec::new();
        if ex.dentition_loose_teeth {
            parts.push("loose teeth");
        }
        if ex.dentition_prominent_incisors {
            parts.push("prominent incisors");
        }
        let detail = parts.join(" and ");
        fired_rules.push(FiredRule {
            id: "MALL-006".to_string(),
            category: "Airway".to_string(),
            description: format!("Adverse dentition ({detail}) — care during intubation."),
            risk_level: "medium".to_string(),
        });
    }

    if ex.jaw_protrusion == "limited" {
        medium_count += 1;
        fired_rules.push(FiredRule {
            id: "MALL-007".to_string(),
            category: "Airway".to_string(),
            description: "Limited jaw protrusion — reduced laryngoscopic view.".to_string(),
            risk_level: "medium".to_string(),
        });
    }

    let risk_level = if high_risk || medium_count >= 2 {
        "high"
    } else if medium_count >= 1 {
        "medium"
    } else {
        "low"
    };

    AirwayResult {
        mallampati_class: ex.mallampati_class.clone(),
        medium_factors: medium_count,
        risk_level: risk_level.to_string(),
        fired_rules,
    }
}
