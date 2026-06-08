//! Alignment module.

use crate::scoring::types::{FiredRule, Instrument, RagBand};

/// Grade.
pub fn grade(g: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let band = match g {
        None => RagBand::Amber,
        Some(v) if v >= 4 => RagBand::Green,
        Some(v) if v <= 2 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-ALIGNMENT-{}", band.as_str().to_uppercase());
    let desc = match g { None => "Alignment missing — amber.".to_string(), Some(v) => format!("Alignment {v}/5 → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Alignment, grade: band.as_str().into(), category: "alignment".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn g5_green() { assert_eq!(grade(Some(5)).0, RagBand::Green); }
    #[test] fn g3_amber() { assert_eq!(grade(Some(3)).0, RagBand::Amber); }
    #[test] fn g1_red() { assert_eq!(grade(Some(1)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
