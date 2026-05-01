//! DASS-21 grading engine.
//!
//! Pure function: given an `AssessmentData`, sum each subscale's seven 0..=3
//! item responses, double the totals to align with the DASS-42 normative
//! cutoffs, and assign a severity category.

use crate::engine::dass21_rules::dass21_rules;
use crate::engine::types::{
    AssessmentData, DassSeverity, FiredRule, Subscale, SubscaleScore,
};

/// Cutoffs (on the doubled / "scaled" score) per DASS-42 norms.
pub fn classify_depression(scaled: u32) -> DassSeverity {
    if scaled <= 9 {
        DassSeverity::Normal
    } else if scaled <= 13 {
        DassSeverity::Mild
    } else if scaled <= 20 {
        DassSeverity::Moderate
    } else if scaled <= 27 {
        DassSeverity::Severe
    } else {
        DassSeverity::ExtremelySevere
    }
}

pub fn classify_anxiety(scaled: u32) -> DassSeverity {
    if scaled <= 7 {
        DassSeverity::Normal
    } else if scaled <= 9 {
        DassSeverity::Mild
    } else if scaled <= 14 {
        DassSeverity::Moderate
    } else if scaled <= 19 {
        DassSeverity::Severe
    } else {
        DassSeverity::ExtremelySevere
    }
}

pub fn classify_stress(scaled: u32) -> DassSeverity {
    if scaled <= 14 {
        DassSeverity::Normal
    } else if scaled <= 18 {
        DassSeverity::Mild
    } else if scaled <= 25 {
        DassSeverity::Moderate
    } else if scaled <= 33 {
        DassSeverity::Severe
    } else {
        DassSeverity::ExtremelySevere
    }
}

pub struct Dass21Outcome {
    pub depression: SubscaleScore,
    pub anxiety: SubscaleScore,
    pub stress: SubscaleScore,
    pub fired_rules: Vec<FiredRule>,
}

