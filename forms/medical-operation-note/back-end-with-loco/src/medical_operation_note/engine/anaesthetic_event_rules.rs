//! Anaesthetic-event rules.
//!
//! Failed intubation, awareness, anaphylaxis, malignant hyperthermia and
//! suxamethonium apnoea are all high-priority. Minor events keep the
//! composite at Complicated.

use super::types::{CompositeRisk, FiredRule};

const HIGH_SEVERITY: [&str; 5] = [
    "failed-intubation",
    "awareness",
    "anaphylaxis",
    "malignant-hyperthermia",
    "suxamethonium-apnoea",
];

/// Evaluate.
#[must_use]
pub fn evaluate(event: &str) -> (CompositeRisk, Option<FiredRule>) {
    if event.is_empty() || event == "none" {
        return (CompositeRisk::Routine, None);
    }
    if HIGH_SEVERITY.contains(&event) {
        return (
            CompositeRisk::HighRisk,
            Some(FiredRule {
                rule_id: format!("anaesthetic.{event}"),
                instrument: "anaesthetic".into(),
                band: "high-risk".into(),
                category: "anaesthetic-incident".into(),
                description: format!("Anaesthetic incident: {event}"),
            }),
        );
    }
    (
        CompositeRisk::Complicated,
        Some(FiredRule {
            rule_id: format!("anaesthetic.{event}"),
            instrument: "anaesthetic".into(),
            band: "complicated".into(),
            category: "anaesthetic-event".into(),
            description: format!("Minor anaesthetic event: {event}"),
        }),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_routine() {
        assert_eq!(evaluate("").0, CompositeRisk::Routine);
        assert_eq!(evaluate("none").0, CompositeRisk::Routine);
    }

    #[test]
    fn minor_complicated() {
        assert_eq!(evaluate("hypotension").0, CompositeRisk::Complicated);
    }

    #[test]
    fn major_high_risk() {
        assert_eq!(evaluate("failed-intubation").0, CompositeRisk::HighRisk);
        assert_eq!(evaluate("anaphylaxis").0, CompositeRisk::HighRisk);
        assert_eq!(evaluate("malignant-hyperthermia").0, CompositeRisk::HighRisk);
    }
}
