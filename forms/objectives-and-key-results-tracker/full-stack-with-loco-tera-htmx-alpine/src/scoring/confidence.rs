use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(decile: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let band = match decile {
        None => RagBand::Amber,
        Some(d) if d >= 7 => RagBand::Green,
        Some(d) if d <= 3 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-CONFIDENCE-{}", band.as_str().to_uppercase());
    let desc = match decile { None => "Confidence missing — amber.".to_string(), Some(d) => format!("Confidence {d}/10 → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Confidence, grade: band.as_str().into(), category: "confidence".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn d9_green() { assert_eq!(grade(Some(9)).0, RagBand::Green); }
    #[test] fn d5_amber() { assert_eq!(grade(Some(5)).0, RagBand::Amber); }
    #[test] fn d2_red() { assert_eq!(grade(Some(2)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
