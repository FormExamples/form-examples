//! Never-event rules (NHS England Never Events Policy & Framework).
//!
//! Any never-event candidate (wrong site / side / patient / procedure /
//! implant, retained foreign object, intra-operative arrest) escalates the
//! composite risk to Critical and fires a high-priority flag.

use super::types::{CompositeRisk, FiredRule};

pub fn evaluate(
    never_event_flagged: bool,
    never_event_kind: &str,
    intra_operative_arrest: bool,
) -> (CompositeRisk, Vec<FiredRule>) {
    let mut rules: Vec<FiredRule> = Vec::new();
    let mut risk = CompositeRisk::Routine;

    if never_event_flagged {
        risk = risk.max(CompositeRisk::Critical);
        rules.push(FiredRule {
            rule_id: "never-event.flagged".into(),
            instrument: "never-event".into(),
            band: "critical".into(),
            category: "never-event".into(),
            description: format!(
                "Never-event candidate flagged{}",
                if never_event_kind.is_empty() {
                    String::new()
                } else {
                    format!(": {never_event_kind}")
                }
            ),
        });
    }
    if intra_operative_arrest {
        risk = risk.max(CompositeRisk::Critical);
        rules.push(FiredRule {
            rule_id: "arrest.intraop".into(),
            instrument: "anaesthetic".into(),
            band: "critical".into(),
            category: "intra-operative-arrest".into(),
            description: "Cardiac or respiratory arrest in theatre".into(),
        });
    }

    (risk, rules)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nothing_routine() {
        let (r, rules) = evaluate(false, "", false);
        assert_eq!(r, CompositeRisk::Routine);
        assert!(rules.is_empty());
    }

    #[test]
    fn flagged_critical() {
        let (r, rules) = evaluate(true, "wrong-site", false);
        assert_eq!(r, CompositeRisk::Critical);
        assert_eq!(rules.len(), 1);
        assert!(rules[0].description.contains("wrong-site"));
    }

    #[test]
    fn arrest_critical() {
        let (r, rules) = evaluate(false, "", true);
        assert_eq!(r, CompositeRisk::Critical);
        assert_eq!(rules.len(), 1);
    }
}
