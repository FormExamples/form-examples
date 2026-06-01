use post_traumatic_stress_assessment_tera_crate::engine::pcl5_grader::{
    answered_item_count, compute_cluster_scores, grade, meets_dsm5_pattern,
};
use post_traumatic_stress_assessment_tera_crate::engine::types::*;
use post_traumatic_stress_assessment_tera_crate::engine::utils::categorise;

/// Build an assessment with every PCL item rated at `score`.
fn all_at(score: i32) -> AssessmentData {
    let s = Some(score);
    AssessmentData {
        demographics: Demographics::default(),
        trauma_event: TraumaEvent {
            event_description: "Motor vehicle collision.".to_string(),
            event_date: "2025-06-01".to_string(),
            is_ongoing: false,
        },
        cluster_b_intrusion: ClusterBIntrusion {
            item1_repeated_disturbing_memories: s,
            item2_repeated_disturbing_dreams: s,
            item3_feeling_reliving: s,
            item4_feeling_upset_by_reminders: s,
            item5_strong_physical_reactions: s,
        },
        cluster_c_avoidance: ClusterCAvoidance {
            item6_avoiding_memories_thoughts_feelings: s,
            item7_avoiding_external_reminders: s,
        },
        cluster_d_negative_alterations: ClusterDNegativeAlterations {
            item8_trouble_remembering_important_parts: s,
            item9_strong_negative_beliefs: s,
            item10_blaming_self_or_others: s,
            item11_strong_negative_feelings: s,
            item12_loss_of_interest: s,
            item13_feeling_distant_from_others: s,
            item14_trouble_experiencing_positive_feelings: s,
        },
        cluster_e_arousal_reactivity: ClusterEArousalReactivity {
            item15_irritable_or_aggressive: s,
            item16_reckless_or_self_destructive: s,
            item17_super_alert_or_on_guard: s,
            item18_jumpy_or_easily_startled: s,
            item19_difficulty_concentrating: s,
            item20_trouble_sleeping: s,
        },
    }
}

#[test]
fn empty_assessment_is_minimal() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.total_score, 0);
    assert_eq!(result.category, "Minimal");
    assert!(!result.probable_dsm5_diagnosis);
    assert_eq!(result.answered_count, 0);
}

#[test]
fn cluster_scores_sum_correctly() {
    let data = all_at(2);
    let scores = compute_cluster_scores(&data);
    // 5 B-items * 2 = 10, 2 C-items * 2 = 4, 7 D-items * 2 = 14, 6 E-items * 2 = 12
    assert_eq!(scores.b, 10);
    assert_eq!(scores.c, 4);
    assert_eq!(scores.d, 14);
    assert_eq!(scores.e, 12);
    let result = grade(&data);
    assert_eq!(result.total_score, 40);
}

#[test]
fn categorisation_thresholds() {
    assert_eq!(categorise(0), "Minimal");
    assert_eq!(categorise(20), "Minimal");
    assert_eq!(categorise(21), "Mild");
    assert_eq!(categorise(32), "Mild");
    assert_eq!(categorise(33), "Moderate");
    assert_eq!(categorise(37), "Moderate");
    assert_eq!(categorise(38), "Severe");
    assert_eq!(categorise(80), "Severe");
}

#[test]
fn all_at_two_meets_dsm5_pattern() {
    let data = all_at(2);
    let result = grade(&data);
    // Total = 40, all items >= 2, so DSM-5 pattern is met.
    assert!(meets_dsm5_pattern(&data, result.total_score));
    assert!(result.probable_dsm5_diagnosis);
}

#[test]
fn rule_pcl_001_fires_at_threshold() {
    let data = all_at(2); // total 40 (>=33)
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "PCL-001"));
}

#[test]
fn rule_pcl_002_fires_when_pattern_met() {
    let data = all_at(2);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "PCL-002"));
}

#[test]
fn rule_pcl_003_fires_at_severe_threshold() {
    let data = all_at(3); // total 60 -> severe
    let result = grade(&data);
    assert_eq!(result.category, "Severe");
    assert!(result.fired_rules.iter().any(|r| r.id == "PCL-003"));
}

#[test]
fn answered_count_reflects_partial_completion() {
    let mut data = AssessmentData::default();
    data.cluster_b_intrusion.item1_repeated_disturbing_memories = Some(3);
    data.cluster_b_intrusion.item2_repeated_disturbing_dreams = Some(2);
    assert_eq!(answered_item_count(&data), 2);
}

#[test]
fn fired_rule_ids_are_unique() {
    let data = all_at(4);
    let result = grade(&data);
    let mut ids: Vec<&str> = result.fired_rules.iter().map(|r| r.id.as_str()).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "fired rule IDs must be unique");
}
