//! DASS-21 (Depression Anxiety Stress Scales — 21 item) rules.
//!
//! Each rule maps one questionnaire item to a 0..=3 Likert response, or `None`
//! when the patient has not yet answered. The grader sums each subscale and
//! doubles the raw total so the score aligns with the DASS-42 normative
//! cutoffs (Lovibond & Lovibond, 1995).
//!
//! Item assignments (canonical DASS-21):
//!   Depression — 3, 5, 10, 13, 16, 17, 21
//!   Anxiety    — 2, 4, 7, 9, 15, 19, 20
//!   Stress     — 1, 6, 8, 11, 12, 14, 18

use crate::engine::types::{AssessmentData, DassItem, Subscale};

pub struct DassRule {
    pub id: &'static str,
    pub subscale: Subscale,
    pub item_number: u32,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> DassItem,
}

pub fn dass21_rules() -> &'static [DassRule] {
    &[
        // ── Depression ────────────────────────────────────
        DassRule {
            id: "DASS-D-03",
            subscale: Subscale::Depression,
            item_number: 3,
            description: "I couldn't seem to experience any positive feeling at all.",
            evaluate: |d| d.dass_depression.item3_could_not_experience_positive,
        },
        DassRule {
            id: "DASS-D-05",
            subscale: Subscale::Depression,
            item_number: 5,
            description: "I found it difficult to work up the initiative to do things.",
            evaluate: |d| d.dass_depression.item5_difficult_initiating,
        },
        DassRule {
            id: "DASS-D-10",
            subscale: Subscale::Depression,
            item_number: 10,
            description: "I felt that I had nothing to look forward to.",
            evaluate: |d| d.dass_depression.item10_nothing_to_look_forward_to,
        },
        DassRule {
            id: "DASS-D-13",
            subscale: Subscale::Depression,
            item_number: 13,
            description: "I felt down-hearted and blue.",
            evaluate: |d| d.dass_depression.item13_downhearted_blue,
        },
        DassRule {
            id: "DASS-D-16",
            subscale: Subscale::Depression,
            item_number: 16,
            description: "I was unable to become enthusiastic about anything.",
            evaluate: |d| d.dass_depression.item16_unable_to_become_enthusiastic,
        },
        DassRule {
            id: "DASS-D-17",
            subscale: Subscale::Depression,
            item_number: 17,
            description: "I felt I wasn't worth much as a person.",
            evaluate: |d| d.dass_depression.item17_not_worth_much,
        },
        DassRule {
            id: "DASS-D-21",
            subscale: Subscale::Depression,
            item_number: 21,
            description: "I felt that life was meaningless.",
            evaluate: |d| d.dass_depression.item21_life_meaningless,
        },
        // ── Anxiety ───────────────────────────────────────
        DassRule {
            id: "DASS-A-02",
            subscale: Subscale::Anxiety,
            item_number: 2,
            description: "I was aware of dryness of my mouth.",
            evaluate: |d| d.dass_anxiety.item2_dryness_of_mouth,
        },
        DassRule {
            id: "DASS-A-04",
            subscale: Subscale::Anxiety,
            item_number: 4,
            description: "I experienced breathing difficulty.",
            evaluate: |d| d.dass_anxiety.item4_breathing_difficulty,
        },
        DassRule {
            id: "DASS-A-07",
            subscale: Subscale::Anxiety,
            item_number: 7,
            description: "I experienced trembling (e.g. in the hands).",
            evaluate: |d| d.dass_anxiety.item7_trembling,
        },
        DassRule {
            id: "DASS-A-09",
            subscale: Subscale::Anxiety,
            item_number: 9,
            description: "I was worried about situations in which I might panic and make a fool of myself.",
            evaluate: |d| d.dass_anxiety.item9_panic_worry,
        },
        DassRule {
            id: "DASS-A-15",
            subscale: Subscale::Anxiety,
            item_number: 15,
            description: "I felt I was close to panic.",
            evaluate: |d| d.dass_anxiety.item15_closed_to_panic,
        },
        DassRule {
            id: "DASS-A-19",
            subscale: Subscale::Anxiety,
            item_number: 19,
            description: "I was aware of the action of my heart in the absence of physical exertion.",
            evaluate: |d| d.dass_anxiety.item19_heart_action_aware,
        },
        DassRule {
            id: "DASS-A-20",
            subscale: Subscale::Anxiety,
            item_number: 20,
            description: "I felt scared without any good reason.",
            evaluate: |d| d.dass_anxiety.item20_scared_without_reason,
        },
        // ── Stress ────────────────────────────────────────
        DassRule {
            id: "DASS-S-01",
            subscale: Subscale::Stress,
            item_number: 1,
            description: "I found it hard to wind down.",
            evaluate: |d| d.dass_stress.item1_hard_to_wind_down,
        },
        DassRule {
            id: "DASS-S-06",
            subscale: Subscale::Stress,
            item_number: 6,
            description: "I tended to over-react to situations.",
            evaluate: |d| d.dass_stress.item6_over_react,
        },
        DassRule {
            id: "DASS-S-08",
            subscale: Subscale::Stress,
            item_number: 8,
            description: "I felt that I was using a lot of nervous energy.",
            evaluate: |d| d.dass_stress.item8_nervous_energy,
        },
        DassRule {
            id: "DASS-S-11",
            subscale: Subscale::Stress,
            item_number: 11,
            description: "I found myself getting agitated.",
            evaluate: |d| d.dass_stress.item11_agitated_easily,
        },
        DassRule {
            id: "DASS-S-12",
            subscale: Subscale::Stress,
            item_number: 12,
            description: "I found it difficult to relax.",
            evaluate: |d| d.dass_stress.item12_difficult_to_relax,
        },
        DassRule {
            id: "DASS-S-14",
            subscale: Subscale::Stress,
            item_number: 14,
            description: "I was intolerant of anything that kept me from getting on with what I was doing.",
            evaluate: |d| d.dass_stress.item14_intolerant,
        },
        DassRule {
            id: "DASS-S-18",
            subscale: Subscale::Stress,
            item_number: 18,
            description: "I felt that I was rather touchy.",
            evaluate: |d| d.dass_stress.item18_touchy_easily,
        },
    ]
}
