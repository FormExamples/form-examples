use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(t: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let name = match t.unwrap_or(1) { 1 => "COMMITTED", 2 => "ASPIRATIONAL", 3 => "MOONSHOT", _ => "COMMITTED" };
    (RagBand::Green, vec![FiredRule {
        rule_id: format!("R-STRETCH-{name}"),
        instrument: Instrument::Stretch,
        grade: "green".into(),
        category: "stretch".into(),
        description: format!("Stretch tier: {} (informational, modulates progress).", name.to_lowercase()),
    }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn committed() { assert!(grade(Some(1)).1[0].rule_id.contains("COMMITTED")); }
    #[test] fn moonshot() { assert!(grade(Some(3)).1[0].rule_id.contains("MOONSHOT")); }
}
