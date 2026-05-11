use crate::scoring::types::{Band, FiredRule, Instrument, RawScores};

pub fn grade(scores: &RawScores) -> (Band, Vec<FiredRule>) {
    let Some(rank) = scores.score_by_priority_rank else {
        return (Band::Low, vec![]);
    };
    let band = if rank <= 1 {
        Band::Critical
    } else if rank == 2 {
        Band::High
    } else if rank == 3 {
        Band::Moderate
    } else {
        Band::Low
    };
    (
        band,
        vec![FiredRule {
            rule_id: format!("R-PRIORITY-{rank}"),
            instrument: Instrument::Priority,
            grade: rank.to_string(),
            category: "workflow".into(),
            description: format!("Priority rank {rank}."),
            band,
        }],
    )
}
