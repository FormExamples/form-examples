// Flagged-issue detection for the Workplace Stress Assessment.
//
// These flags are computed AFTER the per-domain mean has been graded.
// They surface domain-level concerns to occupational health / HR staff
// and detect free-text indicators of distress or breach of anonymity in
// the closing comments step.
//
// Priority ladder:
//
//   high   - any domain at 'very-high' concern, OR ≥3 domains at 'high+',
//            OR explicit signs of bullying / harassment in Relationships,
//            OR distress wording in free-text.
//   medium - 1-2 domains at 'high' concern, OR Role-Clarity domain at
//            'high'/'very-high', OR Manager-Support 'high'+.
//   low    - mild or moderate-only concerns; identifying details in the
//            anonymous comments box.

use super::types::{AdditionalFlag, AssessmentData, DomainResult, DomainResults};

fn domain_label(key: &str) -> &'static str {
    match key {
        "demands" => "Demands",
        "control" => "Control",
        "managerSupport" => "Manager Support",
        "peerSupport" => "Peer Support",
        "relationships" => "Relationships",
        "role" => "Role Clarity",
        "change" => "Organisational Change",
        _ => "",
    }
}

fn for_key<'a>(domains: &'a DomainResults, key: &str) -> Option<&'a DomainResult> {
    match key {
        "demands" => Some(&domains.demands),
        "control" => Some(&domains.control),
        "managerSupport" => Some(&domains.manager_support),
        "peerSupport" => Some(&domains.peer_support),
        "relationships" => Some(&domains.relationships),
        "role" => Some(&domains.role),
        "change" => Some(&domains.change),
        _ => None,
    }
}

fn mean_str(r: &DomainResult) -> String {
    match r.mean {
        Some(m) => format!("{m:.2}"),
        None => "?".to_string(),
    }
}

const DOMAIN_KEYS: &[&str] = &[
    "demands",
    "control",
    "managerSupport",
    "peerSupport",
    "relationships",
    "role",
    "change",
];

// Distress wording in free-text that may indicate the employee is in
// significant distress and should be offered immediate support.
fn matches_distress(text: &str) -> bool {
    let lower = text.to_lowercase();
    let needles: &[&str] = &[
        "suicid",
        "self-harm",
        "self harm",
        "selfharm",
        "breakdown",
        "can't cope",
        "cant cope",
        "can not cope",
        "cannot cope",
        "desperate",
        "hopeless",
        "worthless",
        "panic attack",
        "depressed",
        "mentally ill",
        "mental illness",
        "nervous breakdown",
        "harass",
        "bully",
        "bullied",
        "bullying",
    ];
    needles.iter().any(|n| lower.contains(n))
}

/// Heuristic for identifying-details in the anonymous comments box.
fn matches_identifying(text: &str) -> bool {
    let lower = text.to_lowercase();
    if lower.contains("my name is")
        || lower.contains("employee id")
        || lower.contains("employee number")
        || lower.contains("staff id")
        || lower.contains("staff number")
        || lower.contains("ni number")
    {
        return true;
    }
    if text.contains('@') && text.contains('.') {
        // Crude email-shape detector.
        let parts: Vec<&str> = text.split('@').collect();
        if parts.len() == 2 && parts[0].chars().any(|c| c.is_alphanumeric())
            && parts[1].contains('.')
        {
            return true;
        }
    }
    // Long numeric runs (id-like).
    let mut run = 0usize;
    for c in text.chars() {
        if c.is_ascii_digit() {
            run += 1;
            if run >= 6 {
                return true;
            }
        } else {
            run = 0;
        }
    }
    // Two-word capitalised name pattern, e.g. "John Smith".
    let words: Vec<&str> = text.split_whitespace().collect();
    for w in words.windows(2) {
        let starts_upper = |s: &str| s.chars().next().is_some_and(|c| c.is_uppercase());
        let all_alpha = |s: &str| s.chars().all(|c| c.is_alphabetic());
        if starts_upper(w[0]) && all_alpha(w[0]) && w[0].len() > 1
            && starts_upper(w[1]) && all_alpha(w[1]) && w[1].len() > 1
        {
            return true;
        }
    }
    false
}

