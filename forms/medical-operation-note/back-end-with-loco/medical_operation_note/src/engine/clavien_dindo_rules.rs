//! Clavien–Dindo complication rules.
//!
//! Clavien–Dindo I/II → Complicated; IIIa/IIIb → High-risk;
//! IVa/IVb/V → Critical; 0 is Routine.

use super::types::{ClavienDindo, CompositeRisk, FiredRule};

pub fn evaluate(grade: Option<ClavienDindo>) -> (CompositeRisk, Option<FiredRule>) {
    let g = grade.unwrap_or(ClavienDindo::Zero);
    let (risk, label) = match g {
        ClavienDindo::Zero => return (CompositeRisk::Routine, None),
        ClavienDindo::I | ClavienDindo::II => (CompositeRisk::Complicated, "minor (I–II)"),
        ClavienDindo::IIIa | ClavienDindo::IIIb => (CompositeRisk::HighRisk, "major (IIIa–IIIb)"),
        ClavienDindo::IVa | ClavienDindo::IVb => (CompositeRisk::Critical, "life-threatening (IVa–IVb)"),
        ClavienDindo::V => (CompositeRisk::Critical, "death (V)"),
    };
    let rule = FiredRule {
        rule_id: format!("clavien.{:?}", g).to_lowercase(),
        instrument: "clavien-dindo".into(),
        band: match risk {
            CompositeRisk::Routine => "routine".into(),
            CompositeRisk::Complicated => "complicated".into(),
            CompositeRisk::HighRisk => "high-risk".into(),
            CompositeRisk::Critical => "critical".into(),
        },
        category: "complication".into(),
        description: format!("Clavien–Dindo {label}"),
    };
    (risk, Some(rule))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero_is_routine_no_rule() {
        let (r, rule) = evaluate(Some(ClavienDindo::Zero));
        assert_eq!(r, CompositeRisk::Routine);
        assert!(rule.is_none());
    }

    #[test]
    fn one_two_complicated() {
        assert_eq!(evaluate(Some(ClavienDindo::I)).0, CompositeRisk::Complicated);
        assert_eq!(evaluate(Some(ClavienDindo::II)).0, CompositeRisk::Complicated);
    }

    #[test]
    fn three_high_risk() {
        assert_eq!(evaluate(Some(ClavienDindo::IIIa)).0, CompositeRisk::HighRisk);
        assert_eq!(evaluate(Some(ClavienDindo::IIIb)).0, CompositeRisk::HighRisk);
    }

    #[test]
    fn four_five_critical() {
        assert_eq!(evaluate(Some(ClavienDindo::IVa)).0, CompositeRisk::Critical);
        assert_eq!(evaluate(Some(ClavienDindo::IVb)).0, CompositeRisk::Critical);
        assert_eq!(evaluate(Some(ClavienDindo::V)).0, CompositeRisk::Critical);
    }
}
