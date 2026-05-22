use crate::scoring::types::{FiredRule, Instrument, RagBand, RawScores};

pub fn grade(s: &RawScores) -> (RagBand, Vec<FiredRule>) {
    let tier = s.stretch_tier.unwrap_or(1);
    let p = match s.progress_percent {
        None => return (RagBand::Amber, vec![rule("R-PROGRESS-MISSING", RagBand::Amber, "Progress percent missing — defaulted to amber.")]),
        Some(v) => v,
    };
    // Red threshold for committed (tier 1) aligns with the `committed-at-risk`
    // flag trigger and the spec example "a committed at 40 % is Red"
    // (design spec §3 paragraph after the RAG table).
    let (green, red) = match tier {
        1 => (70.0, 50.0),
        2 => (30.0, 10.0),
        3 => (25.0, -1.0),
        _ => (70.0, 50.0),
    };
    let band = if p >= green { RagBand::Green } else if p < red { RagBand::Red } else { RagBand::Amber };
    let rid = format!("R-PROGRESS-{}-T{}", band.as_str().to_uppercase(), tier);
    let desc = format!("Progress {p}% on stretch tier {tier} → {}.", band.as_str());
    (band, vec![rule(&rid, band, &desc)])
}

fn rule(id: &str, band: RagBand, desc: &str) -> FiredRule {
    FiredRule {
        rule_id: id.into(), instrument: Instrument::Progress, grade: band.as_str().into(),
        category: "progress".into(), description: desc.into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn base(p: Option<f64>, t: Option<i32>) -> RawScores {
        RawScores { progress_percent: p, confidence_decile: Some(7), stretch_tier: t,
            alignment_grade: Some(4), impact_tier: Some(4), smart_quality: Some(4),
            pace_deviation_percent: Some(0.0) }
    }
    #[test] fn committed_80_green() { assert_eq!(grade(&base(Some(80.0), Some(1))).0, RagBand::Green); }
    #[test] fn committed_60_amber() { assert_eq!(grade(&base(Some(60.0), Some(1))).0, RagBand::Amber); }
    #[test] fn committed_40_red() { assert_eq!(grade(&base(Some(40.0), Some(1))).0, RagBand::Red); }
    #[test] fn committed_20_red() { assert_eq!(grade(&base(Some(20.0), Some(1))).0, RagBand::Red); }
    #[test] fn aspirational_35_green() { assert_eq!(grade(&base(Some(35.0), Some(2))).0, RagBand::Green); }
    #[test] fn moonshot_15_amber() { assert_eq!(grade(&base(Some(15.0), Some(3))).0, RagBand::Amber); }
    #[test] fn null_amber() { assert_eq!(grade(&base(None, Some(1))).0, RagBand::Amber); }
}