/// Evaluate DASS-21 across all 21 items.
pub fn calculate_dass21(data: &AssessmentData) -> Dass21Outcome {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut totals = (0u32, 0u32, 0u32); // (depression, anxiety, stress)
    let mut answered = (0u32, 0u32, 0u32);

    for rule in dass21_rules() {
        if let Some(value) = (rule.evaluate)(data) {
            let v = value as u32;
            match rule.subscale {
                Subscale::Depression => {
                    totals.0 += v;
                    answered.0 += 1;
                }
                Subscale::Anxiety => {
                    totals.1 += v;
                    answered.1 += 1;
                }
                Subscale::Stress => {
                    totals.2 += v;
                    answered.2 += 1;
                }
            }
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                subscale: rule.subscale,
                item_number: rule.item_number,
                description: rule.description.to_string(),
                score: v,
            });
        }
    }

    let depression = SubscaleScore {
        raw: totals.0,
        scaled: totals.0 * 2,
        severity: classify_depression(totals.0 * 2),
        answered: answered.0,
    };
    let anxiety = SubscaleScore {
        raw: totals.1,
        scaled: totals.1 * 2,
        severity: classify_anxiety(totals.1 * 2),
        answered: answered.1,
    };
    let stress = SubscaleScore {
        raw: totals.2,
        scaled: totals.2 * 2,
        severity: classify_stress(totals.2 * 2),
        answered: answered.2,
    };

    Dass21Outcome { depression, anxiety, stress, fired_rules }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::types::*;

    fn empty_assessment() -> AssessmentData {
        AssessmentData {
            demographics: Demographics::default(),
            reason_for_assessment: ReasonForAssessment::default(),
            dass_depression: DassDepression {
                item3_could_not_experience_positive: Some(0),
                item5_difficult_initiating: Some(0),
                item10_nothing_to_look_forward_to: Some(0),
                item13_downhearted_blue: Some(0),
                item16_unable_to_become_enthusiastic: Some(0),
                item17_not_worth_much: Some(0),
                item21_life_meaningless: Some(0),
            },
            dass_anxiety: DassAnxiety {
                item2_dryness_of_mouth: Some(0),
                item4_breathing_difficulty: Some(0),
                item7_trembling: Some(0),
                item9_panic_worry: Some(0),
                item15_closed_to_panic: Some(0),
                item19_heart_action_aware: Some(0),
                item20_scared_without_reason: Some(0),
            },
            dass_stress: DassStress {
                item1_hard_to_wind_down: Some(0),
                item6_over_react: Some(0),
                item8_nervous_energy: Some(0),
                item11_agitated_easily: Some(0),
                item12_difficult_to_relax: Some(0),
                item14_intolerant: Some(0),
                item18_touchy_easily: Some(0),
            },
            functional_impact: FunctionalImpact::default(),
            risk_screen: RiskScreen::default(),
            support_and_history: SupportAndHistory::default(),
        }
    }

    fn set_depression_all(d: &mut AssessmentData, v: u8) {
        d.dass_depression = DassDepression {
            item3_could_not_experience_positive: Some(v),
            item5_difficult_initiating: Some(v),
            item10_nothing_to_look_forward_to: Some(v),
            item13_downhearted_blue: Some(v),
            item16_unable_to_become_enthusiastic: Some(v),
            item17_not_worth_much: Some(v),
            item21_life_meaningless: Some(v),
        };
    }

    fn set_anxiety_all(d: &mut AssessmentData, v: u8) {
        d.dass_anxiety = DassAnxiety {
            item2_dryness_of_mouth: Some(v),
            item4_breathing_difficulty: Some(v),
            item7_trembling: Some(v),
            item9_panic_worry: Some(v),
            item15_closed_to_panic: Some(v),
            item19_heart_action_aware: Some(v),
            item20_scared_without_reason: Some(v),
        };
    }

    fn set_stress_all(d: &mut AssessmentData, v: u8) {
        d.dass_stress = DassStress {
            item1_hard_to_wind_down: Some(v),
            item6_over_react: Some(v),
            item8_nervous_energy: Some(v),
            item11_agitated_easily: Some(v),
            item12_difficult_to_relax: Some(v),
            item14_intolerant: Some(v),
            item18_touchy_easily: Some(v),
        };
    }

    #[test]
    fn rule_set_has_21_items_split_evenly() {
        let rules = dass21_rules();
        assert_eq!(rules.len(), 21);
        let dep = rules.iter().filter(|r| r.subscale == Subscale::Depression).count();
        let anx = rules.iter().filter(|r| r.subscale == Subscale::Anxiety).count();
        let str_ = rules.iter().filter(|r| r.subscale == Subscale::Stress).count();
        assert_eq!((dep, anx, str_), (7, 7, 7));
    }

    #[test]
    fn returns_normal_for_all_zero_responses() {
        let data = empty_assessment();
        let r = calculate_dass21(&data);
        assert_eq!(r.depression.raw, 0);
        assert_eq!(r.depression.scaled, 0);
        assert_eq!(r.depression.severity, DassSeverity::Normal);
        assert_eq!(r.anxiety.severity, DassSeverity::Normal);
        assert_eq!(r.stress.severity, DassSeverity::Normal);
        assert_eq!(r.fired_rules.len(), 21);
    }

    #[test]
    fn returns_extremely_severe_for_all_threes_on_every_subscale() {
        let mut data = empty_assessment();
        set_depression_all(&mut data, 3);
        set_anxiety_all(&mut data, 3);
        set_stress_all(&mut data, 3);
        let r = calculate_dass21(&data);
        assert_eq!(r.depression.raw, 21);
        assert_eq!(r.depression.scaled, 42);
        assert_eq!(r.depression.severity, DassSeverity::ExtremelySevere);
        assert_eq!(r.anxiety.scaled, 42);
        assert_eq!(r.anxiety.severity, DassSeverity::ExtremelySevere);
        assert_eq!(r.stress.scaled, 42);
        assert_eq!(r.stress.severity, DassSeverity::ExtremelySevere);
    }

    #[test]
    fn classifies_depression_severe_boundary() {
        // raw=11 → scaled=22 → severe (cutoff 21..=27)
        let mut data = empty_assessment();
        set_depression_all(&mut data, 0);
        data.dass_depression.item3_could_not_experience_positive = Some(2);
        data.dass_depression.item5_difficult_initiating = Some(2);
        data.dass_depression.item10_nothing_to_look_forward_to = Some(2);
        data.dass_depression.item13_downhearted_blue = Some(2);
        data.dass_depression.item16_unable_to_become_enthusiastic = Some(3);
        let r = calculate_dass21(&data);
        assert_eq!(r.depression.scaled, 22);
        assert_eq!(r.depression.severity, DassSeverity::Severe);
    }

    #[test]
    fn classifies_anxiety_extremely_severe_boundary() {
        // raw=10 → scaled=20 → extremely severe (cutoff 20+)
        let mut data = empty_assessment();
        set_anxiety_all(&mut data, 1);
        data.dass_anxiety.item2_dryness_of_mouth = Some(2);
        data.dass_anxiety.item4_breathing_difficulty = Some(2);
        data.dass_anxiety.item7_trembling = Some(2);
        let r = calculate_dass21(&data);
        assert_eq!(r.anxiety.scaled, 20);
        assert_eq!(r.anxiety.severity, DassSeverity::ExtremelySevere);
    }

    #[test]
    fn treats_unanswered_items_as_not_summed_not_counted() {
        let mut data = empty_assessment();
        data.dass_depression = DassDepression::default(); // all None
        let r = calculate_dass21(&data);
        assert_eq!(r.depression.raw, 0);
        assert_eq!(r.depression.answered, 0);
        let dep_fired = r.fired_rules.iter().filter(|f| f.subscale == Subscale::Depression).count();
        assert_eq!(dep_fired, 0);
        let anx_fired = r.fired_rules.iter().filter(|f| f.subscale == Subscale::Anxiety).count();
        assert_eq!(anx_fired, 7);
    }
}