pub fn detect_additional_flags(
    data: &AssessmentData,
    domains: &DomainResults,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Domain-level concern roll-up ───────────────────────────
    let mut very_high: Vec<&str> = Vec::new();
    let mut high: Vec<&str> = Vec::new();

    for key in DOMAIN_KEYS {
        if let Some(r) = for_key(domains, key) {
            match r.category.as_str() {
                "very-high" => very_high.push(*key),
                "high" => high.push(*key),
                _ => {}
            }
        }
    }

    for key in &very_high {
        if let Some(r) = for_key(domains, key) {
            flags.push(AdditionalFlag {
                id: format!("FLAG-DOMAIN-VH-{key}"),
                category: domain_label(key).to_string(),
                message: format!(
                    "{} domain at very-high concern (mean {}). Immediate review recommended.",
                    domain_label(key),
                    mean_str(r)
                ),
                priority: "high".to_string(),
            });
        }
    }

    if high.len() + very_high.len() >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-DOMAIN-MULTI".to_string(),
            category: "Overall".to_string(),
            message: format!(
                "{} domains at high or very-high concern - broad organisational stressor pattern.",
                high.len() + very_high.len()
            ),
            priority: "high".to_string(),
        });
    }

    for key in &high {
        if let Some(r) = for_key(domains, key) {
            let is_cascading = *key == "role" || *key == "managerSupport";
            let mut msg = format!(
                "{} domain at high concern (mean {}).",
                domain_label(key),
                mean_str(r)
            );
            if is_cascading {
                msg.push_str(" Consider prioritising - this domain frequently amplifies other stressors.");
            }
            flags.push(AdditionalFlag {
                id: format!("FLAG-DOMAIN-H-{key}"),
                category: domain_label(key).to_string(),
                message: msg,
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Bullying / harassment items in Relationships domain ──
    // rel1 (harassment) and rel3 (bullying) are reverse-scored, so a *raw*
    // value of 4 (Often) or 5 (Always) is a direct, individually-reported
    // experience of mistreatment and should be flagged regardless of the
    // domain mean.
    if let Some(v) = data.relationships.rel1 {
        if v >= 4 {
            flags.push(AdditionalFlag {
                id: "FLAG-REL-HARASS".to_string(),
                category: "Relationships".to_string(),
                message: "Employee reports being subject to personal harassment \"often\" or \"always\". Safeguarding review recommended.".to_string(),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(v) = data.relationships.rel3 {
        if v >= 4 {
            flags.push(AdditionalFlag {
                id: "FLAG-REL-BULLY".to_string(),
                category: "Relationships".to_string(),
                message: "Employee reports being subject to bullying at work \"often\" or \"always\". Safeguarding review recommended.".to_string(),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Free-text scanning (Step 9 comments) ───────────────
    let mut all_text = String::new();
    all_text.push_str(&data.additional_comments.most_stressful_aspect);
    all_text.push('\n');
    all_text.push_str(&data.additional_comments.suggestions_for_improvement);
    all_text.push('\n');
    all_text.push_str(&data.additional_comments.other_comments);

    if !all_text.trim().is_empty() {
        if matches_distress(&all_text) {
            flags.push(AdditionalFlag {
                id: "FLAG-TEXT-DISTRESS".to_string(),
                category: "Free-text".to_string(),
                message: "Open-text comment includes wording that may indicate the employee is in significant distress. Offer confidential support / EAP referral.".to_string(),
                priority: "high".to_string(),
            });
        }
        if matches_identifying(&all_text) {
            flags.push(AdditionalFlag {
                id: "FLAG-TEXT-PII".to_string(),
                category: "Anonymity".to_string(),
                message: "Open-text comment may contain identifying details (name, employee id, contact info). Anonymity could be compromised; reviewer should redact before sharing.".to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Catch-all: only moderate concerns, no other flags ────
    if flags.is_empty() {
        let moderate_count = DOMAIN_KEYS
            .iter()
            .filter_map(|k| for_key(domains, k))
            .filter(|r| r.category == "moderate")
            .count();
        if moderate_count >= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-DOMAIN-MOD".to_string(),
                category: "Overall".to_string(),
                message: format!(
                    "{moderate_count} domains at moderate concern - monitor and re-survey in three months."
                ),
                priority: "low".to_string(),
            });
        }
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
