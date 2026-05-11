use crate::scoring::types::{Band, FailureCondition, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let cond = scores.score_by_failure_condition;
    if cond == FailureCondition::None {
        return (Band::Low, vec![]);
    }
    let (band, desc) = match cond {
        FailureCondition::A => (
            Band::Critical,
            "catastrophic — multiple fatalities, loss of system",
        ),
        FailureCondition::B => (
            Band::High,
            "hazardous — large negative impact on safety or performance",
        ),
        FailureCondition::C => (
            Band::Moderate,
            "major — significant reduction in safety margin or workload increase",
        ),
        FailureCondition::D => (Band::Low, "minor — slight reduction in safety margin"),
        FailureCondition::E => (Band::Low, "no effect"),
        FailureCondition::None => unreachable!(),
    };
    let cond_str = cond.as_str();
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-FAILURE-{cond_str}"),
            instrument: Instrument::Failure,
            grade: cond_str.to_string(),
            category: "system-safety".into(),
            description: format!("Failure condition {cond_str} — {desc}."),
            band,
        }],
    )
}
