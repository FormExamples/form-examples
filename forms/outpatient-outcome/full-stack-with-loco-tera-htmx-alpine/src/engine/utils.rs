use super::types::{DomainGrade, PromEq5d5l, PromPromis};

/// Map a DomainGrade letter to a numeric ordinal (A=0 best, E=4 worst).
/// Empty string returns -1.
pub fn grade_ordinal(grade: &str) -> i32 {
    match grade {
        "A" => 0,
        "B" => 1,
        "C" => 2,
        "D" => 3,
        "E" => 4,
        _ => -1,
    }
}

/// Return the worst (highest ordinal) DomainGrade from a slice.
pub fn grade_max(grades: &[DomainGrade]) -> DomainGrade {
    let mut worst: Option<&str> = None;
    for g in grades {
        if g.is_empty() {
            continue;
        }
        match worst {
            None => worst = Some(g.as_str()),
            Some(curr) => {
                if grade_ordinal(g) > grade_ordinal(curr) {
                    worst = Some(g.as_str());
                }
            }
        }
    }
    worst.map(|s| s.to_string()).unwrap_or_default()
}

/// Human-readable label for a domain grade.
pub fn grade_label(grade: &str) -> String {
    match grade {
        "A" => "A — Excellent outcome".to_string(),
        "B" => "B — Good outcome".to_string(),
        "C" => "C — Unchanged / Neutral outcome".to_string(),
        "D" => "D — Poor outcome".to_string(),
        "E" => "E — Very poor outcome".to_string(),
        _ => "Unknown / Insufficient data".to_string(),
    }
}

/// Net change in a single EQ-5D-5L dimension.
/// Negative = improvement (lower level = better); positive = worsening.
pub fn eq5d_dimension_change(before: Option<i32>, after: Option<i32>) -> Option<i32> {
    match (before, after) {
        (Some(b), Some(a)) => Some(a - b),
        _ => None,
    }
}

/// Counts of how many EQ-5D-5L items (5 dimensions + VAS) improved, worsened, etc.
pub struct Eq5dSummary {
    pub improved: u32,
    pub worsened: u32,
    pub unchanged: u32,
    pub missing: u32,
}

pub fn eq5d_summary(prom: &PromEq5d5l) -> Eq5dSummary {
    let dims: [(Option<i32>, Option<i32>); 5] = [
        (prom.before_mobility, prom.after_mobility),
        (prom.before_self_care, prom.after_self_care),
        (prom.before_usual_activities, prom.after_usual_activities),
        (prom.before_pain_discomfort, prom.after_pain_discomfort),
        (prom.before_anxiety_depression, prom.after_anxiety_depression),
    ];

    let mut improved = 0u32;
    let mut worsened = 0u32;
    let mut unchanged = 0u32;
    let mut missing = 0u32;

    for (b, a) in dims.iter().copied() {
        match eq5d_dimension_change(b, a) {
            None => missing += 1,
            Some(delta) => {
                if delta < 0 {
                    improved += 1;
                } else if delta > 0 {
                    worsened += 1;
                } else {
                    unchanged += 1;
                }
            }
        }
    }

    // VAS: higher = better.
    match eq5d_dimension_change(prom.before_vas, prom.after_vas) {
        None => missing += 1,
        Some(delta) => {
            if delta > 0 {
                improved += 1;
            } else if delta < 0 {
                worsened += 1;
            } else {
                unchanged += 1;
            }
        }
    }

    Eq5dSummary { improved, worsened, unchanged, missing }
}

/// Linear approximation of PROMIS Global Physical Health T-score.
/// Items 3, 6, 10 on 1–5 scale, item 9 on 0–10 (recoded). Raw sum mapped to
/// the published 16.2–67.7 T-score extremes.
pub fn promis_gph_t_score(p: &PromPromis) -> Option<f64> {
    let item3 = p.item3_physical_health?;
    let item6 = p.item6_fatigue_frequency?;
    let item9 = p.item9_pain?;
    let item10 = p.item10_everyday_activities?;
    let item9_recoded = (10.0 - item9 as f64) / 2.0 + 1.0;
    let item6_inverted = 6.0 - item6 as f64;
    let raw_sum = item3 as f64 + item6_inverted + item9_recoded + item10 as f64;
    let t = 16.2 + ((raw_sum - 4.0) / (20.0 - 4.0)) * (67.7 - 16.2);
    Some((t * 10.0).round() / 10.0)
}

/// Linear approximation of PROMIS Global Mental Health T-score (items
/// 1, 2, 4, 5, 7 [inverted], 8) mapped to published 21.2–67.6 extremes.
pub fn promis_mh_t_score(p: &PromPromis) -> Option<f64> {
    let item1 = p.item1_general_health?;
    let item2 = p.item2_quality_of_life?;
    let item4 = p.item4_mental_health?;
    let item5 = p.item5_satisfaction?;
    let item7 = p.item7_emotional_problems?;
    let item8 = p.item8_social_activities?;
    let item7_inverted = 6.0 - item7 as f64;
    let raw_sum =
        item1 as f64 + item2 as f64 + item4 as f64 + item5 as f64 + item7_inverted + item8 as f64;
    let t = 21.2 + ((raw_sum - 6.0) / (30.0 - 6.0)) * (67.6 - 21.2);
    Some((t * 10.0).round() / 10.0)
}

/// Calculate wait-time days between two ISO date strings (YYYY-MM-DD).
pub fn calc_wait_days(referral_date: &str, appointment_date: &str) -> Option<i32> {
    if referral_date.is_empty() || appointment_date.is_empty() {
        return None;
    }
    let ref_d = chrono::NaiveDate::parse_from_str(referral_date, "%Y-%m-%d").ok()?;
    let app_d = chrono::NaiveDate::parse_from_str(appointment_date, "%Y-%m-%d").ok()?;
    let diff = (app_d - ref_d).num_days() as i32;
    Some(diff.max(0))
}
