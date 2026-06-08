//! Impact module.

use crate::scoring::types::{FiredRule, Instrument, RagBand};

/// Grade.
pub fn grade(t: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let v = t.unwrap_or(0);
    (RagBand::Green, vec![FiredRule {
        rule_id: format!("R-IMPACT-T{v}"),
        instrument: Instrument::Impact,
        grade: "green".into(),
        category: "impact".into(),
        description: format!("Impact tier {v}/5 (informational)."),
    }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn t5_green() { assert_eq!(grade(Some(5)).0, RagBand::Green); }
    #[test] fn t1_green() { assert_eq!(grade(Some(1)).0, RagBand::Green); }
}
