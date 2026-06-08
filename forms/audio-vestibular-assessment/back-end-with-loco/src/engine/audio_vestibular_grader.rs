//! Audio vestibular grader module.

// Audio-Vestibular Assessment grader. Pure functions: take an
// `AssessmentData` object, return:
//
//   - per-ear PTA averages (4-frequency: 0.5 + 1 + 2 + 4 kHz / 4)
//   - the better-ear PTA (smaller of the two)
//   - the WHO hearing-loss grade
//   - inter-aural asymmetry in dB
//   - the DHI total (0-100), per-subscale subtotals, and handicap level
//   - the per-item answered count for both instruments (audit trail)
//   - additional clinical flags

use super::audio_vestibular_rules::{
    calculate_pta_from_thresholds, classify_dhi_handicap, classify_hearing_loss_grade,
    dhi_answer_score, dhi_items,
};
use super::flagged_issues::detect_additional_flags;
use super::types::{AdditionalFlag, AssessmentData, DhiFiredItem, GradingResult};

/// Pure-tone audiometry results.
#[derive(Debug, Clone)]
pub struct PtaResult {
    /// Right pta.
    pub right_pta: Option<f64>,
    /// Left pta.
    pub left_pta: Option<f64>,
    /// Better ear pta.
    pub better_ear_pta: Option<f64>,
    /// Asymmetry.
    pub asymmetry: Option<f64>,
    /// Hearing loss grade.
    pub hearing_loss_grade: String,
    /// Right hearing loss grade.
    pub right_hearing_loss_grade: String,
    /// Left hearing loss grade.
    pub left_hearing_loss_grade: String,
}

/// Compute pure-tone audiometry results: per-ear PTAs, better-ear PTA,
/// asymmetry, and the WHO hearing-loss grade.
pub fn calculate_pure_tone_audiometry(data: &AssessmentData) -> PtaResult {
    let right = &data.pure_tone_audiometry.right_ear.air_conduction;
    let left = &data.pure_tone_audiometry.left_ear.air_conduction;
    let right_pta = calculate_pta_from_thresholds(right);
    let left_pta = calculate_pta_from_thresholds(left);

    let better_ear_pta = match (right_pta, left_pta) {
        (Some(r), Some(l)) => Some(if r < l { r } else { l }),
        (Some(r), None) => Some(r),
        (None, Some(l)) => Some(l),
        (None, None) => None,
    };

    let asymmetry = match (right_pta, left_pta) {
        (Some(r), Some(l)) => {
            let diff = (r - l).abs();
            Some((diff * 10.0).round() / 10.0)
        }
        _ => None,
    };

    PtaResult {
        right_pta,
        left_pta,
        better_ear_pta,
        asymmetry,
        hearing_loss_grade: classify_hearing_loss_grade(better_ear_pta),
        right_hearing_loss_grade: classify_hearing_loss_grade(right_pta),
        left_hearing_loss_grade: classify_hearing_loss_grade(left_pta),
    }
}

/// Dizziness Handicap Inventory result.
#[derive(Debug, Clone)]
pub struct DhiResult {
    /// Total.
    pub total: u32,
    /// Answered count.
    pub answered_count: u32,
    /// Functional.
    pub functional: u32,
    /// Emotional.
    pub emotional: u32,
    /// Physical.
    pub physical: u32,
    /// Handicap level.
    pub handicap_level: String,
    /// Fired items.
    pub fired_items: Vec<DhiFiredItem>,
}

/// Compute the Dizziness Handicap Inventory total, per-subscale subtotals
/// (functional / emotional / physical), and the handicap level.
pub fn calculate_dhi(data: &AssessmentData) -> DhiResult {
    let dhi = &data.dizziness_handicap_inventory;
    let mut total: u32 = 0;
    let mut answered_count: u32 = 0;
    let mut functional: u32 = 0;
    let mut emotional: u32 = 0;
    let mut physical: u32 = 0;
    let mut fired_items: Vec<DhiFiredItem> = Vec::new();

    for item in dhi_items() {
        let answer = dhi.answer(item.num);
        if !answer.is_empty() {
            answered_count += 1;
        }
        let score = dhi_answer_score(answer);
        total += score;
        match item.subscale {
            "F" => functional += score,
            "E" => emotional += score,
            "P" => physical += score,
            _ => {}
        }
        fired_items.push(DhiFiredItem {
            id: format!("DHI-{:02}", item.num),
            num: item.num,
            subscale: item.subscale.to_string(),
            text: item.text.to_string(),
            answer: answer.to_string(),
            score,
        });
    }

    DhiResult {
        total,
        answered_count,
        functional,
        emotional,
        physical,
        handicap_level: classify_dhi_handicap(total),
        fired_items,
    }
}

/// Run the entire audio-vestibular grading pipeline against the supplied
/// assessment data and produce a flat `GradingResult` object.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let pta = calculate_pure_tone_audiometry(data);
    let dhi = calculate_dhi(data);

    // Build the preliminary result so flag detection can use it.
    let prelim = GradingResult {
        right_pta: pta.right_pta,
        left_pta: pta.left_pta,
        better_ear_pta: pta.better_ear_pta,
        asymmetry: pta.asymmetry,
        hearing_loss_grade: pta.hearing_loss_grade.clone(),
        right_hearing_loss_grade: pta.right_hearing_loss_grade.clone(),
        left_hearing_loss_grade: pta.left_hearing_loss_grade.clone(),
        dhi_total: dhi.total,
        dhi_answered_count: dhi.answered_count,
        dhi_functional: dhi.functional,
        dhi_emotional: dhi.emotional,
        dhi_physical: dhi.physical,
        dhi_handicap_level: dhi.handicap_level.clone(),
        dhi_fired_items: dhi.fired_items.clone(),
        additional_flags: Vec::<AdditionalFlag>::new(),
        timestamp: String::new(),
    };

    let additional_flags = detect_additional_flags(data, &prelim);
    let timestamp = chrono::Utc::now().to_rfc3339();

    GradingResult {
        additional_flags,
        timestamp,
        ..prelim
    }
}
