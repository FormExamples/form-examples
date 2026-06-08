//! Clavien dindo rules module.

/// Clavien-Dindo classification rule (one per grade key).
pub struct ClavienDindoRule {
    /// Grade.
    pub grade: &'static str,
    /// Label.
    pub label: &'static str,
    /// Short label.
    pub short_label: &'static str,
    /// Description.
    pub description: &'static str,
    /// Order.
    pub order: i32,
}

/// All Clavien-Dindo grade keys with descriptions, in canonical ordering.
pub fn all_rules() -> Vec<ClavienDindoRule> {
    vec![
        ClavienDindoRule {
            grade: "grade-0",
            label: "Grade 0",
            short_label: "0",
            description: "No complication occurred during or after the procedure.",
            order: 0,
        },
        ClavienDindoRule {
            grade: "grade-i",
            label: "Grade I",
            short_label: "I",
            description: "Any deviation from the normal post-operative course without pharmacological treatment or surgical, endoscopic, or radiological interventions. Allowed therapeutic regimens are antiemetics, antipyretics, analgesics, diuretics, electrolytes and physiotherapy. Wound infections opened at the bedside are also included.",
            order: 1,
        },
        ClavienDindoRule {
            grade: "grade-ii",
            label: "Grade II",
            short_label: "II",
            description: "Requires pharmacological treatment with drugs other than those allowed for grade I. Blood transfusions and total parenteral nutrition are also included.",
            order: 2,
        },
        ClavienDindoRule {
            grade: "grade-iiia",
            label: "Grade IIIa",
            short_label: "IIIa",
            description: "Requires surgical, endoscopic or radiological intervention not under general anaesthesia.",
            order: 3,
        },
        ClavienDindoRule {
            grade: "grade-iiib",
            label: "Grade IIIb",
            short_label: "IIIb",
            description: "Requires surgical, endoscopic or radiological intervention under general anaesthesia.",
            order: 4,
        },
        ClavienDindoRule {
            grade: "grade-iva",
            label: "Grade IVa",
            short_label: "IVa",
            description: "Life-threatening complication (incl. CNS complications) requiring intermediate care or intensive care unit management — single-organ dysfunction (incl. dialysis).",
            order: 5,
        },
        ClavienDindoRule {
            grade: "grade-ivb",
            label: "Grade IVb",
            short_label: "IVb",
            description: "Life-threatening complication (incl. CNS complications) requiring intermediate care or intensive care unit management — multi-organ dysfunction.",
            order: 6,
        },
        ClavienDindoRule {
            grade: "grade-v",
            label: "Grade V",
            short_label: "V",
            description: "Death of the patient.",
            order: 7,
        },
    ]
}

/// Look up the rule entry for a given grade key, returning `None` for an
/// unknown / empty key.
pub fn rule_by_grade(grade: &str) -> Option<ClavienDindoRule> {
    all_rules().into_iter().find(|r| r.grade == grade)
}
