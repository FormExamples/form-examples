//! Estimated-blood-loss (EBL) rules.
//!
//! Bands and grade contributions are derived from the index.md table:
//! Routine ≤ 500 mL, Complicated 500–1500, High-risk 1500–3000,
//! Critical > 3000.

use super::types::{BloodLossBand, CompositeRisk, FiredRule};

pub fn classify_blood_loss(ml: Option<i32>) -> BloodLossBand {
    match ml {
        None => BloodLossBand::Minimal,
        Some(v) if v <= 100 => BloodLossBand::Minimal,
        Some(v) if v <= 500 => BloodLossBand::Mild,
        Some(v) if v <= 1500 => BloodLossBand::Moderate,
        Some(v) if v <= 3000 => BloodLossBand::Severe,
        _ => BloodLossBand::Massive,
    }
}

/// Returns (band-contribution to composite risk, optional fired rule).
pub fn evaluate(ml: Option<i32>) -> (CompositeRisk, Option<FiredRule>) {
    let band = classify_blood_loss(ml);
    let (risk, rule) = match band {
        BloodLossBand::Minimal | BloodLossBand::Mild => (CompositeRisk::Routine, None),
        BloodLossBand::Moderate => (
            CompositeRisk::Complicated,
            Some(FiredRule {
                rule_id: "ebl.moderate".into(),
                instrument: "blood-loss".into(),
                band: "complicated".into(),
                category: "haemorrhage".into(),
                description: "EBL 500–1500 mL".into(),
            }),
        ),
        BloodLossBand::Severe => (
            CompositeRisk::HighRisk,
            Some(FiredRule {
                rule_id: "ebl.severe".into(),
                instrument: "blood-loss".into(),
                band: "high-risk".into(),
                category: "haemorrhage".into(),
                description: "EBL 1500–3000 mL (massive haemorrhage)".into(),
            }),
        ),
        BloodLossBand::Massive => (
            CompositeRisk::Critical,
            Some(FiredRule {
                rule_id: "ebl.massive".into(),
                instrument: "blood-loss".into(),
                band: "critical".into(),
                category: "haemorrhage".into(),
                description: "EBL > 3000 mL (catastrophic haemorrhage)".into(),
            }),
        ),
    };
    (risk, rule)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn classify() {
        assert_eq!(classify_blood_loss(None), BloodLossBand::Minimal);
        assert_eq!(classify_blood_loss(Some(0)), BloodLossBand::Minimal);
        assert_eq!(classify_blood_loss(Some(100)), BloodLossBand::Minimal);
        assert_eq!(classify_blood_loss(Some(400)), BloodLossBand::Mild);
        assert_eq!(classify_blood_loss(Some(800)), BloodLossBand::Moderate);
        assert_eq!(classify_blood_loss(Some(2500)), BloodLossBand::Severe);
        assert_eq!(classify_blood_loss(Some(4000)), BloodLossBand::Massive);
    }

    #[test]
    fn evaluate_paths() {
        assert_eq!(evaluate(Some(400)).0, CompositeRisk::Routine);
        assert_eq!(evaluate(Some(1000)).0, CompositeRisk::Complicated);
        assert_eq!(evaluate(Some(2000)).0, CompositeRisk::HighRisk);
        assert_eq!(evaluate(Some(5000)).0, CompositeRisk::Critical);
    }
}
