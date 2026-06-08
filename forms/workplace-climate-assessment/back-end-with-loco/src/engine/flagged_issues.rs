//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData, GradingResult, LikertValue};

/// Display labels for the eight graded domains.
fn domain_label(key: &str) -> &'static str {
    match key {
        "leadership" => "Leadership & Management",
        "psychSafety" => "Psychological Safety",
        "inclusion" => "Inclusion & Belonging",
        "communication" => "Communication",
        "collaboration" => "Collaboration & Teamwork",
        "recognition" => "Recognition & Reward",
        "wellbeing" => "Wellbeing",
        "career" => "Career Development",
        _ => "Unknown",
    }
}

/// Patterns suggesting the employee accidentally entered identifying details.
/// Anonymity is the design intent; reviewers should redact before sharing.
fn looks_like_pii(text: &str) -> bool {
    let lower = text.to_lowercase();

    // "my name is ...", "i am ...", "i'm ..."
    let lead_phrases = ["my name is", "i am ", "i'm "];
    for phrase in lead_phrases.iter() {
        if let Some(idx) = lower.find(phrase) {
            let after = &text[idx + phrase.len()..];
            if let Some(c) = after.chars().next() {
                if c.is_ascii_uppercase() {
                    return true;
                }
            }
        }
    }

    // "John Smith" — two consecutive Capitalised words.
    {
        let mut prev_cap_word = false;
        for word in text.split_whitespace() {
            let is_cap = word
                .chars()
                .next()
                .map(|c| c.is_ascii_uppercase())
                .unwrap_or(false)
                && word.chars().skip(1).any(|c| c.is_ascii_lowercase());
            if prev_cap_word && is_cap {
                return true;
            }
            prev_cap_word = is_cap;
        }
    }

    // Employee / staff ids and NI numbers.
    let id_phrases = [
        "employee id",
        "employee number",
        "employee no",
        "staff id",
        "staff number",
        "staff no",
        "ni number",
    ];
    for phrase in id_phrases.iter() {
        if lower.contains(phrase) {
            return true;
        }
    }

    // Long numeric strings (eg 020 7946 0123, employee numbers, etc).
    let digits_run: usize = text
        .chars()
        .map(|c| if c.is_ascii_digit() { 1usize } else { 0 })
        .sum();
    if digits_run >= 6 {
        return true;
    }

    // Email addresses.
    if text.contains('@') {
        // Very lightweight email check: contains '@' with letters on both sides.
        let parts: Vec<&str> = text.split_whitespace().collect();
        for p in parts {
            if let Some(at) = p.find('@') {
                let local = &p[..at];
                let rest = &p[at + 1..];
                if !local.is_empty() && rest.contains('.') {
                    return true;
                }
            }
        }
    }

    false
}

fn is_strongly_disagree(v: LikertValue) -> bool {
    matches!(v, Some(1))
}

