use regex_lite_simple::matches_any;

use super::types::{AdditionalFlag, AssessmentData, DomainScore, DomainScores, ENpsResult};
use super::utils::domain_label;

mod regex_lite_simple {
    /// Lightweight pattern-detection used by the anonymity scanner. The
    /// upstream JavaScript implementation uses real regex; this Rust
    /// version reproduces the *intent* (detect names, employee/staff IDs,
    /// emails, long numeric runs) with substring + character-class checks
    /// so we avoid pulling in the `regex` crate.
    pub fn matches_any(text: &str) -> bool {
        if text.is_empty() {
            return false;
        }
        let lower = text.to_ascii_lowercase();

        // "i am NAME" / "i'm NAME" / "my name is NAME"
        if let Some(idx) = find_one_of(&lower, &["my name is ", "i am ", "i'm "]) {
            let after = &text[idx..];
            let after = after
                .splitn(2, |c: char| c.is_whitespace())
                .nth(1)
                .unwrap_or("");
            if after
                .chars()
                .next()
                .map(|c| c.is_ascii_uppercase())
                .unwrap_or(false)
                && after.chars().skip(1).take(1).all(|c| c.is_ascii_lowercase())
            {
                return true;
            }
        }

        // "First Last" — two consecutive capitalised tokens.
        let tokens: Vec<&str> = text.split_whitespace().collect();
        for w in tokens.windows(2) {
            let (a, b) = (w[0], w[1]);
            if is_capitalised_name(a) && is_capitalised_name(b) {
                return true;
            }
        }

        // employee id / staff id / NI number.
        let contains_id_keyword = ["employee id", "employee number", "employee no", "staff id",
            "staff number", "staff no", "ni number"]
            .iter()
            .any(|p| lower.contains(p));
        if contains_id_keyword {
            return true;
        }

        // Email address — quick "@...." check.
        if let Some(at) = text.find('@') {
            let before = &text[..at];
            let after = &text[at + 1..];
            if before.chars().any(|c| c.is_ascii_alphanumeric())
                && after.contains('.')
                && after.chars().any(|c| c.is_ascii_alphanumeric())
            {
                return true;
            }
        }

        // Long numeric run — 3 digits, optional separator, 3+ digits.
        let mut digits = 0;
        for c in text.chars() {
            if c.is_ascii_digit() {
                digits += 1;
                if digits >= 6 {
                    return true;
                }
            } else if c != '-' && c != ' ' {
                digits = 0;
            }
        }

        false
    }

    fn find_one_of(haystack: &str, needles: &[&str]) -> Option<usize> {
        let mut earliest: Option<usize> = None;
        for n in needles {
            if let Some(idx) = haystack.find(n) {
                earliest = Some(earliest.map_or(idx, |e| e.min(idx)));
            }
        }
        earliest
    }

    fn is_capitalised_name(t: &str) -> bool {
        let mut chars = t.chars();
        let first = chars.next();
        let rest: String = chars.collect();
        first.map(|c| c.is_ascii_uppercase()).unwrap_or(false)
            && !rest.is_empty()
            && rest.chars().all(|c| c.is_ascii_lowercase())
    }
}

