use crate::scoring::flags;
use crate::scoring::types::{
    Band, CompositePriority, FiredRule, GradeResult, Instrument, IssueTrackerAssessment,
};
use crate::scoring::utils::max_band;
use crate::scoring::{failure, frequency, harm, magnitude, moscow, priority, severity};

/// Top-level scoring entrypoint. Mirrors the TypeScript `gradeIssue` in
/// `front-end-form-with-svelte/src/lib/engine/composite-grader.ts`.
///
/// Algorithm: max-grade. The composite is the worst single-dimension band
/// across all seven instruments.
pub fn grade_issue(data: &IssueTrackerAssessment) -> GradeResult {
    let p = priority::grade(&data.scores);
    let sev = severity::grade(&data.scores);
    let mag = magnitude::grade(&data.scores);
    let h = harm::grade(&data.scores);
    let f = failure::grade(&data.scores);
    let m = moscow::grade(&data.scores);
    let freq = frequency::grade(&data.scores);

    let composite_band = max_band(&[p.0, sev.0, mag.0, h.0, f.0, m.0, freq.0]);
    let composite_priority: CompositePriority = composite_band;

    let mut fired_rules: Vec<FiredRule> = Vec::with_capacity(8);
    fired_rules.extend(p.1);
    fired_rules.extend(sev.1);
    fired_rules.extend(mag.1);
    fired_rules.extend(h.1);
    fired_rules.extend(f.1);
    fired_rules.extend(m.1);
    fired_rules.extend(freq.1);
    fired_rules.push(FiredRule {
        rule_id: format!("R-COMPOSITE-{}", composite_priority.as_str().to_uppercase()),
        instrument: Instrument::Composite,
        grade: composite_priority.as_str().to_string(),
        category: "composite".into(),
        description: format!(
            "Composite priority is {} — the worst band across all seven instruments.",
            composite_priority.as_str()
        ),
        band: composite_band,
    });

    GradeResult {
        score_by_priority_rank: data.scores.score_by_priority_rank,
        score_by_severity_of_impact: data.scores.score_by_severity_of_impact,
        score_by_magnitude_of_damage: data.scores.score_by_magnitude_of_damage,
        score_by_harm_grade: data.scores.score_by_harm_grade,
        score_by_failure_condition: data.scores.score_by_failure_condition,
        score_by_moscow_requirement: data.scores.score_by_moscow_requirement,
        score_by_frequency_percent: data.scores.score_by_frequency_percent,
        composite_priority,
        fired_rules,
        additional_flags: flags::compute(data),
    }
}

fn _band_assertions(_b: Band) {} // keep Band path used at lib level
