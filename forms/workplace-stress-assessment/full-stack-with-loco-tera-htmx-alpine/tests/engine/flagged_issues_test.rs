use workplace_stress_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use workplace_stress_assessment_tera_crate::engine::stress_grader::grade_stress;
use workplace_stress_assessment_tera_crate::engine::types::*;

fn baseline_low_stress() -> AssessmentData {
    AssessmentData {
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
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_low_stress_has_no_flags() {
    let data = baseline_low_stress();
    let g = grade_stress(&data);
    assert!(g.additional_flags.is_empty(), "expected no flags: {:?}", g.additional_flags);
}

#[test]
fn very_high_demands_emits_domain_vh_flag() {
    let mut data = baseline_low_stress();
    // Demands items reverse-scored — raw=5 means effective=1 (very high stress).
    data.demands = Demands {
        dem1: Some(5), dem2: Some(5), dem3: Some(5), dem4: Some(5),
        dem5: Some(5), dem6: Some(5), dem7: Some(5), dem8: Some(5),
    };
    let g = grade_stress(&data);
    assert!(
        g.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-DOMAIN-VH-demands" && f.priority == "high")
    );
}

#[test]
fn three_high_domains_emit_multi_flag() {
    let mut data = baseline_low_stress();
    // Push three domains to 'high' (just below the moderate_at cut-off).
    // change.benchmark: good=3.55, moderate=3.10, high=2.71 — set mean ~3.0 (raw=3 across 3 items).
    data.change = Change { chg1: Some(3), chg2: Some(3), chg3: Some(3) };
    // control: moderate_at=3.78 — 3 across 6 items gives mean=3.0 → high.
    data.control = Control {
        ctrl1: Some(3), ctrl2: Some(3), ctrl3: Some(3),
        ctrl4: Some(3), ctrl5: Some(3), ctrl6: Some(3),
    };
    // role: moderate_at=4.32, high_at=3.91 — 3 across 5 gives 3.0 → high.
    data.role = Role {
        role1: Some(3), role2: Some(3), role3: Some(3), role4: Some(3), role5: Some(3),
    };
    let g = grade_stress(&data);
    assert!(
        g.additional_flags.iter().any(|f| f.id == "FLAG-DOMAIN-MULTI"),
        "expected MULTI flag in: {:?}",
        g.additional_flags
    );
}

#[test]
fn bullying_raw_4_emits_bully_flag() {
    let mut data = baseline_low_stress();
    data.relationships.rel3 = Some(4);
    let flags = detect_additional_flags(&data, &grade_stress(&data).domains);
    assert!(flags.iter().any(|f| f.id == "FLAG-REL-BULLY" && f.priority == "high"));
}

#[test]
fn harassment_raw_5_emits_harassment_flag() {
    let mut data = baseline_low_stress();
    data.relationships.rel1 = Some(5);
    let flags = detect_additional_flags(&data, &grade_stress(&data).domains);
    assert!(flags.iter().any(|f| f.id == "FLAG-REL-HARASS" && f.priority == "high"));
}

#[test]
fn distress_wording_emits_high_flag() {
    let mut data = baseline_low_stress();
    data.additional_comments.other_comments =
        "I cannot cope any more and feel hopeless about work.".to_string();
    let flags = detect_additional_flags(&data, &grade_stress(&data).domains);
    assert!(flags.iter().any(|f| f.id == "FLAG-TEXT-DISTRESS" && f.priority == "high"));
}

#[test]
fn identifying_details_emit_pii_flag() {
    let mut data = baseline_low_stress();
    data.additional_comments.most_stressful_aspect =
        "My name is John Smith and my employee number is 12345.".to_string();
    let flags = detect_additional_flags(&data, &grade_stress(&data).domains);
    assert!(flags.iter().any(|f| f.id == "FLAG-TEXT-PII" && f.priority == "low"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_low_stress();
    // Trigger high + low.
    data.additional_comments.other_comments =
        "I cannot cope. My email is jane@example.com.".to_string();
    let flags = detect_additional_flags(&data, &grade_stress(&data).domains);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
