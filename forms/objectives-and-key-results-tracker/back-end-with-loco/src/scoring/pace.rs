//! Pace module.

use crate::scoring::types::{FiredRule, Instrument, RagBand};

/// Grade.
pub fn grade(d: Option<f64>) -> (RagBand, Vec<FiredRule>) {
    let band = match d {
        None => RagBand::Amber,
        Some(v) if v >= -10.0 => RagBand::Green,
        Some(v) if v <= -50.0 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-PACE-{}", band.as_str().to_uppercase());
    let desc = match d { None => "Pace missing — amber.".to_string(), Some(v) => format!("Pace deviation {v}% → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Pace, grade: band.as_str().into(), category: "pace".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn zero_green() { assert_eq!(grade(Some(0.0)).0, RagBand::Green); }
    #[test] fn neg9_green() { assert_eq!(grade(Some(-9.0)).0, RagBand::Green); }
    #[test] fn neg25_amber() { assert_eq!(grade(Some(-25.0)).0, RagBand::Amber); }
    #[test] fn neg60_red() { assert_eq!(grade(Some(-60.0)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
