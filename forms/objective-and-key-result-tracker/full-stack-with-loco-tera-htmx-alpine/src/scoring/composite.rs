use crate::scoring::types::{FiredRule, GradeResult, Instrument, ObjectiveAssessment, RagBand};
use crate::scoring::utils::worst_band;
use crate::scoring::{alignment, confidence, flags, impact, pace, progress, smart, stretch};

pub fn grade_objective(a: &ObjectiveAssessment) -> GradeResult {
    let (p, p_rules) = progress::grade(&a.scores);
    let (c, c_rules) = confidence::grade(a.scores.confidence_decile);
    let (st, st_rules) = stretch::grade(a.scores.stretch_tier);
    let (al, al_rules) = alignment::grade(a.scores.alignment_grade);
    let (im, im_rules) = impact::grade(a.scores.impact_tier);
    let (sm, sm_rules) = smart::grade(a.scores.smart_quality);
    let (pa, pa_rules) = pace::grade(a.scores.pace_deviation_percent);

    let composite = worst_band(&[p, c, st, al, im, sm, pa]);

    let mut rules_fired: Vec<FiredRule> = Vec::new();
    for r in [p_rules, c_rules, st_rules, al_rules, im_rules, sm_rules, pa_rules] {
        rules_fired.extend(r);
    }
    rules_fired.push(FiredRule {
        rule_id: format!("R-COMPOSITE-{}", composite.as_str().to_uppercase()),
        instrument: Instrument::Composite,
        grade: composite.as_str().into(),
        category: "composite".into(),
        description: format!("Composite RAG {} via worst-band.", composite.as_str()),
    });

    GradeResult {
        computed_composite_rag: composite,
        rules_fired,
        flags: flags::compute(a),
    }
}
