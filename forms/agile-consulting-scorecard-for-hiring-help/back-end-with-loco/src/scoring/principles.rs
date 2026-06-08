//! Principles module.

use crate::scoring::types::{Answer, FiredRule, Instrument, PrinciplesItems};
use crate::scoring::utils::{answer_to_grade, answer_to_points, item_answer_grade_str};

struct PrincipleSpec {
    item_number: u8, // 5..16 in scorecard numbering
    rule_id: &'static str,
    category: &'static str,
    description: &'static str,
    get: fn(&PrinciplesItems) -> Answer,
}

const PRINCIPLES: [PrincipleSpec; 12] = [
    PrincipleSpec {
        item_number: 5,
        rule_id: "R-PRINCIPLES-1",
        category: "customer-satisfaction",
        description: "Every product lead measures customer Net Promoter Score (NPS).",
        get: |p: &PrinciplesItems| p.p1.done,
    },
    PrincipleSpec {
        item_number: 6,
        rule_id: "R-PRINCIPLES-2",
        category: "welcome-changing-requirements",
        description: "The \"hello world\" program has been internationalized to >=1 additional language using the user locale.",
        get: |p: &PrinciplesItems| p.p2.done,
    },
    PrincipleSpec {
        item_number: 7,
        rule_id: "R-PRINCIPLES-3",
        category: "deliver-frequently",
        description: "The internationalized \"hello world\" version has been launched to production and verified by a native speaker.",
        get: |p: &PrinciplesItems| p.p3.done,
    },
    PrincipleSpec {
        item_number: 8,
        rule_id: "R-PRINCIPLES-4",
        category: "business-and-developers-together",
        description: "Commitment is in place from every product / project / programme / practice lead.",
        get: |p: &PrinciplesItems| p.p4.done,
    },
    PrincipleSpec {
        item_number: 9,
        rule_id: "R-PRINCIPLES-5",
        category: "motivated-individuals",
        description: "A 3-amigos team (business + dev + test) has shipped a real new MVP within 30 days and on budget.",
        get: |p: &PrinciplesItems| p.p5.done,
    },
    PrincipleSpec {
        item_number: 10,
        rule_id: "R-PRINCIPLES-6",
        category: "face-to-face",
        description: "Every product owner has committed to >=50% face-to-face time (or weekly-video equivalent for remote teams).",
        get: |p: &PrinciplesItems| p.p6.done,
    },
    PrincipleSpec {
        item_number: 11,
        rule_id: "R-PRINCIPLES-7",
        category: "working-software-is-primary-measure",
        description: "A new \"fizz buzz\" program has been created and shipped to production.",
        get: |p: &PrinciplesItems| p.p7.done,
    },
    PrincipleSpec {
        item_number: 12,
        rule_id: "R-PRINCIPLES-8",
        category: "sustainable-pace",
        description: "All staff have a sustaining budget for >=1 year secured.",
        get: |p: &PrinciplesItems| p.p8.done,
    },
    PrincipleSpec {
        item_number: 13,
        rule_id: "R-PRINCIPLES-9",
        category: "technical-excellence",
        description: "Quality-attribute metrics are wired into pre-commit hooks and continuous integration.",
        get: |p: &PrinciplesItems| p.p9.done,
    },
    PrincipleSpec {
        item_number: 14,
        rule_id: "R-PRINCIPLES-10",
        category: "simplicity",
        description: "Every product team has >=2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC).",
        get: |p: &PrinciplesItems| p.p10.done,
    },
    PrincipleSpec {
        item_number: 15,
        rule_id: "R-PRINCIPLES-11",
        category: "self-organizing-teams",
        description: "A 5-point Likert \"our team is self-organizing\" averages \"Agree\" or better.",
        get: |p: &PrinciplesItems| p.p11.done,
    },
    PrincipleSpec {
        item_number: 16,
        rule_id: "R-PRINCIPLES-12",
        category: "reflection",
        description: "Every leader has shared their previous 2 retrospectives with all stakeholders.",
        get: |p: &PrinciplesItems| p.p12.done,
    },
];

/// Grade.
pub fn grade(items: &PrinciplesItems) -> (u8, Vec<FiredRule>) {
    let mut subtotal: u8 = 0;
    let mut fired: Vec<FiredRule> = Vec::with_capacity(12);
    for spec in &PRINCIPLES {
        let answer = (spec.get)(items);
        let points = answer_to_points(answer);
        subtotal += points;
        fired.push(FiredRule {
            rule_id: spec.rule_id.into(),
            instrument: Instrument::Principles,
            item_number: Some(spec.item_number),
            grade: item_answer_grade_str(answer_to_grade(answer)).into(),
            points_awarded: points,
            category: spec.category.into(),
            description: spec.description.into(),
        });
    }
    (subtotal, fired)
}
