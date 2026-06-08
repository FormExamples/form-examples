//! Rust port of `front-end-form-with-svelte/src/lib/engine/diff.ts`.
//!
//! Compare two scorecard snapshots for the same organization. Useful
//! for the "retake the scorecard in ~3 months" loop recommended by
//! the seed.

use serde::{Deserialize, Serialize};

use crate::scoring::flags;
use crate::scoring::grader::grade_scorecard;
use crate::scoring::types::{AdditionalFlag, AgileConsultingScorecardAssessment, Answer, Band, FlagCategory};

/// Item change.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ItemChange {
    /// Improved.
    Improved,
    /// Regressed.
    Regressed,
    /// Answered.
    Answered,
    /// Cleared.
    Cleared,
    /// Unchanged.
    Unchanged,
}

/// Item diff.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ItemDiff {
    /// Item key.
    pub item_key: String,
    /// Before.
    pub before: Answer,
    /// After.
    pub after: Answer,
    /// Change.
    pub change: ItemChange,
}

/// Scorecard diff.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScorecardDiff {
    /// Score delta.
    pub score_delta: i32,
    /// Manifesto delta.
    pub manifesto_delta: i32,
    /// Principles delta.
    pub principles_delta: i32,
    /// Band before.
    pub band_before: Band,
    /// Band after.
    pub band_after: Band,
    /// Band changed.
    pub band_changed: bool,
    /// Items.
    pub items: Vec<ItemDiff>,
    /// Improved.
    pub improved: Vec<ItemDiff>,
    /// Regressed.
    pub regressed: Vec<ItemDiff>,
    /// New flags.
    pub new_flags: Vec<AdditionalFlag>,
    /// Cleared flags.
    pub cleared_flags: Vec<AdditionalFlag>,
}

const ITEM_KEYS: &[&str] = &[
    "m1", "m2", "m3", "m4",
    "p1", "p2", "p3", "p4", "p5", "p6",
    "p7", "p8", "p9", "p10", "p11", "p12",
];

fn pick_answer(a: &AgileConsultingScorecardAssessment, key: &str) -> Answer {
    match key {
        "m1" => a.manifesto.m1.done,
        "m2" => a.manifesto.m2.done,
        "m3" => a.manifesto.m3.done,
        "m4" => a.manifesto.m4.done,
        "p1" => a.principles.p1.done,
        "p2" => a.principles.p2.done,
        "p3" => a.principles.p3.done,
        "p4" => a.principles.p4.done,
        "p5" => a.principles.p5.done,
        "p6" => a.principles.p6.done,
        "p7" => a.principles.p7.done,
        "p8" => a.principles.p8.done,
        "p9" => a.principles.p9.done,
        "p10" => a.principles.p10.done,
        "p11" => a.principles.p11.done,
        "p12" => a.principles.p12.done,
        _ => None,
    }
}

fn classify(before: Answer, after: Answer) -> ItemChange {
    if before == after {
        return ItemChange::Unchanged;
    }
    if before == Some(true) && after != Some(true) {
        return ItemChange::Regressed;
    }
    if after == Some(true) && before != Some(true) {
        return ItemChange::Improved;
    }
    if before.is_none() && after.is_some() {
        return ItemChange::Answered;
    }
    if before.is_some() && after.is_none() {
        return ItemChange::Cleared;
    }
    ItemChange::Unchanged
}

fn flag_category_key(f: &AdditionalFlag) -> FlagCategory {
    f.category
}

