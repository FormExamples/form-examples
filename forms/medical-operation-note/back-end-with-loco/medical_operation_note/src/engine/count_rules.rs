//! Swab / needle / instrument count rules.
//!
//! Any unresolved discrepancy forces composite risk to at least High-risk
//! (or Critical when the discrepancy is suspected to be a retained item).

use super::types::{CompositeRisk, FiredRule};

/// Evaluate.
pub fn evaluate(
    swab_agreed: bool,
    needle_agreed: bool,
    instrument_agreed: bool,
    retained_foreign_body: bool,
) -> (CompositeRisk, bool, Option<FiredRule>) {
    let counts_agreed = swab_agreed && needle_agreed && instrument_agreed;
    if retained_foreign_body {
        return (
            CompositeRisk::Critical,
            counts_agreed,
            Some(FiredRule {
                rule_id: "count.retained".into(),
                instrument: "counts".into(),
                band: "critical".into(),
                category: "retained-foreign-body".into(),
                description: "Retained foreign body declared".into(),
            }),
        );
    }
    if !counts_agreed {
        return (
            CompositeRisk::HighRisk,
            counts_agreed,
            Some(FiredRule {
                rule_id: "count.discrepancy".into(),
                instrument: "counts".into(),
                band: "high-risk".into(),
                category: "count-discrepancy".into(),
                description: "Swab/needle/instrument count not agreed at sign-out".into(),
            }),
        );
    }
    (CompositeRisk::Routine, counts_agreed, None)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_agreed_no_retained() {
        let (r, agreed, rule) = evaluate(true, true, true, false);
        assert_eq!(r, CompositeRisk::Routine);
        assert!(agreed);
        assert!(rule.is_none());
    }

    #[test]
    fn one_disagreed_high_risk() {
        let (r, agreed, rule) = evaluate(true, false, true, false);
        assert_eq!(r, CompositeRisk::HighRisk);
        assert!(!agreed);
        assert_eq!(rule.unwrap().rule_id, "count.discrepancy");
    }

    #[test]
    fn retained_critical() {
        let (r, _, rule) = evaluate(true, true, true, true);
        assert_eq!(r, CompositeRisk::Critical);
        assert_eq!(rule.unwrap().rule_id, "count.retained");
    }
}
