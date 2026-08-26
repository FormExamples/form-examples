//! Composite operative-risk grader.
//!
//! The `grade` function applies every sub-rule, takes the maximum band
//! across them (Routine < Complicated < High-risk < Critical), and
//! collects the firing rules and safety flags.

use super::{
    anaesthetic_event_rules, blood_loss_rules, clavien_dindo_rules, count_rules,
    flagged_issues, never_event_rules,
    types::{ClavienDindo, CompositeRisk, FiredRule, OperationGrade, OperationNote},
};

/// Grade.
#[must_use]
pub fn grade(note: &OperationNote) -> OperationGrade {
    let mut composite = CompositeRisk::Routine;
    let mut fired: Vec<FiredRule> = Vec::new();

    let (r1, rule1) = blood_loss_rules::evaluate(note.estimated_blood_loss_ml);
    composite = composite.max(r1);
    if let Some(r) = rule1 {
        fired.push(r);
    }

    let (r2, rule2) = clavien_dindo_rules::evaluate(note.worst_clavien_dindo);
    composite = composite.max(r2);
    if let Some(r) = rule2 {
        fired.push(r);
    }

    let (r3, counts_agreed, rule3) = count_rules::evaluate(
        note.swab_count_agreed,
        note.needle_count_agreed,
        note.instrument_count_agreed,
        note.retained_foreign_body,
    );
    composite = composite.max(r3);
    if let Some(r) = rule3 {
        fired.push(r);
    }

    let (r4, rules4) = never_event_rules::evaluate(
        note.never_event_flagged,
        &note.never_event_kind,
        note.intra_operative_arrest,
    );
    composite = composite.max(r4);
    fired.extend(rules4);

    let (r5, rule5) = anaesthetic_event_rules::evaluate(&note.anaesthetic_event);
    composite = composite.max(r5);
    if let Some(r) = rule5 {
        fired.push(r);
    }

    // ASA modifier — V/VI lifts to Critical; IV lifts to at least High-risk.
    if let Some(asa) = note.asa_physical_status {
        if asa >= 5 {
            composite = composite.max(CompositeRisk::Critical);
            fired.push(FiredRule {
                rule_id: format!("asa.{asa}"),
                instrument: "asa".into(),
                band: "critical".into(),
                category: "asa-status".into(),
                description: format!("ASA Physical Status {asa}"),
            });
        } else if asa == 4 {
            composite = composite.max(CompositeRisk::HighRisk);
            fired.push(FiredRule {
                rule_id: "asa.4".into(),
                instrument: "asa".into(),
                band: "high-risk".into(),
                category: "asa-status".into(),
                description: "ASA Physical Status IV".into(),
            });
        }
    }

    // Unplanned step-up in disposition (planned vs actual).
    if !note.recovery_destination.is_empty()
        && !note.planned_recovery_destination.is_empty()
        && note.recovery_destination != note.planned_recovery_destination
        && intensity(&note.recovery_destination) > intensity(&note.planned_recovery_destination)
    {
        composite = composite.max(CompositeRisk::HighRisk);
        fired.push(FiredRule {
            rule_id: "disposition.step-up".into(),
            instrument: "disposition".into(),
            band: "high-risk".into(),
            category: "disposition".into(),
            description: format!(
                "Unplanned step-up: planned {} → actual {}",
                note.planned_recovery_destination, note.recovery_destination
            ),
        });
    }

    let blood_loss_band = blood_loss_rules::classify_blood_loss(note.estimated_blood_loss_ml);
    let additional_flags = flagged_issues::collect(note);

    OperationGrade {
        composite_risk: composite,
        clavien_dindo_grade: note.worst_clavien_dindo.unwrap_or(ClavienDindo::Zero),
        asa_physical_status: note.asa_physical_status,
        blood_loss_band,
        counts_agreed,
        fired_rules: fired,
        additional_flags,
    }
}

#[allow(clippy::match_same_arms)] // published clinical band table; explicit rows beat merged arms
fn intensity(disposition: &str) -> u8 {
    match disposition {
        "day-case-discharge" => 0,
        "ward" => 1,
        "pacu" => 2,
        "enhanced-care" => 3,
        "hdu" => 4,
        "icu" => 5,
        _ => 1,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::types::BloodLossBand;

    fn clean() -> OperationNote {
        OperationNote {
            swab_count_agreed: true,
            needle_count_agreed: true,
            instrument_count_agreed: true,
            estimated_blood_loss_ml: Some(50),
            ..OperationNote::default()
        }
    }

    #[test]
    fn default_routine() {
        let g = grade(&clean());
        assert_eq!(g.composite_risk, CompositeRisk::Routine);
        assert_eq!(g.blood_loss_band, BloodLossBand::Minimal);
        assert!(g.fired_rules.is_empty());
        assert!(g.counts_agreed);
    }

    #[test]
    fn moderate_ebl_complicated() {
        let mut n = clean();
        n.estimated_blood_loss_ml = Some(900);
        assert_eq!(grade(&n).composite_risk, CompositeRisk::Complicated);
    }

    #[test]
    fn retained_critical() {
        let mut n = clean();
        n.retained_foreign_body = true;
        assert_eq!(grade(&n).composite_risk, CompositeRisk::Critical);
    }

    #[test]
    fn max_grade_wins() {
        let mut n = clean();
        n.estimated_blood_loss_ml = Some(700); // Complicated
        n.worst_clavien_dindo = Some(ClavienDindo::IIIb); // High-risk
        n.never_event_flagged = true; // Critical
        assert_eq!(grade(&n).composite_risk, CompositeRisk::Critical);
    }

    #[test]
    fn asa_5_forces_critical() {
        let mut n = clean();
        n.asa_physical_status = Some(5);
        assert_eq!(grade(&n).composite_risk, CompositeRisk::Critical);
    }

    #[test]
    fn unplanned_icu_high_risk() {
        let mut n = clean();
        n.planned_recovery_destination = "ward".into();
        n.recovery_destination = "icu".into();
        assert_eq!(grade(&n).composite_risk, CompositeRisk::HighRisk);
    }
}