/// Compare two scorecard snapshots and return the diff.
pub fn diff_assessments(
    before: &AgileConsultingScorecardAssessment,
    after: &AgileConsultingScorecardAssessment,
) -> ScorecardDiff {
    let g_before = grade_scorecard(before);
    let g_after = grade_scorecard(after);

    let items: Vec<ItemDiff> = ITEM_KEYS
        .iter()
        .map(|&key| {
            let b = pick_answer(before, key);
            let a = pick_answer(after, key);
            ItemDiff {
                item_key: key.into(),
                before: b,
                after: a,
                change: classify(b, a),
            }
        })
        .collect();

    let before_flag_keys: std::collections::HashSet<FlagCategory> =
        g_before.additional_flags.iter().map(flag_category_key).collect();
    let after_flag_keys: std::collections::HashSet<FlagCategory> =
        g_after.additional_flags.iter().map(flag_category_key).collect();

    // Re-compute flags so we can return owned clones (AdditionalFlag is not Copy).
    let new_flags: Vec<AdditionalFlag> = flags::compute(after)
        .into_iter()
        .filter(|f| !before_flag_keys.contains(&f.category))
        .collect();
    let cleared_flags: Vec<AdditionalFlag> = flags::compute(before)
        .into_iter()
        .filter(|f| !after_flag_keys.contains(&f.category))
        .collect();

    let improved: Vec<ItemDiff> = items
        .iter()
        .filter(|i| i.change == ItemChange::Improved)
        .cloned()
        .collect();
    let regressed: Vec<ItemDiff> = items
        .iter()
        .filter(|i| i.change == ItemChange::Regressed)
        .cloned()
        .collect();

    ScorecardDiff {
        score_delta: g_after.score_total as i32 - g_before.score_total as i32,
        manifesto_delta: g_after.manifesto_subtotal as i32 - g_before.manifesto_subtotal as i32,
        principles_delta: g_after.principles_subtotal as i32 - g_before.principles_subtotal as i32,
        band_before: g_before.computed_band,
        band_after: g_after.computed_band,
        band_changed: g_before.computed_band != g_after.computed_band,
        items,
        improved,
        regressed,
        new_flags,
        cleared_flags,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scoring::types::ChecklistItem;

    fn blank() -> AgileConsultingScorecardAssessment {
        AgileConsultingScorecardAssessment::default()
    }

    fn item(done: Option<bool>) -> ChecklistItem {
        ChecklistItem { done, evidence: String::new() }
    }

    #[test]
    fn blank_vs_blank_is_all_unchanged() {
        let d = diff_assessments(&blank(), &blank());
        assert_eq!(d.score_delta, 0);
        assert!(!d.band_changed);
        assert_eq!(d.improved.len(), 0);
        assert_eq!(d.regressed.len(), 0);
        assert_eq!(d.new_flags.len(), 0);
        assert_eq!(d.cleared_flags.len(), 0);
        assert_eq!(d.items.len(), 16);
        assert!(d.items.iter().all(|i| i.change == ItemChange::Unchanged));
    }

    #[test]
    fn improvement_loop_lifts_band_and_records_improvements() {
        let mut before = blank();
        for k in ['1', '2', '3', '4'] {
            // before: manifesto all true → 4 points → still low
            match k {
                '1' => before.manifesto.m1 = item(Some(true)),
                '2' => before.manifesto.m2 = item(Some(true)),
                '3' => before.manifesto.m3 = item(Some(true)),
                '4' => before.manifesto.m4 = item(Some(true)),
                _ => {}
            }
        }
        let mut after = before.clone();
        after.principles.p1 = item(Some(true));
        after.principles.p2 = item(Some(true));
        let d = diff_assessments(&before, &after);
        assert_eq!(d.score_delta, 2);
        assert_eq!(d.band_before, Band::Low);
        assert_eq!(d.band_after, Band::Medium);
        assert!(d.band_changed);
        assert_eq!(d.improved.len(), 2);
        assert_eq!(d.improved[0].item_key, "p1");
    }

    #[test]
    fn regression_loop_records_negative_delta_and_regressions() {
        let mut before = blank();
        before.manifesto.m1 = item(Some(true));
        before.manifesto.m2 = item(Some(true));
        before.manifesto.m3 = item(Some(true));
        before.manifesto.m4 = item(Some(true));
        before.principles.p1 = item(Some(true));
        let mut after = before.clone();
        after.manifesto.m3 = item(Some(false));
        after.manifesto.m4 = item(Some(false));
        let d = diff_assessments(&before, &after);
        assert_eq!(d.score_delta, -2);
        assert_eq!(d.regressed.len(), 2);
        assert_eq!(d.regressed[0].item_key, "m3");
        assert_eq!(d.regressed[1].item_key, "m4");
    }

    #[test]
    fn new_flag_fires_on_regression() {
        let mut before = blank();
        before.manifesto.m4 = item(Some(true));
        let mut after = blank();
        after.manifesto.m4 = item(Some(false));
        let d = diff_assessments(&before, &after);
        let cats: Vec<FlagCategory> = d.new_flags.iter().map(|f| f.category).collect();
        assert!(cats.contains(&FlagCategory::NoSeniorLeadershipBuyin));
        assert_eq!(d.cleared_flags.len(), 0);
    }

    #[test]
    fn cleared_flag_when_improvement_removes_it() {
        let mut before = blank();
        before.principles.p12 = item(Some(false));
        let mut after = blank();
        after.principles.p12 = item(Some(true));
        let d = diff_assessments(&before, &after);
        let cats: Vec<FlagCategory> = d.cleared_flags.iter().map(|f| f.category).collect();
        assert!(cats.contains(&FlagCategory::NoReflectionCulture));
        assert_eq!(d.new_flags.len(), 0);
    }

    #[test]
    fn classifier_handles_all_four_transitions() {
        let mut before = blank();
        before.manifesto.m1 = item(Some(false));
        before.manifesto.m2 = item(Some(true));
        before.manifesto.m3 = item(None);
        before.manifesto.m4 = item(Some(true));
        before.principles.p1 = item(None);
        before.principles.p2 = item(Some(false));

        let mut after = blank();
        after.manifesto.m1 = item(Some(true));
        after.manifesto.m2 = item(Some(false));
        after.manifesto.m3 = item(Some(true));
        after.manifesto.m4 = item(None);
        after.principles.p1 = item(Some(false));
        after.principles.p2 = item(None);

        let d = diff_assessments(&before, &after);
        let find = |k: &str| d.items.iter().find(|i| i.item_key == k).cloned().unwrap();
        assert_eq!(find("m1").change, ItemChange::Improved);
        assert_eq!(find("m2").change, ItemChange::Regressed);
        assert_eq!(find("m3").change, ItemChange::Improved);
        assert_eq!(find("m4").change, ItemChange::Regressed);
        assert_eq!(find("p1").change, ItemChange::Answered);
        assert_eq!(find("p2").change, ItemChange::Cleared);
    }
}