/// Detect flagged issues per the Employee Satisfaction Survey priority
/// ladder (high > medium > low) — see front-end `flagged-issues.js`.
///
/// All rule and flag IDs are preserved verbatim from the JS engine:
///
/// - FLAG-COMPOSITE-VP / FLAG-COMPOSITE-POOR
/// - FLAG-DOMAIN-VP-MULTI / FLAG-DOMAIN-VP-{domain} / FLAG-DOMAIN-POOR-{domain}
/// - FLAG-MGMT-STRONG-DISAGREE
/// - FLAG-RETENTION-LEAVING / FLAG-RETENTION-PROBABLY-LEAVE
/// - FLAG-ENPS-DETRACTOR
/// - FLAG-TEXT-SUGGESTION / FLAG-TEXT-PII
pub fn detect_additional_flags(
    data: &AssessmentData,
    composite_score: Option<f64>,
    category: &str,
    domain_scores: &DomainScores,
    enps: &ENpsResult,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Composite-level ──────────────────────────────────────────────
    if category == "very-poor" {
        flags.push(AdditionalFlag {
            id: "FLAG-COMPOSITE-VP".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "Composite satisfaction score {}/100 is in the very-poor band. Urgent attention recommended.",
                fmt_score(composite_score)
            ),
            priority: "high".to_string(),
        });
    } else if category == "poor" {
        flags.push(AdditionalFlag {
            id: "FLAG-COMPOSITE-POOR".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "Composite satisfaction score {}/100 is in the poor band. Significant improvement areas should be addressed.",
                fmt_score(composite_score)
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Per-domain roll-up ───────────────────────────────────────────
    let domain_entries: [(&str, &DomainScore); 8] = [
        ("workload", &domain_scores.workload),
        ("management", &domain_scores.management),
        ("growth", &domain_scores.growth),
        ("compensation", &domain_scores.compensation),
        ("culture", &domain_scores.culture),
        ("environment", &domain_scores.environment),
        ("recognition", &domain_scores.recognition),
        ("overall", &domain_scores.overall),
    ];

    let very_poor: Vec<&str> = domain_entries
        .iter()
        .filter(|(_, s)| s.category == "very-poor")
        .map(|(k, _)| *k)
        .collect();
    let poor: Vec<&str> = domain_entries
        .iter()
        .filter(|(_, s)| s.category == "poor")
        .map(|(k, _)| *k)
        .collect();

    if very_poor.len() >= 2 {
        let names: Vec<&str> = very_poor.iter().map(|k| domain_label(k)).collect();
        flags.push(AdditionalFlag {
            id: "FLAG-DOMAIN-VP-MULTI".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "{} graded domains at very-poor ({}) — broad organisational issue.",
                very_poor.len(),
                names.join(", ")
            ),
            priority: "high".to_string(),
        });
    }

    for key in &very_poor {
        let score = domain_entries
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, s)| s.score)
            .unwrap_or(None);
        flags.push(AdditionalFlag {
            id: format!("FLAG-DOMAIN-VP-{key}"),
            category: domain_label(key).to_string(),
            message: format!(
                "{} at very-poor ({}/100). Immediate review recommended.",
                domain_label(key),
                fmt_score(score),
            ),
            priority: "high".to_string(),
        });
    }

    for key in &poor {
        let score = domain_entries
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, s)| s.score)
            .unwrap_or(None);
        flags.push(AdditionalFlag {
            id: format!("FLAG-DOMAIN-POOR-{key}"),
            category: domain_label(key).to_string(),
            message: format!(
                "{} at poor ({}/100). Targeted improvement recommended.",
                domain_label(key),
                fmt_score(score),
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Management-specific dissatisfaction ──────────────────────────
    let mg_keys: [Option<i32>; 5] = [
        data.management.mg1,
        data.management.mg2,
        data.management.mg3,
        data.management.mg4,
        data.management.mg5,
    ];
    let strong_disagree_count = mg_keys.iter().filter(|v| **v == Some(1)).count();
    let mg_cat = domain_scores.management.category.as_str();
    let already_flagged = mg_cat == "poor" || mg_cat == "very-poor";
    if strong_disagree_count > 0 && !already_flagged {
        let plural = if strong_disagree_count == 1 { "" } else { "s" };
        flags.push(AdditionalFlag {
            id: "FLAG-MGMT-STRONG-DISAGREE".to_string(),
            category: domain_label("management").to_string(),
            message: format!(
                "Strong disagreement on {strong_disagree_count} management item{plural}. Review line-management quality and senior-leadership trust."
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Retention intent ─────────────────────────────────────────────
    match data.overall.retention_intent.as_str() {
        "leaving-within-6-months" => flags.push(AdditionalFlag {
            id: "FLAG-RETENTION-LEAVING".to_string(),
            category: "Retention".to_string(),
            message: "Respondent is actively planning to leave within 6 months. Consider stay-interview / retention conversation if anonymity allows.".to_string(),
            priority: "high".to_string(),
        }),
        "probably-leave-12-months" => flags.push(AdditionalFlag {
            id: "FLAG-RETENTION-PROBABLY-LEAVE".to_string(),
            category: "Retention".to_string(),
            message: "Respondent will probably leave within 12 months. Investigate drivers in this segment.".to_string(),
            priority: "medium".to_string(),
        }),
        _ => {}
    }

    // ─── eNPS ─────────────────────────────────────────────────────────
    if let Some(score) = enps.score {
        if enps.classification == "detractor" {
            flags.push(AdditionalFlag {
                id: "FLAG-ENPS-DETRACTOR".to_string(),
                category: "eNPS".to_string(),
                message: format!("eNPS recommend score {score}/10 — respondent is a detractor."),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Free-text scanning (Step 10 comments) ────────────────────────
    let suggestions = data.overall.suggestions_for_improvement.trim();
    let other_text = data.overall.other_comments.trim();
    if !suggestions.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-TEXT-SUGGESTION".to_string(),
            category: "Suggestion box".to_string(),
            message: "Respondent submitted improvement suggestions — route to the relevant team for triage.".to_string(),
            priority: "low".to_string(),
        });
    }

    let all_text = format!("{suggestions}\n{other_text}");
    if !all_text.trim().is_empty() && matches_any(&all_text) {
        flags.push(AdditionalFlag {
            id: "FLAG-TEXT-PII".to_string(),
            category: "Anonymity".to_string(),
            message: "Open-text comment may contain identifying details (name, employee id, contact info). Anonymity could be compromised; reviewer should redact before sharing.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}

fn fmt_score(score: Option<f64>) -> String {
    match score {
        Some(s) => {
            // Round to 1 decimal place, drop trailing ".0" so output matches JS rendering.
            let rounded = (s * 10.0).round() / 10.0;
            if (rounded - rounded.trunc()).abs() < f64::EPSILON {
                format!("{}", rounded as i64)
            } else {
                format!("{rounded:.1}")
            }
        }
        None => "?".to_string(),
    }
}
