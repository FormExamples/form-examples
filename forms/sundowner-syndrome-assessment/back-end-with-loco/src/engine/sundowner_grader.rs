//! Sundowner grader module.

// Sundowner syndrome grader. Pure functions: take an `AssessmentData`
// object, return the CMAI total, NPI total, severity band, and a list
// of fired rules summarising which scoring bands and elevated NPI
// domains were triggered.
//
// Unanswered CMAI items (score 0) are scored as 1 ("Never") so that a
// partially-complete form still classifies sensibly. `cmai_answered_count`
// is reported separately so the report can show completion progress.

use super::flagged_issues::detect_additional_flags;
use super::sundowner_rules::{cmai_items, npi_domains};
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::{severity_from_cmai, severity_label};

/// Sum of the 29 CMAI items. Unanswered (0) items are treated as 1 (Never).
fn sum_cmai(data: &AssessmentData) -> (i32, u32) {
    let mut total = 0i32;
    let mut answered = 0u32;
    for item in cmai_items() {
        let v = data
            .behavioural_symptoms
            .cmai
            .get(item.id)
            .copied()
            .unwrap_or(0);
        if (1..=7).contains(&v) {
            total += v;
            answered += 1;
        } else {
            total += 1;
        }
    }
    (total, answered)
}

/// Per-domain NPI score (frequency * severity, 0 if either is out of range).
pub struct NpiDomainSum {
    /// Key.
    pub key: &'static str,
    /// Label.
    pub label: &'static str,
    /// Score.
    pub score: i32,
    /// Frequency.
    pub frequency: i32,
    /// Severity.
    pub severity: i32,
}

/// Sum of the 12 NPI domain scores.
fn sum_npi(data: &AssessmentData) -> (i32, u32, Vec<NpiDomainSum>) {
    let mut total = 0i32;
    let mut answered = 0u32;
    let mut per_domain: Vec<NpiDomainSum> = Vec::new();
    for domain in npi_domains() {
        let entry = data.behavioural_symptoms.npi.get(domain.key);
        let f = entry.map(|e| e.frequency).unwrap_or(0);
        let s = entry.map(|e| e.severity).unwrap_or(0);
        let score = if (1..=4).contains(&f) && (1..=3).contains(&s) {
            f * s
        } else {
            0
        };
        if score > 0 {
            answered += 1;
        }
        total += score;
        per_domain.push(NpiDomainSum {
            key: domain.key,
            label: domain.label,
            score,
            frequency: f,
            severity: s,
        });
    }
    (total, answered, per_domain)
}

/// Grade the sundowner assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let (cmai_score, cmai_answered) = sum_cmai(data);
    let (npi_score, npi_answered, per_domain) = sum_npi(data);
    let severity = severity_from_cmai(cmai_score);

    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // ─── CMAI-BAND ──────────────────────────────────────────────
    fired_rules.push(FiredRule {
        id: "CMAI-BAND".to_string(),
        category: "CMAI Total".to_string(),
        description: format!(
            "CMAI total {cmai_score} of 203 ({cmai_answered} of 29 items observed)."
        ),
        detail: format!(
            "Severity band: {} (CMAI thresholds: 29-45 mild, 46-75 moderate, 76-120 severe, >120 critical).",
            severity_label(&severity)
        ),
    });

    // ─── CMAI-DAILY (items rated >= 5) ─────────────────────────
    let high_cmai: Vec<&'static super::sundowner_rules::CmaiItem> = cmai_items()
        .iter()
        .filter(|item| {
            data.behavioural_symptoms
                .cmai
                .get(item.id)
                .copied()
                .unwrap_or(0)
                >= 5
        })
        .collect();
    if !high_cmai.is_empty() {
        let detail = high_cmai
            .iter()
            .map(|i| format!("#{} {}", i.number, i.label))
            .collect::<Vec<_>>()
            .join("; ");
        fired_rules.push(FiredRule {
            id: "CMAI-DAILY".to_string(),
            category: "CMAI Items".to_string(),
            description: format!(
                "{} CMAI item(s) occurring at least daily.",
                high_cmai.len()
            ),
            detail,
        });
    }

    // ─── NPI-TOTAL band ────────────────────────────────────────
    let npi_band = if npi_score >= 48 {
        "markedly elevated"
    } else if npi_score >= 24 {
        "moderately elevated"
    } else if npi_score >= 12 {
        "mildly elevated"
    } else {
        "within normal limits"
    };
    fired_rules.push(FiredRule {
        id: "NPI-TOTAL".to_string(),
        category: "NPI Total".to_string(),
        description: format!(
            "NPI total {npi_score} of 144 across 12 domains ({npi_answered} domain(s) endorsed)."
        ),
        detail: format!("NPI total is {npi_band}."),
    });

    // ─── NPI-DOMAINS (score >= 4) ──────────────────────────────
    let elevated: Vec<&NpiDomainSum> = per_domain.iter().filter(|d| d.score >= 4).collect();
    if !elevated.is_empty() {
        let detail = elevated
            .iter()
            .map(|d| format!("{} (F{} x S{} = {})", d.label, d.frequency, d.severity, d.score))
            .collect::<Vec<_>>()
            .join("; ");
        fired_rules.push(FiredRule {
            id: "NPI-DOMAINS".to_string(),
            category: "NPI Domains".to_string(),
            description: format!("{} NPI domain(s) with score >= 4.", elevated.len()),
            detail,
        });
    }

    let additional_flags = detect_additional_flags(data);
    let timestamp = chrono::Utc::now().to_rfc3339();

    GradingResult {
        cmai_score,
        npi_score,
        severity,
        cmai_answered_count: cmai_answered,
        npi_answered_count: npi_answered,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
