//! Rust port of `front-end-form-with-svelte/src/lib/engine/recommendations.ts`.
//!
//! For each item the respondent marked `false`, surface the
//! intervention named in `seed.md`. Unanswered (`null`) items are
//! skipped — recommendations come only from explicit "no" answers.

use serde::{Deserialize, Serialize};

use crate::scoring::types::{AgileConsultingScorecardAssessment, Answer};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecommendedAction {
    /// Item key as used in the assessment shape: `m1`..`m4`, `p1`..`p12`.
    pub item_key: String,
    /// Human-readable item heading, matching the wizard step copy.
    pub heading: String,
    /// The intervention as phrased in `seed.md`.
    pub intervention: String,
    /// Why this intervention is recommended; pulled from `seed.md` commentary.
    pub rationale: String,
}

struct Spec {
    item_key: &'static str,
    heading: &'static str,
    intervention: &'static str,
    rationale: &'static str,
    get: fn(&AgileConsultingScorecardAssessment) -> Answer,
}

const ACTIONS: &[Spec] = &[
    Spec {
        item_key: "m1",
        heading: "Manifesto 1 — Individuals and interactions",
        intervention: "Schedule every leader for >= 1 hour per week of direct customer conversation, and radiate the weekly results to all stakeholders.",
        rationale: "Customer-facing leadership is a precondition for any consultant to do useful work; without it, advice is delivered into a vacuum.",
        get: |a| a.manifesto.m1.done,
    },
    Spec {
        item_key: "m2",
        heading: "Manifesto 2 — Working software",
        intervention: "As a team, build and ship a brand-new \"hello world\" program to production and discuss what happened at each stage.",
        rationale: "The exercise exposes where the org's deployment, ops, and review processes break down — these are the issues a consultant will hit first.",
        get: |a| a.manifesto.m2.done,
    },
    Spec {
        item_key: "m3",
        heading: "Manifesto 3 — Customer collaboration",
        intervention: "Have the organization (not a teammate personally) buy copies of the customer's favourite relevant book and share them with the team.",
        rationale: "Exercises the org's ability to spend small amounts of money to enable progress and builds shared vocabulary with the customer.",
        get: |a| a.manifesto.m3.done,
    },
    Spec {
        item_key: "m4",
        heading: "Manifesto 4 — Responding to change",
        intervention: "Each senior leader (BoD, CXO, VP, Director) reads one agile change guide and shares the top three takeaways with the wider group.",
        rationale: "Senior-leadership buy-in is a must-have for agile to succeed; if a leader can't or won't do this, figure out why before hiring a consultant.",
        get: |a| a.manifesto.m4.done,
    },
    Spec {
        item_key: "p1",
        heading: "Principle 1 — Customer satisfaction",
        intervention: "Stand up a basic Net Promoter Score measurement for every product line, owned by the product lead.",
        rationale: "NPS is quick, widespread, and \"good enough\" — it gives the consultant a baseline metric to move.",
        get: |a| a.principles.p1.done,
    },
    Spec {
        item_key: "p2",
        heading: "Principle 2 — Welcome changing requirements",
        intervention: "Internationalize the \"hello world\" program to one additional language using the user locale.",
        rationale: "A simple, easy-to-understand change that exposes how quickly the team can implement and ship a real requirement change.",
        get: |a| a.principles.p2.done,
    },
    Spec {
        item_key: "p3",
        heading: "Principle 3 — Deliver working software frequently",
        intervention: "Launch the internationalized \"hello world\" program to production and verify the translation with a native speaker.",
        rationale: "Closes the loop on the previous exercise and tests the upgrade pipeline end-to-end.",
        get: |a| a.principles.p3.done,
    },
    Spec {
        item_key: "p4",
        heading: "Principle 4 — Business and developers together",
        intervention: "Get explicit commitment from every product / project / programme / practice lead to shared agile ways of working.",
        rationale: "Surface stakeholder conflicts before the consultant arrives so they can spend time on improvement rather than refereeing.",
        get: |a| a.principles.p4.done,
    },
    Spec {
        item_key: "p5",
        heading: "Principle 5 — Motivated individuals",
        intervention: "Pick a motivated individual, a customer, and a \"3 amigos\" team (business + dev + test) and ship a real new MVP to production within 30 days, on budget.",
        rationale: "Proves the organisation can clear a path for a motivated team — the unit of work the consultant will scale.",
        get: |a| a.principles.p5.done,
    },
    Spec {
        item_key: "p6",
        heading: "Principle 6 — Face-to-face conversation",
        intervention: "Get commitment from every product owner that staff will be face-to-face > 50% of the time (or, for remote orgs, pick one weekly all-team video day).",
        rationale: "In practice, all-in-person is approximately +20% faster and +20% higher quality; remote orgs need a deliberate substitute.",
        get: |a| a.principles.p6.done,
    },
    Spec {
        item_key: "p7",
        heading: "Principle 7 — Working software is the primary measure",
        intervention: "Create and ship a new \"fizz buzz\" program to production.",
        rationale: "A second, trivial production launch confirms the deployment exercise from manifesto-2 wasn't a one-off.",
        get: |a| a.principles.p7.done,
    },
    Spec {
        item_key: "p8",
        heading: "Principle 8 — Sustainable pace",
        intervention: "Secure a sustaining budget for all staff for at least one year; if you can't, document why not before any procurement.",
        rationale: "Lack of sustainability is a frequent trouble spot for agile change; a consultant cannot fix an under-budgeted team.",
        get: |a| a.principles.p8.done,
    },
    Spec {
        item_key: "p9",
        heading: "Principle 9 — Technical excellence",
        intervention: "Wire quality-attribute metrics into pre-commit hooks and continuous-integration jobs on every product team.",
        rationale: "Without an objective quality baseline the consultant has no signal to improve; this is the prerequisite for credible after-vs-before.",
        get: |a| a.principles.p9.done,
    },
    Spec {
        item_key: "p10",
        heading: "Principle 10 — Simplicity",
        intervention: "Identify at least two process-improvement-capable people per product team (Lean, Six Sigma, value stream mapping, TPS, or equivalent).",
        rationale: "These tactics correlate highly with large-organisation agile readiness; without them, the consultant is the only practitioner.",
        get: |a| a.principles.p10.done,
    },
    Spec {
        item_key: "p11",
        heading: "Principle 11 — Self-organizing teams",
        intervention: "Measure self-organisation on a 5-point Likert (\"Our team is self-organising\"). If the team average is below \"Agree\", improve self-organisation first (e.g. via The Vanguard Method).",
        rationale: "Self-organising teams are the precondition for emergent architectures, requirements, and designs — and for a consultant's recommendations to stick.",
        get: |a| a.principles.p11.done,
    },
    Spec {
        item_key: "p12",
        heading: "Principle 12 — Reflection",
        intervention: "Require every leader to run regular retrospectives and share the previous two with all stakeholders.",
        rationale: "Reflection is the mechanism by which agile self-corrects; many leaders skip it, which causes agile change to fail.",
        get: |a| a.principles.p12.done,
    },
];

