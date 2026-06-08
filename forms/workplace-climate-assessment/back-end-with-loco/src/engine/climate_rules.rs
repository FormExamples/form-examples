//! Climate rules module.

use super::types::{AssessmentData, LikertValue};

/// A declarative survey item (Likert 1-5, positively worded).
pub struct SurveyItem {
    /// ID.
    pub id: &'static str,
    /// Domain.
    pub domain: &'static str,
    /// Label.
    pub label: &'static str,
    /// Scale min.
    pub scale_min: i32,
    /// Scale max.
    pub scale_max: i32,
    /// Value of.
    pub value_of: fn(&AssessmentData) -> LikertValue,
}

/// All eight graded domain keys, in canonical display order.
pub const GRADED_DOMAIN_KEYS: &[&str] = &[
    "leadership",
    "psychSafety",
    "inclusion",
    "communication",
    "collaboration",
    "recognition",
    "wellbeing",
    "career",
];

/// All survey items (Likert 1-5; positively worded; no reverse-coding).
///
/// The eight graded domains contribute to the composite. The three `overall`
/// items (oc1-oc3) are stored and surfaced in the report but NOT folded into
/// the composite.
pub fn all_items() -> Vec<SurveyItem> {
    vec![
        // ──────── Leadership & Management (5 items) ────────
        SurveyItem {
            id: "ld1",
            domain: "leadership",
            scale_min: 1,
            scale_max: 5,
            label: "I trust the senior leadership of this organisation.",
            value_of: |d| d.leadership.ld1,
        },
        SurveyItem {
            id: "ld2",
            domain: "leadership",
            scale_min: 1,
            scale_max: 5,
            label: "My line manager treats me with respect.",
            value_of: |d| d.leadership.ld2,
        },
        SurveyItem {
            id: "ld3",
            domain: "leadership",
            scale_min: 1,
            scale_max: 5,
            label: "Leaders make decisions that are consistent with the organisation\u{2019}s stated values.",
            value_of: |d| d.leadership.ld3,
        },
        SurveyItem {
            id: "ld4",
            domain: "leadership",
            scale_min: 1,
            scale_max: 5,
            label: "My line manager supports my professional growth.",
            value_of: |d| d.leadership.ld4,
        },
        SurveyItem {
            id: "ld5",
            domain: "leadership",
            scale_min: 1,
            scale_max: 5,
            label: "Leadership communicates a clear direction for the organisation.",
            value_of: |d| d.leadership.ld5,
        },
        // ──────── Psychological Safety (5 items) ────────
        SurveyItem {
            id: "ps1",
            domain: "psychSafety",
            scale_min: 1,
            scale_max: 5,
            label: "I can raise difficult issues at work without fear of negative consequences.",
            value_of: |d| d.psych_safety.ps1,
        },
        SurveyItem {
            id: "ps2",
            domain: "psychSafety",
            scale_min: 1,
            scale_max: 5,
            label: "I can admit a mistake here without being humiliated or punished.",
            value_of: |d| d.psych_safety.ps2,
        },
        SurveyItem {
            id: "ps3",
            domain: "psychSafety",
            scale_min: 1,
            scale_max: 5,
            label: "My colleagues respect different opinions, including disagreement.",
            value_of: |d| d.psych_safety.ps3,
        },
        SurveyItem {
            id: "ps4",
            domain: "psychSafety",
            scale_min: 1,
            scale_max: 5,
            label: "When I raise a concern, it is taken seriously.",
            value_of: |d| d.psych_safety.ps4,
        },
        SurveyItem {
            id: "ps5",
            domain: "psychSafety",
            scale_min: 1,
            scale_max: 5,
            label: "I feel safe being myself at work.",
            value_of: |d| d.psych_safety.ps5,
        },
        // ──────── Inclusion & Belonging (5 items) ────────
        SurveyItem {
            id: "in1",
            domain: "inclusion",
            scale_min: 1,
            scale_max: 5,
            label: "People from all backgrounds are treated fairly here.",
            value_of: |d| d.inclusion.in1,
        },
        SurveyItem {
            id: "in2",
            domain: "inclusion",
            scale_min: 1,
            scale_max: 5,
            label: "I feel a genuine sense of belonging at this organisation.",
            value_of: |d| d.inclusion.in2,
        },
        SurveyItem {
            id: "in3",
            domain: "inclusion",
            scale_min: 1,
            scale_max: 5,
            label: "My voice is heard and considered, regardless of my role or background.",
            value_of: |d| d.inclusion.in3,
        },
        SurveyItem {
            id: "in4",
            domain: "inclusion",
            scale_min: 1,
            scale_max: 5,
            label: "Inappropriate or disrespectful behaviour is addressed promptly when it occurs.",
            value_of: |d| d.inclusion.in4,
        },
        SurveyItem {
            id: "in5",
            domain: "inclusion",
            scale_min: 1,
            scale_max: 5,
            label: "Hiring, development and promotion decisions are made fairly.",
            value_of: |d| d.inclusion.in5,
        },
        // ──────── Communication (4 items) ────────
        SurveyItem {
            id: "co1",
            domain: "communication",
            scale_min: 1,
            scale_max: 5,
            label: "Important information reaches me in time for me to act on it.",
            value_of: |d| d.communication.co1,
        },
        SurveyItem {
            id: "co2",
            domain: "communication",
            scale_min: 1,
            scale_max: 5,
            label: "Decisions made by leadership are communicated openly and honestly.",
            value_of: |d| d.communication.co2,
        },
        SurveyItem {
            id: "co3",
            domain: "communication",
            scale_min: 1,
            scale_max: 5,
            label: "My line manager keeps me informed about things that affect my work.",
            value_of: |d| d.communication.co3,
        },
        SurveyItem {
            id: "co4",
            domain: "communication",
            scale_min: 1,
            scale_max: 5,
            label: "Two-way communication is encouraged here, not just top-down announcements.",
            value_of: |d| d.communication.co4,
        },
        // ──────── Collaboration & Teamwork (4 items) ────────
        SurveyItem {
            id: "cl1",
            domain: "collaboration",
            scale_min: 1,
            scale_max: 5,
            label: "My colleagues collaborate well with each other.",
            value_of: |d| d.collaboration.cl1,
        },
        SurveyItem {
            id: "cl2",
            domain: "collaboration",
            scale_min: 1,
            scale_max: 5,
            label: "Teams across the organisation cooperate effectively.",
            value_of: |d| d.collaboration.cl2,
        },
        SurveyItem {
            id: "cl3",
            domain: "collaboration",
            scale_min: 1,
            scale_max: 5,
            label: "Conflict is handled constructively when it arises.",
            value_of: |d| d.collaboration.cl3,
        },
        SurveyItem {
            id: "cl4",
            domain: "collaboration",
            scale_min: 1,
            scale_max: 5,
            label: "People here are willing to help each other when needed.",
            value_of: |d| d.collaboration.cl4,
        },
        // ──────── Recognition & Reward (4 items) ────────
        SurveyItem {
            id: "re1",
            domain: "recognition",
            scale_min: 1,
            scale_max: 5,
            label: "I receive meaningful recognition when I do good work.",
            value_of: |d| d.recognition.re1,
        },
        SurveyItem {
            id: "re2",
            domain: "recognition",
            scale_min: 1,
            scale_max: 5,
            label: "Pay decisions in this organisation are made fairly.",
            value_of: |d| d.recognition.re2,
        },
        SurveyItem {
            id: "re3",
            domain: "recognition",
            scale_min: 1,
            scale_max: 5,
            label: "High performers are recognised and rewarded appropriately.",
            value_of: |d| d.recognition.re3,
        },
        SurveyItem {
            id: "re4",
            domain: "recognition",
            scale_min: 1,
            scale_max: 5,
            label: "My contributions are valued by my team and manager.",
            value_of: |d| d.recognition.re4,
        },
        // ──────── Wellbeing (5 items) ────────
        SurveyItem {
            id: "we1",
            domain: "wellbeing",
            scale_min: 1,
            scale_max: 5,
            label: "My workload is manageable.",
            value_of: |d| d.wellbeing.we1,
        },
        SurveyItem {
            id: "we2",
            domain: "wellbeing",
            scale_min: 1,
            scale_max: 5,
            label: "I am able to maintain a healthy balance between work and my personal life.",
            value_of: |d| d.wellbeing.we2,
        },
        SurveyItem {
            id: "we3",
            domain: "wellbeing",
            scale_min: 1,
            scale_max: 5,
            label: "I rarely feel exhausted or burnt out at the end of the working week.",
            value_of: |d| d.wellbeing.we3,
        },
        SurveyItem {
            id: "we4",
            domain: "wellbeing",
            scale_min: 1,
            scale_max: 5,
            label: "This organisation actively supports employee mental health.",
            value_of: |d| d.wellbeing.we4,
        },
        SurveyItem {
            id: "we5",
            domain: "wellbeing",
            scale_min: 1,
            scale_max: 5,
            label: "I am able to take time off when I need it.",
            value_of: |d| d.wellbeing.we5,
        },
        // ──────── Career Development (4 items) ────────
        SurveyItem {
            id: "ca1",
            domain: "career",
            scale_min: 1,
            scale_max: 5,
            label: "I have meaningful opportunities to learn new skills here.",
            value_of: |d| d.career.ca1,
        },
        SurveyItem {
            id: "ca2",
            domain: "career",
            scale_min: 1,
            scale_max: 5,
            label: "I see a clear path for career progression.",
            value_of: |d| d.career.ca2,
        },
        SurveyItem {
            id: "ca3",
            domain: "career",
            scale_min: 1,
            scale_max: 5,
            label: "My manager actively supports my professional development.",
            value_of: |d| d.career.ca3,
        },
        SurveyItem {
            id: "ca4",
            domain: "career",
            scale_min: 1,
            scale_max: 5,
            label: "Training and development resources are available when I need them.",
            value_of: |d| d.career.ca4,
        },
        // ──────── Overall Climate (3 Likert items, NOT graded) ────────
        SurveyItem {
            id: "oc1",
            domain: "overall",
            scale_min: 1,
            scale_max: 5,
            label: "Overall, the climate at this organisation is positive.",
            value_of: |d| d.overall.oc1,
        },
        SurveyItem {
            id: "oc2",
            domain: "overall",
            scale_min: 1,
            scale_max: 5,
            label: "I would recommend this organisation as a great place to work.",
            value_of: |d| d.overall.oc2,
        },
        SurveyItem {
            id: "oc3",
            domain: "overall",
            scale_min: 1,
            scale_max: 5,
            label: "This organisation lives the values it says it stands for.",
            value_of: |d| d.overall.oc3,
        },
    ]
}