/// Detect Workplace Climate Assessment safety / triage flags. Priority ladder:
///   high   - composite category 'critical', OR ≥2 graded domains at 'critical',
///            OR any psychological-safety item rated 1, OR any inclusion item rated 1.
///   medium - composite category 'strained', OR leadership concerns, OR retention
///            risk (would NOT recommend as a place to work).
///   low    - free-text suggestion-box ideas, or free-text that may identify the
///            respondent and break anonymity.
pub fn detect_additional_flags(
    data: &AssessmentData,
    grading: &GradingResult,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let ds = &grading.domain_scores;

    let fmt_score = |s: Option<f64>| -> String {
        s.map(|v| format!("{v}")).unwrap_or_else(|| "?".to_string())
    };

    // ─── Composite-level ─────────────────────────────────────────
    if grading.category == "critical" {
        flags.push(AdditionalFlag {
            id: "FLAG-COMPOSITE-CRITICAL".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "Composite climate score {}/100 is in the critical band. Urgent organisational action recommended.",
                fmt_score(grading.composite_score)
            ),
            priority: "high".to_string(),
        });
    } else if grading.category == "strained" {
        flags.push(AdditionalFlag {
            id: "FLAG-COMPOSITE-STRAINED".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "Composite climate score {}/100 is in the strained band. Targeted intervention recommended.",
                fmt_score(grading.composite_score)
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Per-domain roll-up ──────────────────────────────────────
    let per_domain: [(&str, &super::types::DomainScore); 8] = [
        ("leadership", &ds.leadership),
        ("psychSafety", &ds.psych_safety),
        ("inclusion", &ds.inclusion),
        ("communication", &ds.communication),
        ("collaboration", &ds.collaboration),
        ("recognition", &ds.recognition),
        ("wellbeing", &ds.wellbeing),
        ("career", &ds.career),
    ];

    let critical_domains: Vec<&str> = per_domain
        .iter()
        .filter_map(|(k, r)| {
            if r.category == "critical" {
                Some(*k)
            } else {
                None
            }
        })
        .collect();
    let strained_domains: Vec<&str> = per_domain
        .iter()
        .filter_map(|(k, r)| {
            if r.category == "strained" {
                Some(*k)
            } else {
                None
            }
        })
        .collect();

    if critical_domains.len() >= 2 {
        let names: Vec<&str> = critical_domains.iter().map(|k| domain_label(k)).collect();
        flags.push(AdditionalFlag {
            id: "FLAG-DOMAIN-CRITICAL-MULTI".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "{} graded domains at critical ({}) — broad organisational issue.",
                critical_domains.len(),
                names.join(", ")
            ),
            priority: "high".to_string(),
        });
    }

    for key in &critical_domains {
        let score = per_domain
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, r)| r.score)
            .unwrap_or(None);
        flags.push(AdditionalFlag {
            id: format!("FLAG-DOMAIN-CRITICAL-{key}"),
            category: domain_label(key).to_string(),
            message: format!(
                "{} at critical ({}/100). Immediate review recommended.",
                domain_label(key),
                fmt_score(score)
            ),
            priority: "high".to_string(),
        });
    }

    for key in &strained_domains {
        let score = per_domain
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, r)| r.score)
            .unwrap_or(None);
        flags.push(AdditionalFlag {
            id: format!("FLAG-DOMAIN-STRAINED-{key}"),
            category: domain_label(key).to_string(),
            message: format!(
                "{} at strained ({}/100). Targeted improvement recommended.",
                domain_label(key),
                fmt_score(score)
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Psychological-safety items rated "Strongly disagree" ────
    {
        let strongly = [
            data.psych_safety.ps1,
            data.psych_safety.ps2,
            data.psych_safety.ps3,
            data.psych_safety.ps4,
            data.psych_safety.ps5,
        ]
        .iter()
        .filter(|v| is_strongly_disagree(**v))
        .count();
        if strongly > 0 {
            flags.push(AdditionalFlag {
                id: "FLAG-PSYCH-SAFETY-STRONG-DISAGREE".to_string(),
                category: domain_label("psychSafety").to_string(),
                message: format!(
                    "Strong disagreement on {} psychological-safety item{}. People may not feel safe speaking up — investigate immediately.",
                    strongly,
                    if strongly == 1 { "" } else { "s" }
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Inclusion items rated "Strongly disagree" ───────────────
    {
        let strongly = [
            data.inclusion.in1,
            data.inclusion.in2,
            data.inclusion.in3,
            data.inclusion.in4,
            data.inclusion.in5,
        ]
        .iter()
        .filter(|v| is_strongly_disagree(**v))
        .count();
        if strongly > 0 {
            flags.push(AdditionalFlag {
                id: "FLAG-INCLUSION-STRONG-DISAGREE".to_string(),
                category: domain_label("inclusion").to_string(),
                message: format!(
                    "Strong disagreement on {} inclusion-and-belonging item{}. Possible exclusion, unfairness or unaddressed misconduct — investigate immediately.",
                    strongly,
                    if strongly == 1 { "" } else { "s" }
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Leadership-specific concerns ────────────────────────────
    {
        let strongly = [
            data.leadership.ld1,
            data.leadership.ld2,
            data.leadership.ld3,
            data.leadership.ld4,
            data.leadership.ld5,
        ]
        .iter()
        .filter(|v| is_strongly_disagree(**v))
        .count();
        let ld_cat = &ds.leadership.category;
        let already_flagged = ld_cat == "strained" || ld_cat == "critical";
        if strongly > 0 && !already_flagged {
            flags.push(AdditionalFlag {
                id: "FLAG-LEADERSHIP-STRONG-DISAGREE".to_string(),
                category: domain_label("leadership").to_string(),
                message: format!(
                    "Strong disagreement on {} leadership item{}. Review line-management quality and senior-leadership trust.",
                    strongly,
                    if strongly == 1 { "" } else { "s" }
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Recommend / retention risk ──────────────────────────────
    let recommend = data.overall.recommend_as_place_to_work.as_str();
    if recommend == "definitely-not" || recommend == "probably-not" {
        flags.push(AdditionalFlag {
            id: "FLAG-RECOMMEND-RISK".to_string(),
            category: "Retention".to_string(),
            message: format!(
                "Respondent would {} recommend this organisation as a place to work. Investigate retention drivers in this segment.",
                if recommend == "definitely-not" {
                    "definitely not"
                } else {
                    "probably not"
                }
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Free-text suggestion box ────────────────────────────────
    let strength = data.overall.biggest_strength.as_str();
    let improvement = data.overall.biggest_improvement.as_str();
    let other_text = data.overall.other_comments.as_str();
    let all_text = format!("{strength}\n{improvement}\n{other_text}");
    let all_text_trimmed = all_text.trim();

    if !improvement.trim().is_empty() || !strength.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-TEXT-SUGGESTION".to_string(),
            category: "Suggestion box".to_string(),
            message: "Respondent submitted free-text feedback (strength and/or improvement) — route to the relevant team for triage.".to_string(),
            priority: "low".to_string(),
        });
    }

    if !all_text_trimmed.is_empty() && looks_like_pii(all_text_trimmed) {
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