/// Return one `RecommendedAction` per item the respondent marked `false`.
/// Unanswered items (`None`) are intentionally skipped.
pub fn get_recommended_actions(data: &AgileConsultingScorecardAssessment) -> Vec<RecommendedAction> {
    ACTIONS
        .iter()
        .filter(|s| (s.get)(data) == Some(false))
        .map(|s| RecommendedAction {
            item_key: s.item_key.into(),
            heading: s.heading.into(),
            intervention: s.intervention.into(),
            rationale: s.rationale.into(),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn empty() -> AgileConsultingScorecardAssessment {
        AgileConsultingScorecardAssessment::default()
    }

    #[test]
    fn empty_assessment_has_no_recommendations() {
        assert_eq!(get_recommended_actions(&empty()).len(), 0);
    }

    #[test]
    fn explicit_false_items_produce_recommendations_in_order() {
        let mut a = empty();
        a.manifesto.m3.done = Some(false);
        a.principles.p1.done = Some(false);
        a.principles.p7.done = Some(false);
        let actions = get_recommended_actions(&a);
        let keys: Vec<&str> = actions.iter().map(|x| x.item_key.as_str()).collect();
        assert_eq!(keys, vec!["m3", "p1", "p7"]);
    }

    #[test]
    fn all_false_produces_16_recommendations() {
        let mut a = empty();
        a.manifesto.m1.done = Some(false);
        a.manifesto.m2.done = Some(false);
        a.manifesto.m3.done = Some(false);
        a.manifesto.m4.done = Some(false);
        a.principles.p1.done = Some(false);
        a.principles.p2.done = Some(false);
        a.principles.p3.done = Some(false);
        a.principles.p4.done = Some(false);
        a.principles.p5.done = Some(false);
        a.principles.p6.done = Some(false);
        a.principles.p7.done = Some(false);
        a.principles.p8.done = Some(false);
        a.principles.p9.done = Some(false);
        a.principles.p10.done = Some(false);
        a.principles.p11.done = Some(false);
        a.principles.p12.done = Some(false);
        assert_eq!(get_recommended_actions(&a).len(), 16);
    }

    #[test]
    fn golden_sample_produces_seven_recommendations() {
        let assessment_json = include_str!("../../../samples/sample-assessment.json");
        let a: AgileConsultingScorecardAssessment =
            serde_json::from_str(assessment_json).expect("parse sample");
        let actions = get_recommended_actions(&a);
        let keys: Vec<&str> = actions.iter().map(|x| x.item_key.as_str()).collect();
        assert_eq!(keys, vec!["m3", "p1", "p5", "p7", "p9", "p10", "p11"]);
    }

    #[test]
    fn null_items_are_skipped() {
        let mut a = empty();
        a.manifesto.m1.done = None;
        a.manifesto.m2.done = Some(false);
        a.manifesto.m3.done = Some(true);
        let actions = get_recommended_actions(&a);
        let keys: Vec<&str> = actions.iter().map(|x| x.item_key.as_str()).collect();
        assert_eq!(keys, vec!["m2"]);
    }
}
