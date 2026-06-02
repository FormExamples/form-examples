use super::types::{AssessmentData, DomainGrade, FiredRule};
use super::utils::{eq5d_summary, promis_gph_t_score, promis_mh_t_score};

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
enum InstrumentResult {
    Improved,
    Worsened,
    Stable,
    Missing,
}

fn grade_eq5d(data: &AssessmentData) -> InstrumentResult {
    let s = eq5d_summary(&data.prom_eq5d5l);
    let total = 6; // 5 dimensions + VAS
    if s.missing == total {
        return InstrumentResult::Missing;
    }
    if s.worsened > s.improved {
        return InstrumentResult::Worsened;
    }
    if s.improved > s.worsened && s.improved > 0 {
        return InstrumentResult::Improved;
    }
    InstrumentResult::Stable
}

fn grade_grc(data: &AssessmentData) -> InstrumentResult {
    match data.prom_grc.global_rating_of_change {
        None => InstrumentResult::Missing,
        Some(v) if v > 0 => InstrumentResult::Improved,
        Some(v) if v < 0 => InstrumentResult::Worsened,
        Some(_) => InstrumentResult::Stable,
    }
}

fn grade_promis(data: &AssessmentData) -> InstrumentResult {
    let gph = promis_gph_t_score(&data.prom_promis);
    let gmh = promis_mh_t_score(&data.prom_promis);
    if gph.is_none() && gmh.is_none() {
        return InstrumentResult::Missing;
    }
    let scores: Vec<f64> = [gph, gmh].iter().filter_map(|s| *s).collect();
    let avg: f64 = scores.iter().sum::<f64>() / scores.len() as f64;
    if avg >= 50.0 {
        InstrumentResult::Improved
    } else if avg >= 35.0 {
        InstrumentResult::Stable
    } else {
        InstrumentResult::Worsened
    }
}

pub struct PromResult {
    pub grade: DomainGrade,
    pub rules: Vec<FiredRule>,
}

/// Grade the PROM domain from EQ-5D-5L, GRC, and PROMIS composite.
pub fn grade_prom(data: &AssessmentData) -> PromResult {
    let results: [(&str, InstrumentResult); 3] = [
        ("EQ-5D-5L", grade_eq5d(data)),
        ("GRC", grade_grc(data)),
        ("PROMIS", grade_promis(data)),
    ];

    let mut rules: Vec<FiredRule> = Vec::new();
    let non_missing: Vec<&(&str, InstrumentResult)> = results
        .iter()
        .filter(|(_, r)| *r != InstrumentResult::Missing)
        .collect();

    if non_missing.is_empty() {
        return PromResult { grade: String::new(), rules };
    }

    let improved_count = non_missing.iter().filter(|(_, r)| *r == InstrumentResult::Improved).count();
    let worsened_count = non_missing.iter().filter(|(_, r)| *r == InstrumentResult::Worsened).count();

    let grade: DomainGrade = if worsened_count >= 2 {
        rules.push(FiredRule {
            id: "PROM-005".to_string(),
            domain: "PROM".to_string(),
            description: "Multiple PROM instruments worsened".to_string(),
            grade: "E".to_string(),
        });
        "E".to_string()
    } else if worsened_count == 1 {
        let worsened_name = non_missing
            .iter()
            .find(|(_, r)| *r == InstrumentResult::Worsened)
            .map(|(n, _)| *n)
            .unwrap_or("");
        rules.push(FiredRule {
            id: "PROM-004".to_string(),
            domain: "PROM".to_string(),
            description: format!("{worsened_name} shows worsening"),
            grade: "D".to_string(),
        });
        "D".to_string()
    } else if improved_count >= 3 {
        rules.push(FiredRule {
            id: "PROM-001".to_string(),
            domain: "PROM".to_string(),
            description: "All three PROM instruments improved".to_string(),
            grade: "A".to_string(),
        });
        "A".to_string()
    } else if improved_count >= 2 {
        rules.push(FiredRule {
            id: "PROM-002".to_string(),
            domain: "PROM".to_string(),
            description: "Two or more PROM instruments improved".to_string(),
            grade: "B".to_string(),
        });
        "B".to_string()
    } else {
        rules.push(FiredRule {
            id: "PROM-003".to_string(),
            domain: "PROM".to_string(),
            description: "PROM instruments stable (no significant improvement or worsening)"
                .to_string(),
            grade: "C".to_string(),
        });
        "C".to_string()
    };

    PromResult { grade, rules }
}
