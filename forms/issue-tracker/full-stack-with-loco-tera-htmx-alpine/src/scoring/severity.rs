use crate::scoring::types::{Band, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let Some(sev) = scores.score_by_severity_of_impact else {
        return (Band::Low, vec![]);
    };
    let band = match sev {
        5 => Band::Critical,
        4 => Band::High,
        3 => Band::Moderate,
        _ => Band::Low,
    };
    let label = match sev {
        1 => "minimal impact",
        2 => "minor impact",
        3 => "moderate impact",
        4 => "major impact",
        _ => "catastrophic impact",
    };
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-SEVERITY-{sev}"),
            instrument: Instrument::Severity,
            grade: sev.to_string(),
            category: "impact".into(),
            description: format!("Severity of impact {sev} — {label}."),
            band,
        }],
    )
}
