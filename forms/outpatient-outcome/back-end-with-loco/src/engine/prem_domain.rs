use super::types::{AssessmentData, DomainGrade, FiredRule};

pub struct PremResult {
    pub grade: DomainGrade,
    pub rules: Vec<FiredRule>,
}

/// Grade the PREM domain from the NHS Friends and Family Test (FFT) response.
///
/// extremely_likely    → A (Very Good)
/// likely              → B (Good)
/// neither             → C (Neither good nor poor)
/// unlikely            → D (Poor)
/// extremely_unlikely  → E (Very Poor)
/// dont_know / ''      → '' (data quality flag — no grade assigned)
pub fn grade_prem(data: &AssessmentData) -> PremResult {
    let fft = data.prem_fft.fft_response.as_str();
    let mut rules: Vec<FiredRule> = Vec::new();
    let grade: DomainGrade = match fft {
        "extremely_likely" => {
            rules.push(FiredRule {
                id: "PREM-001".to_string(),
                domain: "PREM".to_string(),
                description: "FFT response: Extremely Likely (Very Good)".to_string(),
                grade: "A".to_string(),
            });
            "A".to_string()
        }
        "likely" => {
            rules.push(FiredRule {
                id: "PREM-002".to_string(),
                domain: "PREM".to_string(),
                description: "FFT response: Likely (Good)".to_string(),
                grade: "B".to_string(),
            });
            "B".to_string()
        }
        "neither" => {
            rules.push(FiredRule {
                id: "PREM-003".to_string(),
                domain: "PREM".to_string(),
                description: "FFT response: Neither good nor poor".to_string(),
                grade: "C".to_string(),
            });
            "C".to_string()
        }
        "unlikely" => {
            rules.push(FiredRule {
                id: "PREM-004".to_string(),
                domain: "PREM".to_string(),
                description: "FFT response: Unlikely (Poor)".to_string(),
                grade: "D".to_string(),
            });
            "D".to_string()
        }
        "extremely_unlikely" => {
            rules.push(FiredRule {
                id: "PREM-005".to_string(),
                domain: "PREM".to_string(),
                description: "FFT response: Extremely Unlikely (Very Poor)".to_string(),
                grade: "E".to_string(),
            });
            "E".to_string()
        }
        _ => String::new(),
    };
    PremResult { grade, rules }
}
