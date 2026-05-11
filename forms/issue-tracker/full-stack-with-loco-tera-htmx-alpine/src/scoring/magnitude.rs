use crate::scoring::types::{Band, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let Some(mag) = scores.score_by_magnitude_of_damage else {
        return (Band::Low, vec![]);
    };
    let band = if mag >= 9 {
        Band::Critical
    } else if mag >= 6 {
        Band::High
    } else if mag >= 3 {
        Band::Moderate
    } else {
        Band::Low
    };
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-MAGNITUDE-{mag}"),
            instrument: Instrument::Magnitude,
            grade: mag.to_string(),
            category: "damage".into(),
            description: format!("Magnitude of damage {mag} on a 1-10 Richter-style scale."),
            band,
        }],
    )
}
