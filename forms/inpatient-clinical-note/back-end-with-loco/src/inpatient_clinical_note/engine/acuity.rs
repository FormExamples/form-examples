//! Clinical acuity engine: max-band over NEWS2 and the deterioration markers.
//!
//! Every rule that fires proposes a band; the worst proposed band wins.
//! `Stable` is the default when no rule fires, and the band never falls below a
//! fired rule's band — so adding a rule can only raise acuity, never lower it.
//! See `doc/acuity-rules.md` for the justification of each rule.

use super::news2::{effective_news2, Effective};
use super::types::{AcuityBand, FiredRule, InpatientClinicalNote};

/// The acuity engine's output.
#[derive(Clone, Debug)]
pub struct AcuityResult {
    /// The computed band.
    pub band: AcuityBand,
    /// Every rule that fired, in order.
    pub fired_rules: Vec<FiredRule>,
    /// The NEWS2 totals the band was computed from.
    pub news2: Effective,
}

fn rule(id: &str, band: AcuityBand, category: &str, description: String) -> FiredRule {
    FiredRule {
        id: id.to_owned(),
        engine: "acuity".to_owned(),
        component: "acuity".to_owned(),
        band: Some(band),
        category: category.to_owned(),
        description,
    }
}

/// Evaluate every acuity rule (spec §5.2).
#[must_use]
#[allow(clippy::too_many_lines)] // linear clinical rule list; splitting adds indirection, not clarity
pub fn evaluate_acuity(note: &InpatientClinicalNote) -> AcuityResult {
    let news2 = effective_news2(&note.observations);
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut band = AcuityBand::Stable;

    let mut fire = |r: FiredRule, band: &mut AcuityBand| {
        if let Some(b) = r.band {
            *band = (*band).max(b);
        }
        fired_rules.push(r);
    };

    // NEWS2-driven rules. Only evaluated when a total is available: a note with
    // no observations gets no NEWS2 rule, not a falsely reassuring Stable.
    if let Some(total) = news2.effective {
        if total >= 9 {
            fire(
                rule(
                    "A-NEWS2-CRITICAL",
                    AcuityBand::Critical,
                    "news2",
                    format!("NEWS2 {total} — at or above the critical threshold of 9"),
                ),
                &mut band,
            );
        } else if total >= 7 {
            fire(
                rule(
                    "A-NEWS2-HIGH",
                    AcuityBand::Escalate,
                    "news2",
                    format!("NEWS2 {total} — RCP high-risk band, emergency assessment by a critical-care-competent team"),
                ),
                &mut band,
            );
        } else if total >= 5 {
            fire(
                rule(
                    "A-NEWS2-MEDIUM",
                    AcuityBand::Watch,
                    "news2",
                    format!("NEWS2 {total} — RCP medium-risk band, urgent review by a clinician competent in acute illness"),
                ),
                &mut band,
            );
        } else if !news2.any_parameter_scores_three {
            fire(
                rule(
                    "A-NEWS2-LOW",
                    AcuityBand::Stable,
                    "news2",
                    format!("NEWS2 {total} — RCP low-risk band, no single parameter scoring 3"),
                ),
                &mut band,
            );
        }

        if news2.any_parameter_scores_three && total < 7 {
            fire(
                rule(
                    "A-NEWS2-SINGLE-3",
                    AcuityBand::Watch,
                    "news2",
                    "A single NEWS2 parameter scores 3 — RCP low-medium band, review regardless of the aggregate".to_owned(),
                ),
                &mut band,
            );
        }
    }

    if note.observations.news2_trend == "worsening" {
        fire(
            rule(
                "A-NEWS2-TREND",
                AcuityBand::Watch,
                "news2",
                "NEWS2 trend is worsening — a rising score predicts deterioration better than a single reading".to_owned(),
            ),
            &mut band,
        );
    }

    // Deterioration markers, independent of the aggregate.
    if note.new_oxygen_requirement == "yes" {
        fire(
            rule(
                "A-NEW-OXYGEN",
                AcuityBand::Escalate,
                "deterioration-marker",
                "New oxygen requirement recorded".to_owned(),
            ),
            &mut band,
        );
    }

    if note.new_confusion == "yes"
        && !note.observations.acvpu.is_empty()
        && note.observations.acvpu != "alert"
    {
        fire(
            rule(
                "A-NEW-CONFUSION",
                AcuityBand::Escalate,
                "deterioration-marker",
                "New confusion with an ACVPU below Alert — a core delirium and sepsis marker"
                    .to_owned(),
            ),
            &mut band,
        );
    }

    if note.sepsis_screen == "positive" {
        fire(
            rule(
                "A-SEPSIS",
                AcuityBand::Escalate,
                "deterioration-marker",
                "Sepsis screen positive — NICE NG51 requires senior review and the sepsis pathway"
                    .to_owned(),
            ),
            &mut band,
        );
    }

    if note
        .investigations
        .iter()
        .any(|r| r.abnormal == "yes" && r.actioned != "yes")
    {
        fire(
            rule(
                "A-ABNORMAL-UNRESOLVED",
                AcuityBand::Escalate,
                "deterioration-marker",
                "An abnormal investigation result has not been actioned".to_owned(),
            ),
            &mut band,
        );
    }

    if !note.arrest_call.is_empty() && note.arrest_call != "none" {
        fire(
            rule(
                "A-ARREST",
                AcuityBand::Critical,
                "deterioration-marker",
                format!("Arrest call recorded ({})", note.arrest_call),
            ),
            &mut band,
        );
    }

    if note.critical_care_referral == "yes" {
        fire(
            rule(
                "A-CRITICAL-CARE",
                AcuityBand::Critical,
                "deterioration-marker",
                "Critical-care outreach or ICU referral made".to_owned(),
            ),
            &mut band,
        );
    }

    if !note.new_organ_support.is_empty() && note.new_organ_support != "none" {
        fire(
            rule(
                "A-ORGAN-SUPPORT",
                AcuityBand::Critical,
                "deterioration-marker",
                format!(
                    "New organ support started ({}) — level 2 or 3 care by definition",
                    note.new_organ_support
                ),
            ),
            &mut band,
        );
    }

    AcuityResult {
        band,
        fired_rules,
        news2,
    }
}
