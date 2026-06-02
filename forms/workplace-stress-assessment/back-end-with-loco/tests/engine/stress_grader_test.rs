use workplace_stress_assessment_loco_crate::engine::stress_grader::{
    classify_domain_mean, grade_domain, grade_stress,
};
use workplace_stress_assessment_loco_crate::engine::types::*;

fn fully_low_stress() -> AssessmentData {
    // Every domain at its most favourable: positively-worded items = 5,
    // negatively-worded (reverse-scored) items = 1 (so effective = 5).
    AssessmentData {
        demographics: Demographics {
            department: "engineering".to_string(),
            tenure_band: "3-to-5-years".to_string(),
            hours_band: "full-time-35-to-44".to_string(),
        },
        demands: Demands {
            dem1: Some(1), dem2: Some(1), dem3: Some(1), dem4: Some(1),
            dem5: Some(1), dem6: Some(1), dem7: Some(1), dem8: Some(1),
        },
        control: Control {
            ctrl1: Some(5), ctrl2: Some(5), ctrl3: Some(5),
            ctrl4: Some(5), ctrl5: Some(5), ctrl6: Some(5),
        },
        manager_support: ManagerSupport {
            ms1: Some(5), ms2: Some(5), ms3: Some(5), ms4: Some(5), ms5: Some(5),
        },
        peer_support: PeerSupport {
            ps1: Some(5), ps2: Some(5), ps3: Some(5), ps4: Some(5),
        },
        relationships: Relationships {
            rel1: Some(1), rel2: Some(1), rel3: Some(1), rel4: Some(1),
        },
        role: Role {
            role1: Some(5), role2: Some(5), role3: Some(5), role4: Some(5), role5: Some(5),
        },
        change: Change {
            chg1: Some(5), chg2: Some(5), chg3: Some(5),
        },
        additional_comments: AdditionalComments::default(),
    }
}

#[test]
fn empty_assessment_has_no_overall_risk() {
    let data = AssessmentData::default();
    let result = grade_stress(&data);
    assert_eq!(result.overall_risk, "");
    assert_eq!(result.answered_count, 0);
    assert_eq!(result.domains.demands.answered_count, 0);
}

#[test]
fn fully_low_stress_yields_low_overall() {
    let data = fully_low_stress();
    let result = grade_stress(&data);
    assert_eq!(result.answered_count, 35);
    assert_eq!(result.overall_risk, "low");
    assert_eq!(result.domains.demands.mean, Some(5.0));
    assert_eq!(result.domains.demands.category, "low");
    assert_eq!(result.domains.relationships.mean, Some(5.0));
    assert_eq!(result.domains.relationships.category, "low");
}

#[test]
fn fully_high_stress_yields_very_high_overall() {
    let mut data = fully_low_stress();
    // Flip all answers so each domain hits its worst possible effective mean.
    data.demands = Demands {
        dem1: Some(5), dem2: Some(5), dem3: Some(5), dem4: Some(5),
        dem5: Some(5), dem6: Some(5), dem7: Some(5), dem8: Some(5),
    };
    data.control = Control {
        ctrl1: Some(1), ctrl2: Some(1), ctrl3: Some(1),
        ctrl4: Some(1), ctrl5: Some(1), ctrl6: Some(1),
    };
    data.manager_support = ManagerSupport {
        ms1: Some(1), ms2: Some(1), ms3: Some(1), ms4: Some(1), ms5: Some(1),
    };
    data.peer_support = PeerSupport {
        ps1: Some(1), ps2: Some(1), ps3: Some(1), ps4: Some(1),
    };
    data.relationships = Relationships {
        rel1: Some(5), rel2: Some(5), rel3: Some(5), rel4: Some(5),
    };
    data.role = Role {
        role1: Some(1), role2: Some(1), role3: Some(1), role4: Some(1), role5: Some(1),
    };
    data.change = Change {
        chg1: Some(1), chg2: Some(1), chg3: Some(1),
    };
    let result = grade_stress(&data);
    assert_eq!(result.overall_risk, "very-high");
    assert_eq!(result.domains.demands.category, "very-high");
}

#[test]
fn reverse_scoring_inverts_demands() {
    // Demands items are reverse-scored: raw=2 becomes effective=4.
    let mut data = AssessmentData::default();
    data.demands.dem1 = Some(2);
    let (result, fired) = grade_domain(&data, "demands");
    assert_eq!(result.answered_count, 1);
    assert_eq!(result.mean, Some(4.0));
    assert_eq!(fired.len(), 1);
    assert_eq!(fired[0].raw_value, 2);
    assert_eq!(fired[0].effective_value, 4);
    assert!(fired[0].reverse_scored);
}

#[test]
fn classify_domain_mean_thresholds() {
    // demands benchmarks: good_at=4.17, moderate_at=3.71, high_at=3.32.
    assert_eq!(classify_domain_mean("demands", Some(4.50)), "low");
    assert_eq!(classify_domain_mean("demands", Some(4.17)), "low");
    assert_eq!(classify_domain_mean("demands", Some(3.90)), "moderate");
    assert_eq!(classify_domain_mean("demands", Some(3.40)), "high");
    assert_eq!(classify_domain_mean("demands", Some(2.80)), "very-high");
    assert_eq!(classify_domain_mean("demands", None), "");
}

#[test]
fn answered_count_excludes_unanswered_items() {
    let mut data = AssessmentData::default();
    data.demands.dem1 = Some(3);
    data.demands.dem2 = Some(4);
    let result = grade_stress(&data);
    assert_eq!(result.answered_count, 2);
    assert_eq!(result.domains.demands.answered_count, 2);
    assert_eq!(result.domains.control.answered_count, 0);
}

#[test]
fn fired_rules_have_unique_item_ids() {
    let data = fully_low_stress();
    let result = grade_stress(&data);
    let mut ids: Vec<&str> = result.fired_rules.iter().map(|r| r.id.as_str()).collect();
    let before = ids.len();
    ids.sort();
    ids.dedup();
    assert_eq!(ids.len(), before, "item ids must be unique");
    assert_eq!(before, 35);
}
