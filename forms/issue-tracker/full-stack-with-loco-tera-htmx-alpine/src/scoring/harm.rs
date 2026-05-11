use crate::scoring::types::{Band, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let Some(harm) = scores.score_by_harm_grade else {
        return (Band::Low, vec![]);
    };
    let band = match harm {
        4 | 3 => Band::Critical,
        2 => Band::High,
        1 => Band::Moderate,
        _ => Band::Low,
    };
    let label = match harm {
        0 => "no harm",
        1 => "low harm",
        2 => "moderate harm",
        3 => "severe harm",
        _ => "fatal",
    };
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-HARM-{harm}"),
            instrument: Instrument::Harm,
            grade: harm.to_string(),
            category: "patient-safety".into(),
            description: format!("NHS LFPSE harm grade {harm} — {label}."),
            band,
        }],
    )
}
