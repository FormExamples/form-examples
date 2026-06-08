//! Smart module.

use crate::scoring::types::{FiredRule, Instrument, RagBand};

/// Grade.
pub fn grade(q: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let band = match q {
        None => RagBand::Amber,
        Some(v) if v >= 4 => RagBand::Green,
        Some(v) if v <= 1 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-SMART-{}", band.as_str().to_uppercase());
    let desc = match q { None => "SMART missing — amber.".to_string(), Some(v) => format!("SMART {v}/5 → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Smart, grade: band.as_str().into(), category: "smart".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn s5_green() { assert_eq!(grade(Some(5)).0, RagBand::Green); }
    #[test] fn s3_amber() { assert_eq!(grade(Some(3)).0, RagBand::Amber); }
    #[test] fn s1_red() { assert_eq!(grade(Some(1)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
