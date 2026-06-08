//! Snot22 rules module.

use super::types::AssessmentData;

/// One SNOT-22 rule. Each rule reads a single questionnaire item, returning
/// (score, answered). `answered = false` indicates the patient left the item
/// blank (Option::None) -- it does not contribute to the total.
pub struct Snot22Rule {
    /// ID.
    pub id: &'static str,
    /// Key.
    pub key: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> (i32, bool),
}

fn val(v: Option<i32>) -> (i32, bool) {
    match v {
        Some(n) => (n, true),
        None => (0, false),
    }
}

/// Build the full SNOT-22 rule list (22 items, IDs `SNOT22-001`..`SNOT22-022`).
/// Rule IDs and item ordering mirror the front-end engine verbatim.
pub fn all_rules() -> Vec<Snot22Rule> {
    vec![
        Snot22Rule {
            id: "SNOT22-001",
            key: "needToBlowNose",
            category: "SNOT-22",
            description: "Need to blow nose",
            evaluate: |d| val(d.snot22.need_to_blow_nose),
        },
        Snot22Rule {
            id: "SNOT22-002",
            key: "sneezing",
            category: "SNOT-22",
            description: "Sneezing",
            evaluate: |d| val(d.snot22.sneezing),
        },
        Snot22Rule {
            id: "SNOT22-003",
            key: "runnyNose",
            category: "SNOT-22",
            description: "Runny nose",
            evaluate: |d| val(d.snot22.runny_nose),
        },
        Snot22Rule {
            id: "SNOT22-004",
            key: "nasalBlockage",
            category: "SNOT-22",
            description: "Nasal blockage",
            evaluate: |d| val(d.snot22.nasal_blockage),
        },
        Snot22Rule {
            id: "SNOT22-005",
            key: "lossOfSmellTaste",
            category: "SNOT-22",
            description: "Loss of smell or taste",
            evaluate: |d| val(d.snot22.loss_of_smell_taste),
        },
        Snot22Rule {
            id: "SNOT22-006",
            key: "coughing",
            category: "SNOT-22",
            description: "Cough",
            evaluate: |d| val(d.snot22.coughing),
        },
        Snot22Rule {
            id: "SNOT22-007",
            key: "postNasalDischarge",
            category: "SNOT-22",
            description: "Post-nasal discharge",
            evaluate: |d| val(d.snot22.post_nasal_discharge),
        },
        Snot22Rule {
            id: "SNOT22-008",
            key: "thickNasalDischarge",
            category: "SNOT-22",
            description: "Thick nasal discharge",
            evaluate: |d| val(d.snot22.thick_nasal_discharge),
        },
        Snot22Rule {
            id: "SNOT22-009",
            key: "earFullness",
            category: "SNOT-22",
            description: "Ear fullness",
            evaluate: |d| val(d.snot22.ear_fullness),
        },
        Snot22Rule {
            id: "SNOT22-010",
            key: "dizziness",
            category: "SNOT-22",
            description: "Dizziness",
            evaluate: |d| val(d.snot22.dizziness),
        },
        Snot22Rule {
            id: "SNOT22-011",
            key: "earPain",
            category: "SNOT-22",
            description: "Ear pain",
            evaluate: |d| val(d.snot22.ear_pain),
        },
        Snot22Rule {
            id: "SNOT22-012",
            key: "facialPainPressure",
            category: "SNOT-22",
            description: "Facial pain or pressure",
            evaluate: |d| val(d.snot22.facial_pain_pressure),
        },
        Snot22Rule {
            id: "SNOT22-013",
            key: "difficultyFallingAsleep",
            category: "SNOT-22",
            description: "Difficulty falling asleep",
            evaluate: |d| val(d.snot22.difficulty_falling_asleep),
        },
        Snot22Rule {
            id: "SNOT22-014",
            key: "wakingUpAtNight",
            category: "SNOT-22",
            description: "Waking up at night",
            evaluate: |d| val(d.snot22.waking_up_at_night),
        },
        Snot22Rule {
            id: "SNOT22-015",
            key: "lackOfGoodNightsSleep",
            category: "SNOT-22",
            description: "Lack of a good night\u{2019}s sleep",
            evaluate: |d| val(d.snot22.lack_of_good_nights_sleep),
        },
        Snot22Rule {
            id: "SNOT22-016",
            key: "wakingUpTired",
            category: "SNOT-22",
            description: "Waking up tired",
            evaluate: |d| val(d.snot22.waking_up_tired),
        },
        Snot22Rule {
            id: "SNOT22-017",
            key: "fatigue",
            category: "SNOT-22",
            description: "Fatigue",
            evaluate: |d| val(d.snot22.fatigue),
        },
        Snot22Rule {
            id: "SNOT22-018",
            key: "reducedProductivity",
            category: "SNOT-22",
            description: "Reduced productivity",
            evaluate: |d| val(d.snot22.reduced_productivity),
        },
        Snot22Rule {
            id: "SNOT22-019",
            key: "reducedConcentration",
            category: "SNOT-22",
            description: "Reduced concentration",
            evaluate: |d| val(d.snot22.reduced_concentration),
        },
        Snot22Rule {
            id: "SNOT22-020",
            key: "frustratedRestlessIrritable",
            category: "SNOT-22",
            description: "Frustrated, restless, or irritable",
            evaluate: |d| val(d.snot22.frustrated_restless_irritable),
        },
        Snot22Rule {
            id: "SNOT22-021",
            key: "sad",
            category: "SNOT-22",
            description: "Sad",
            evaluate: |d| val(d.snot22.sad),
        },
        Snot22Rule {
            id: "SNOT22-022",
            key: "embarrassed",
            category: "SNOT-22",
            description: "Embarrassed",
            evaluate: |d| val(d.snot22.embarrassed),
        },
    ]
}
