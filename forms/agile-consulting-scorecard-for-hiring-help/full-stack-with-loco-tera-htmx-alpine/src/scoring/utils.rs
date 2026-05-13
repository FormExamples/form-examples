use crate::scoring::types::{Answer, Band, ItemAnswerGrade, Recommendation};

pub fn answer_to_points(answer: Answer) -> u8 {
    match answer {
        Some(true) => 1,
        _ => 0,
    }
}

pub fn answer_to_grade(answer: Answer) -> ItemAnswerGrade {
    match answer {
        Some(true) => ItemAnswerGrade::Yes,
        Some(false) => ItemAnswerGrade::No,
        None => ItemAnswerGrade::Unanswered,
    }
}

/// Total score → readiness band, per `seed.md`:
///   0–4   → Low
///   5     → Borderline
///   6–10  → Medium
///   11–16 → High
pub fn total_to_band(total: u8) -> Band {
    if total <= 4 {
        Band::Low
    } else if total == 5 {
        Band::Borderline
    } else if total <= 10 {
        Band::Medium
    } else {
        Band::High
    }
}

pub fn band_to_recommendation(band: Band) -> Recommendation {
    match band {
        Band::Low => Recommendation::DoNotHireYet,
        Band::Borderline => Recommendation::DoHomeworkFirst,
        Band::Medium => Recommendation::DoHomeworkFirst,
        Band::High => Recommendation::TrialEngagement,
    }
}

pub fn item_answer_grade_str(grade: ItemAnswerGrade) -> &'static str {
    match grade {
        ItemAnswerGrade::Yes => "yes",
        ItemAnswerGrade::No => "no",
        ItemAnswerGrade::Unanswered => "unanswered",
    }
}
