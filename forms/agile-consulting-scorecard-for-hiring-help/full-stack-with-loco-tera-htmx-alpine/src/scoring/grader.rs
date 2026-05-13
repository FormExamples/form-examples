use crate::scoring::flags;
use crate::scoring::manifesto;
use crate::scoring::principles;
use crate::scoring::types::{
    AgileConsultingScorecardAssessment, FiredRule, GradeResult, Instrument,
};
use crate::scoring::utils::{band_to_recommendation, total_to_band};

/// Top-level scoring entrypoint. Mirrors the TypeScript `gradeScorecard` in
/// `front-end-form-with-svelte/src/lib/engine/score-grader.ts`.
///
/// Algorithm: sum-of-points. One point per "yes" answer across the 16
/// items. The band is read from a fixed table (see `utils::total_to_band`).
pub fn grade_scorecard(data: &AgileConsultingScorecardAssessment) -> GradeResult {
    let (manifesto_subtotal, manifesto_rules) = manifesto::grade(&data.manifesto);
    let (principles_subtotal, principles_rules) = principles::grade(&data.principles);

    let score_total = manifesto_subtotal + principles_subtotal;
    let computed_band = total_to_band(score_total);
    let recommendation = band_to_recommendation(computed_band);

    let mut fired_rules: Vec<FiredRule> = Vec::with_capacity(17);
    fired_rules.extend(manifesto_rules);
    fired_rules.extend(principles_rules);
    fired_rules.push(FiredRule {
        rule_id: format!("R-COMPOSITE-{}", computed_band.as_str().to_uppercase()),
        instrument: Instrument::Composite,
        item_number: None,
        grade: computed_band.as_str().to_string(),
        points_awarded: 0,
        category: "composite".into(),
        description: format!(
            "Total {score_total}/16 places the organization in the \"{}\" readiness band.",
            computed_band.as_str()
        ),
    });

    GradeResult {
        score_total,
        manifesto_subtotal,
        principles_subtotal,
        computed_band,
        recommendation,
        fired_rules,
        additional_flags: flags::compute(data),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scoring::types::{
        Band, ChecklistItem, ManifestoItems, PrinciplesItems, Recommendation,
    };

    fn item(done: Option<bool>) -> ChecklistItem {
        ChecklistItem { done, evidence: String::new() }
    }

    fn assessment_with(
        m: [Option<bool>; 4],
        p: [Option<bool>; 12],
    ) -> AgileConsultingScorecardAssessment {
        AgileConsultingScorecardAssessment {
            organization: Default::default(),
            respondent: Default::default(),
            assessment: Default::default(),
            manifesto: ManifestoItems {
                m1: item(m[0]),
                m2: item(m[1]),
                m3: item(m[2]),
                m4: item(m[3]),
            },
            principles: PrinciplesItems {
                p1: item(p[0]),
                p2: item(p[1]),
                p3: item(p[2]),
                p4: item(p[3]),
                p5: item(p[4]),
                p6: item(p[5]),
                p7: item(p[6]),
                p8: item(p[7]),
                p9: item(p[8]),
                p10: item(p[9]),
                p11: item(p[10]),
                p12: item(p[11]),
            },
        }
    }

    #[test]
    fn empty_scorecard_is_low() {
        let r = grade_scorecard(&AgileConsultingScorecardAssessment::default());
        assert_eq!(r.score_total, 0);
        assert_eq!(r.computed_band, Band::Low);
        assert_eq!(r.recommendation, Recommendation::DoNotHireYet);
        assert!(r.additional_flags.is_empty());
    }

    #[test]
    fn all_true_is_high() {
        let r = grade_scorecard(&assessment_with(
            [Some(true); 4],
            [Some(true); 12],
        ));
        assert_eq!(r.score_total, 16);
        assert_eq!(r.manifesto_subtotal, 4);
        assert_eq!(r.principles_subtotal, 12);
        assert_eq!(r.computed_band, Band::High);
        assert_eq!(r.recommendation, Recommendation::TrialEngagement);
    }

    #[test]
    fn band_boundaries() {
        let p_zero: [Option<bool>; 12] = [None; 12];
        let r4 = grade_scorecard(&assessment_with([Some(true); 4], p_zero));
        assert_eq!(r4.computed_band, Band::Low);

        let mut p5 = p_zero;
        p5[0] = Some(true);
        let r5 = grade_scorecard(&assessment_with([Some(true); 4], p5));
        assert_eq!(r5.computed_band, Band::Borderline);

        let mut p6 = p_zero;
        p6[0] = Some(true);
        p6[1] = Some(true);
        let r6 = grade_scorecard(&assessment_with([Some(true); 4], p6));
        assert_eq!(r6.computed_band, Band::Medium);

        let mut p11: [Option<bool>; 12] = [None; 12];
        for slot in p11.iter_mut().take(7) {
            *slot = Some(true);
        }
        let r11 = grade_scorecard(&assessment_with([Some(true); 4], p11));
        assert_eq!(r11.score_total, 11);
        assert_eq!(r11.computed_band, Band::High);
    }

    #[test]
    fn null_does_not_score_or_flag() {
        let r = grade_scorecard(&AgileConsultingScorecardAssessment::default());
        assert_eq!(r.score_total, 0);
        assert!(r.additional_flags.is_empty());
    }

    #[test]
    fn explicit_false_fires_flags() {
        let r = grade_scorecard(&assessment_with(
            [Some(false); 4],
            [Some(false); 12],
        ));
        let cats: Vec<_> = r
            .additional_flags
            .iter()
            .map(|f| f.category)
            .collect();
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoSeniorLeadershipBuyin));
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoCustomerContact));
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoWorkingSoftware));
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoSustainableBudget));
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoSelfOrganization));
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoReflectionCulture));
    }

    #[test]
    fn working_software_flag_needs_both_false() {
        // Only m2 false → no working-software flag
        let mut m = [None; 4];
        m[1] = Some(false);
        let r = grade_scorecard(&assessment_with(m, [None; 12]));
        let cats: Vec<_> = r.additional_flags.iter().map(|f| f.category).collect();
        assert!(!cats.contains(&crate::scoring::types::FlagCategory::NoWorkingSoftware));

        // Both m2 and p7 false → flag fires
        let mut m = [None; 4];
        m[1] = Some(false);
        let mut p: [Option<bool>; 12] = [None; 12];
        p[6] = Some(false);
        let r = grade_scorecard(&assessment_with(m, p));
        let cats: Vec<_> = r.additional_flags.iter().map(|f| f.category).collect();
        assert!(cats.contains(&crate::scoring::types::FlagCategory::NoWorkingSoftware));
    }

    #[test]
    fn fired_rules_count_is_seventeen() {
        let r = grade_scorecard(&AgileConsultingScorecardAssessment::default());
        assert_eq!(r.fired_rules.len(), 17);
    }

    /// Engine-parity guard. The Rust engine here and the TypeScript engine
    /// in `front-end-form-with-svelte/src/lib/engine/score-grader.ts` must
    /// both produce the same `GradeResult` for
    /// `samples/sample-assessment.json`. The two files are baked into the
    /// binary via `include_str!` so the test is hermetic.
    #[test]
    fn matches_golden_sample() {
        let assessment_json = include_str!("../../../samples/sample-assessment.json");
        let expected_json = include_str!("../../../samples/sample-grade.json");

        let assessment: AgileConsultingScorecardAssessment =
            serde_json::from_str(assessment_json).expect("parse sample assessment");
        let expected: serde_json::Value =
            serde_json::from_str(expected_json).expect("parse sample grade");

        let actual = grade_scorecard(&assessment);
        let actual_json = serde_json::to_value(&actual).expect("serialise actual grade");

        assert_eq!(actual_json, expected);
    }
}
