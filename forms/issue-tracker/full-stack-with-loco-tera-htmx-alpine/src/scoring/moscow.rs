use crate::scoring::types::{Band, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let Some(m) = scores.score_by_moscow_requirement else {
        return (Band::Low, vec![]);
    };
    let band = match m {
        1 => Band::High,
        2 => Band::Moderate,
        _ => Band::Low,
    };
    let label = match m {
        1 => "must have",
        2 => "should have",
        3 => "could have",
        _ => "won't have",
    };
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-MOSCOW-{m}"),
            instrument: Instrument::Moscow,
            grade: m.to_string(),
            category: "requirement".into(),
            description: format!("MoSCoW classification {m} — {label}."),
            band,
        }],
    )
}
