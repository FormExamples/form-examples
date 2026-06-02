// Audio-Vestibular Assessment scoring rules.
//
// Two independent instruments are computed:
//
//   1) WHO pure-tone audiometry hearing-loss grade, derived from the
//      better-ear four-frequency average (0.5 + 1 + 2 + 4 kHz) / 4.
//      Cutoffs (better-ear PTA, dB HL):
//        <  20 -> normal
//        20-34 -> mild
//        35-49 -> moderate
//        50-64 -> moderately-severe
//        65-79 -> severe
//        >=80  -> profound
//
//   2) Dizziness Handicap Inventory (DHI), 25 items scored
//      Yes = 4, Sometimes = 2, No = 0; total range 0-100.
//      Cutoffs (DHI total):
//        0-16  -> no handicap
//        18-36 -> mild
//        38-52 -> moderate
//        >=54  -> severe

use super::types::EarThresholds;

/// One DHI item: number, subscale, and question text.
pub struct DhiItem {
    pub num: u8,
    pub subscale: &'static str,
    pub text: &'static str,
}

/// Canonical DHI item ordering. 25 items: 7 functional (F), 9 emotional (E),
/// 9 physical (P). Numbering matches the Jacobson & Newman 1990 instrument.
pub fn dhi_items() -> Vec<DhiItem> {
    vec![
        DhiItem { num: 1,  subscale: "P", text: "Does looking up increase your problem?" },
        DhiItem { num: 2,  subscale: "E", text: "Because of your problem, do you feel frustrated?" },
        DhiItem { num: 3,  subscale: "F", text: "Because of your problem, do you restrict your travel for business or recreation?" },
        DhiItem { num: 4,  subscale: "P", text: "Does walking down the aisle of a supermarket increase your problem?" },
        DhiItem { num: 5,  subscale: "F", text: "Because of your problem, do you have difficulty getting into or out of bed?" },
        DhiItem { num: 6,  subscale: "F", text: "Does your problem significantly restrict your participation in social activities such as going out to dinner, going to the movies, dancing, or to parties?" },
        DhiItem { num: 7,  subscale: "F", text: "Because of your problem, do you have difficulty reading?" },
        DhiItem { num: 8,  subscale: "P", text: "Does performing more ambitious activities like sports, dancing, household chores such as sweeping or putting dishes away increase your problem?" },
        DhiItem { num: 9,  subscale: "E", text: "Because of your problem, are you afraid to leave your home without having someone accompany you?" },
        DhiItem { num: 10, subscale: "E", text: "Because of your problem, have you been embarrassed in front of others?" },
        DhiItem { num: 11, subscale: "P", text: "Do quick movements of your head increase your problem?" },
        DhiItem { num: 12, subscale: "F", text: "Because of your problem, do you avoid heights?" },
        DhiItem { num: 13, subscale: "P", text: "Does turning over in bed increase your problem?" },
        DhiItem { num: 14, subscale: "F", text: "Because of your problem, is it difficult for you to do strenuous housework or yardwork?" },
        DhiItem { num: 15, subscale: "E", text: "Because of your problem, are you afraid people may think you are intoxicated?" },
        DhiItem { num: 16, subscale: "F", text: "Because of your problem, is it difficult for you to go for a walk by yourself?" },
        DhiItem { num: 17, subscale: "P", text: "Does walking down a sidewalk increase your problem?" },
        DhiItem { num: 18, subscale: "E", text: "Because of your problem, is it difficult for you to concentrate?" },
        DhiItem { num: 19, subscale: "F", text: "Because of your problem, is it difficult for you to walk around your house in the dark?" },
        DhiItem { num: 20, subscale: "E", text: "Because of your problem, are you afraid to stay home alone?" },
        DhiItem { num: 21, subscale: "E", text: "Because of your problem, do you feel handicapped?" },
        DhiItem { num: 22, subscale: "E", text: "Has the problem placed stress on your relationships with family or friends?" },
        DhiItem { num: 23, subscale: "E", text: "Because of your problem, are you depressed?" },
        DhiItem { num: 24, subscale: "F", text: "Does your problem interfere with your job or household responsibilities?" },
        DhiItem { num: 25, subscale: "P", text: "Does bending over increase your problem?" },
    ]
}

/// Calculate a four-frequency PTA from {hz500, hz1000, hz2000, hz4000}.
/// Returns `None` when no frequencies are present.
pub fn calculate_pta_from_thresholds(thr: &EarThresholds) -> Option<f64> {
    let vs: Vec<f64> = [thr.hz500, thr.hz1000, thr.hz2000, thr.hz4000]
        .iter()
        .filter_map(|v| *v)
        .filter(|v| !v.is_nan())
        .collect();
    if vs.is_empty() {
        return None;
    }
    let sum: f64 = vs.iter().sum();
    let avg = sum / vs.len() as f64;
    // Round to one decimal place.
    Some((avg * 10.0).round() / 10.0)
}

/// Classify a numeric better-ear PTA into a WHO hearing-loss grade.
/// `None` (no thresholds entered) returns `"unknown"`.
pub fn classify_hearing_loss_grade(pta: Option<f64>) -> String {
    match pta {
        None => "unknown".to_string(),
        Some(v) if v.is_nan() => "unknown".to_string(),
        Some(v) if v < 20.0 => "normal".to_string(),
        Some(v) if v < 35.0 => "mild".to_string(),
        Some(v) if v < 50.0 => "moderate".to_string(),
        Some(v) if v < 65.0 => "moderately-severe".to_string(),
        Some(v) if v < 80.0 => "severe".to_string(),
        Some(_) => "profound".to_string(),
    }
}

/// Score one DHI answer ('yes' = 4, 'sometimes' = 2, otherwise 0).
pub fn dhi_answer_score(answer: &str) -> u32 {
    match answer {
        "yes" => 4,
        "sometimes" => 2,
        _ => 0,
    }
}

/// Classify a numeric DHI total (0-100) into a handicap level.
pub fn classify_dhi_handicap(total: u32) -> String {
    if total <= 16 {
        "no-handicap".to_string()
    } else if total <= 36 {
        "mild".to_string()
    } else if total <= 52 {
        "moderate".to_string()
    } else {
        "severe".to_string()
    }
}
