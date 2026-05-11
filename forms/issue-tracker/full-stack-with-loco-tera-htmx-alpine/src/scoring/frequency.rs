use crate::scoring::types::{Band, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let Some(f) = scores.score_by_frequency_percent else {
        return (Band::Low, vec![]);
    };
    let band = if f >= 75.0 {
        Band::Critical
    } else if f >= 25.0 {
        Band::High
    } else if f >= 5.0 {
        Band::Moderate
    } else {
        Band::Low
    };
    let pct = if (f.fract()).abs() < f64::EPSILON {
        format!("{}%", f as i64)
    } else {
        format!("{f:.2}%")
    };
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-FREQUENCY-{}", f.round() as i64),
            instrument: Instrument::Frequency,
            grade: pct.clone(),
            category: "reach".into(),
            description: format!("Frequency of occurrence {pct} of usage affected."),
            band,
        }],
    )
}
