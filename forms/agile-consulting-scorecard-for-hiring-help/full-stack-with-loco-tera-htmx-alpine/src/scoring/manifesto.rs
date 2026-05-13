use crate::scoring::types::{Answer, FiredRule, Instrument, ManifestoItems};
use crate::scoring::utils::{answer_to_grade, answer_to_points, item_answer_grade_str};

struct ManifestoSpec {
    item_number: u8,
    rule_id: &'static str,
    category: &'static str,
    description: &'static str,
    get: fn(&ManifestoItems) -> Answer,
}

const MANIFESTO: [ManifestoSpec; 4] = [
    ManifestoSpec {
        item_number: 1,
        rule_id: "R-MANIFESTO-1",
        category: "individuals-and-interactions",
        description: "Every leader is in conversation with customers >=1 hour per week, with weekly results radiated to stakeholders.",
        get: |m: &ManifestoItems| m.m1.done,
    },
    ManifestoSpec {
        item_number: 2,
        rule_id: "R-MANIFESTO-2",
        category: "working-software",
        description: "The team has launched a brand-new \"hello world\" program to production and discussed the experience.",
        get: |m: &ManifestoItems| m.m2.done,
    },
    ManifestoSpec {
        item_number: 3,
        rule_id: "R-MANIFESTO-3",
        category: "customer-collaboration",
        description: "The organization has bought copies of the customer's favourite book and shared with the team (org spend, not personal).",
        get: |m: &ManifestoItems| m.m3.done,
    },
    ManifestoSpec {
        item_number: 4,
        rule_id: "R-MANIFESTO-4",
        category: "responding-to-change",
        description: "Every senior leader (BoD/CXO/VP/Dir) has read one agile change-management book and shared three takeaways.",
        get: |m: &ManifestoItems| m.m4.done,
    },
];

pub fn grade(items: &ManifestoItems) -> (u8, Vec<FiredRule>) {
    let mut subtotal: u8 = 0;
    let mut fired: Vec<FiredRule> = Vec::with_capacity(4);
    for spec in &MANIFESTO {
        let answer = (spec.get)(items);
        let points = answer_to_points(answer);
        subtotal += points;
        fired.push(FiredRule {
            rule_id: spec.rule_id.into(),
            instrument: Instrument::Manifesto,
            item_number: Some(spec.item_number),
            grade: item_answer_grade_str(answer_to_grade(answer)).into(),
            points_awarded: points,
            category: spec.category.into(),
            description: spec.description.into(),
        });
    }
    (subtotal, fired)
}
