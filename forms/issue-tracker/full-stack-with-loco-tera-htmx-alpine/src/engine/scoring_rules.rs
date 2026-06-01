//! Per-instrument grading rules. Each function returns a tuple of
//! `(band, Vec<FiredRule>)`. The rule IDs (`R-PRIORITY-{n}` etc.) are
//! preserved verbatim from the TypeScript engine in
//! `front-end-form-with-html/js/scoring.js`.

use super::types::FiredRule;
use super::utils::format_frequency_percent;

fn severity_label(s: i32) -> &'static str {
    match s {
        1 => "minimal impact",
        2 => "minor impact",
        3 => "moderate impact",
        4 => "major impact",
        5 => "catastrophic impact",
        _ => "unknown",
    }
}

fn harm_label(h: i32) -> &'static str {
    match h {
        0 => "no harm",
        1 => "low harm",
        2 => "moderate harm",
        3 => "severe harm",
        4 => "fatal",
        _ => "unknown",
    }
}

fn failure_description(c: &str) -> &'static str {
    match c {
        "A" => "catastrophic \u{2014} multiple fatalities, loss of system",
        "B" => "hazardous \u{2014} large negative impact on safety or performance",
        "C" => "major \u{2014} significant reduction in safety margin or workload increase",
        "D" => "minor \u{2014} slight reduction in safety margin",
        "E" => "no effect",
        _ => "unknown",
    }
}

fn failure_band(c: &str) -> &'static str {
    match c {
        "A" => "critical",
        "B" => "high",
        "C" => "moderate",
        "D" => "low",
        "E" => "low",
        _ => "low",
    }
}

fn moscow_label(m: i32) -> &'static str {
    match m {
        1 => "must have",
        2 => "should have",
        3 => "could have",
        4 => "won't have",
        _ => "unknown",
    }
}

/// Grade Score 1: priority rank.
/// rule IDs: `R-PRIORITY-{rank}`.
pub fn grade_priority(rank: Option<i32>) -> (String, Vec<FiredRule>) {
    let Some(rank) = rank else {
        return ("low".to_string(), vec![]);
    };
    let band = if rank <= 1 {
        "critical"
    } else if rank == 2 {
        "high"
    } else if rank == 3 {
        "moderate"
    } else {
        "low"
    };
    let band = band.to_string();
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-PRIORITY-{rank}"),
            instrument: "priority".to_string(),
            grade: rank.to_string(),
            category: "workflow".to_string(),
            description: format!("Priority rank {rank}."),
            band,
        }],
    )
}

/// Grade Score 2: severity of impact (1..5).
/// rule IDs: `R-SEVERITY-{sev}`.
pub fn grade_severity(sev: Option<i32>) -> (String, Vec<FiredRule>) {
    let Some(sev) = sev else {
        return ("low".to_string(), vec![]);
    };
    let band = if sev >= 5 {
        "critical"
    } else if sev == 4 {
        "high"
    } else if sev == 3 {
        "moderate"
    } else {
        "low"
    };
    let band = band.to_string();
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-SEVERITY-{sev}"),
            instrument: "severity".to_string(),
            grade: sev.to_string(),
            category: "impact".to_string(),
            description: format!(
                "Severity of impact {sev} \u{2014} {label}.",
                label = severity_label(sev)
            ),
            band,
        }],
    )
}

/// Grade Score 3: magnitude of damage (1..10, Richter-style).
/// rule IDs: `R-MAGNITUDE-{mag}`.
pub fn grade_magnitude(mag: Option<i32>) -> (String, Vec<FiredRule>) {
    let Some(mag) = mag else {
        return ("low".to_string(), vec![]);
    };
    let band = if mag >= 9 {
        "critical"
    } else if mag >= 6 {
        "high"
    } else if mag >= 3 {
        "moderate"
    } else {
        "low"
    };
    let band = band.to_string();
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-MAGNITUDE-{mag}"),
            instrument: "magnitude".to_string(),
            grade: mag.to_string(),
            category: "damage".to_string(),
            description: format!(
                "Magnitude of damage {mag} on a 1-10 Richter-style scale."
            ),
            band,
        }],
    )
}

/// Grade Score 4: NHS LFPSE harm grade (0..4).
/// rule IDs: `R-HARM-{harm}`.
pub fn grade_harm(harm: Option<i32>) -> (String, Vec<FiredRule>) {
    let Some(harm) = harm else {
        return ("low".to_string(), vec![]);
    };
    let band = if harm >= 3 {
        "critical"
    } else if harm == 2 {
        "high"
    } else if harm == 1 {
        "moderate"
    } else {
        "low"
    };
    let band = band.to_string();
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-HARM-{harm}"),
            instrument: "harm".to_string(),
            grade: harm.to_string(),
            category: "patient-safety".to_string(),
            description: format!(
                "NHS LFPSE harm grade {harm} \u{2014} {label}.",
                label = harm_label(harm)
            ),
            band,
        }],
    )
}

/// Grade Score 5: FAA / EASA failure condition A–E.
/// rule IDs: `R-FAILURE-{cond}`.
pub fn grade_failure(cond: &str) -> (String, Vec<FiredRule>) {
    if cond.is_empty() {
        return ("low".to_string(), vec![]);
    }
    let band = failure_band(cond).to_string();
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-FAILURE-{cond}"),
            instrument: "failure".to_string(),
            grade: cond.to_string(),
            category: "system-safety".to_string(),
            description: format!(
                "Failure condition {cond} \u{2014} {desc}.",
                desc = failure_description(cond)
            ),
            band,
        }],
    )
}

/// Grade Score 6: MoSCoW requirement (1=must, ..., 4=won't).
/// rule IDs: `R-MOSCOW-{m}`.
pub fn grade_moscow(m: Option<i32>) -> (String, Vec<FiredRule>) {
    let Some(m) = m else {
        return ("low".to_string(), vec![]);
    };
    let band = if m == 1 {
        "high"
    } else if m == 2 {
        "moderate"
    } else {
        "low"
    };
    let band = band.to_string();
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-MOSCOW-{m}"),
            instrument: "moscow".to_string(),
            grade: m.to_string(),
            category: "requirement".to_string(),
            description: format!(
                "MoSCoW classification {m} \u{2014} {label}.",
                label = moscow_label(m)
            ),
            band,
        }],
    )
}

/// Grade Score 7: frequency percent (0..100).
/// rule IDs: `R-FREQUENCY-{round(f)}`.
pub fn grade_frequency(f: Option<f64>) -> (String, Vec<FiredRule>) {
    let Some(f) = f else {
        return ("low".to_string(), vec![]);
    };
    let band = if f >= 75.0 {
        "critical"
    } else if f >= 25.0 {
        "high"
    } else if f >= 5.0 {
        "moderate"
    } else {
        "low"
    };
    let band = band.to_string();
    let rounded = f.round() as i64;
    let pct = format_frequency_percent(f);
    (
        band.clone(),
        vec![FiredRule {
            rule_id: format!("R-FREQUENCY-{rounded}"),
            instrument: "frequency".to_string(),
            grade: pct.clone(),
            category: "reach".to_string(),
            description: format!("Frequency of occurrence {pct} of usage affected."),
            band,
        }],
    )
}
