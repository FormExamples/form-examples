//! Pcl5 grader module.

use super::flagged_issues::detect_additional_flags;
use super::pcl5_rules::detect_fired_rules;
use super::types::{AssessmentData, ClusterScores, GradingResult, PclItemScore};
use super::utils::{CUT_OFF, categorise};

/// Sum a slice of PCL item scores, treating `None` as 0.
fn sum(items: &[PclItemScore]) -> i32 {
    items.iter().map(|v| v.unwrap_or(0)).sum()
}

/// Per-cluster sums.
pub fn compute_cluster_scores(d: &AssessmentData) -> ClusterScores {
    ClusterScores {
        b: sum(&[
            d.cluster_b_intrusion.item1_repeated_disturbing_memories,
            d.cluster_b_intrusion.item2_repeated_disturbing_dreams,
            d.cluster_b_intrusion.item3_feeling_reliving,
            d.cluster_b_intrusion.item4_feeling_upset_by_reminders,
            d.cluster_b_intrusion.item5_strong_physical_reactions,
        ]),
        c: sum(&[
            d.cluster_c_avoidance.item6_avoiding_memories_thoughts_feelings,
            d.cluster_c_avoidance.item7_avoiding_external_reminders,
        ]),
        d: sum(&[
            d.cluster_d_negative_alterations.item8_trouble_remembering_important_parts,
            d.cluster_d_negative_alterations.item9_strong_negative_beliefs,
            d.cluster_d_negative_alterations.item10_blaming_self_or_others,
            d.cluster_d_negative_alterations.item11_strong_negative_feelings,
            d.cluster_d_negative_alterations.item12_loss_of_interest,
            d.cluster_d_negative_alterations.item13_feeling_distant_from_others,
            d.cluster_d_negative_alterations.item14_trouble_experiencing_positive_feelings,
        ]),
        e: sum(&[
            d.cluster_e_arousal_reactivity.item15_irritable_or_aggressive,
            d.cluster_e_arousal_reactivity.item16_reckless_or_self_destructive,
            d.cluster_e_arousal_reactivity.item17_super_alert_or_on_guard,
            d.cluster_e_arousal_reactivity.item18_jumpy_or_easily_startled,
            d.cluster_e_arousal_reactivity.item19_difficulty_concentrating,
            d.cluster_e_arousal_reactivity.item20_trouble_sleeping,
        ]),
    }
}

/// Count items at or above the given threshold (treating `None` as 0).
fn count_items_at_or_above(items: &[PclItemScore], threshold: i32) -> i32 {
    items
        .iter()
        .filter(|v| v.unwrap_or(0) >= threshold)
        .count() as i32
}

/// DSM-5 provisional-diagnosis pattern check.
///
/// Requires total >= cut-off AND >= 1 B item, >= 1 C item, >= 2 D items, and
/// >= 2 E items each rated >= 2 (Moderately).
pub fn meets_dsm5_pattern(d: &AssessmentData, total: i32) -> bool {
    if total < CUT_OFF {
        return false;
    }
    let b_vals = [
        d.cluster_b_intrusion.item1_repeated_disturbing_memories,
        d.cluster_b_intrusion.item2_repeated_disturbing_dreams,
        d.cluster_b_intrusion.item3_feeling_reliving,
        d.cluster_b_intrusion.item4_feeling_upset_by_reminders,
        d.cluster_b_intrusion.item5_strong_physical_reactions,
    ];
    let c_vals = [
        d.cluster_c_avoidance.item6_avoiding_memories_thoughts_feelings,
        d.cluster_c_avoidance.item7_avoiding_external_reminders,
    ];
    let d_vals = [
        d.cluster_d_negative_alterations.item8_trouble_remembering_important_parts,
        d.cluster_d_negative_alterations.item9_strong_negative_beliefs,
        d.cluster_d_negative_alterations.item10_blaming_self_or_others,
        d.cluster_d_negative_alterations.item11_strong_negative_feelings,
        d.cluster_d_negative_alterations.item12_loss_of_interest,
        d.cluster_d_negative_alterations.item13_feeling_distant_from_others,
        d.cluster_d_negative_alterations.item14_trouble_experiencing_positive_feelings,
    ];
    let e_vals = [
        d.cluster_e_arousal_reactivity.item15_irritable_or_aggressive,
        d.cluster_e_arousal_reactivity.item16_reckless_or_self_destructive,
        d.cluster_e_arousal_reactivity.item17_super_alert_or_on_guard,
        d.cluster_e_arousal_reactivity.item18_jumpy_or_easily_startled,
        d.cluster_e_arousal_reactivity.item19_difficulty_concentrating,
        d.cluster_e_arousal_reactivity.item20_trouble_sleeping,
    ];
    count_items_at_or_above(&b_vals, 2) >= 1
        && count_items_at_or_above(&c_vals, 2) >= 1
        && count_items_at_or_above(&d_vals, 2) >= 2
        && count_items_at_or_above(&e_vals, 2) >= 2
}

/// Count the number of PCL items that have been answered (non-None).
pub fn answered_item_count(d: &AssessmentData) -> i32 {
    let all = [
        d.cluster_b_intrusion.item1_repeated_disturbing_memories,
        d.cluster_b_intrusion.item2_repeated_disturbing_dreams,
        d.cluster_b_intrusion.item3_feeling_reliving,
        d.cluster_b_intrusion.item4_feeling_upset_by_reminders,
        d.cluster_b_intrusion.item5_strong_physical_reactions,
        d.cluster_c_avoidance.item6_avoiding_memories_thoughts_feelings,
        d.cluster_c_avoidance.item7_avoiding_external_reminders,
        d.cluster_d_negative_alterations.item8_trouble_remembering_important_parts,
        d.cluster_d_negative_alterations.item9_strong_negative_beliefs,
        d.cluster_d_negative_alterations.item10_blaming_self_or_others,
        d.cluster_d_negative_alterations.item11_strong_negative_feelings,
        d.cluster_d_negative_alterations.item12_loss_of_interest,
        d.cluster_d_negative_alterations.item13_feeling_distant_from_others,
        d.cluster_d_negative_alterations.item14_trouble_experiencing_positive_feelings,
        d.cluster_e_arousal_reactivity.item15_irritable_or_aggressive,
        d.cluster_e_arousal_reactivity.item16_reckless_or_self_destructive,
        d.cluster_e_arousal_reactivity.item17_super_alert_or_on_guard,
        d.cluster_e_arousal_reactivity.item18_jumpy_or_easily_startled,
        d.cluster_e_arousal_reactivity.item19_difficulty_concentrating,
        d.cluster_e_arousal_reactivity.item20_trouble_sleeping,
    ];
    all.iter().filter(|v| v.is_some()).count() as i32
}

/// Pure function: grades a PCL-5 assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let cluster_scores = compute_cluster_scores(data);
    let total_score = cluster_scores.b + cluster_scores.c + cluster_scores.d + cluster_scores.e;
    let category = categorise(total_score);
    let probable_dsm5_diagnosis = meets_dsm5_pattern(data, total_score);
    let answered_count = answered_item_count(data);

    let fired_rules = detect_fired_rules(data, total_score, &category, probable_dsm5_diagnosis);
    let additional_flags =
        detect_additional_flags(data, total_score, probable_dsm5_diagnosis, answered_count);

    GradingResult {
        total_score,
        category,
        probable_dsm5_diagnosis,
        cluster_scores,
        fired_rules,
        additional_flags,
        answered_count,
        timestamp,
    }
}
