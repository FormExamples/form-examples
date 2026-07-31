//! NEWS2 scoring, per the Royal College of Physicians 2017 report.
//!
//! See `doc/news2.md` for the parameter tables and the escalation thresholds.
//! This module derives the aggregate from the seven parameters; it never
//! overwrites a total the clinician entered from the ward chart. Both are
//! reported so a discrepancy is visible rather than silently resolved.

use super::types::Observations;

/// The seven NEWS2 sub-scores. `None` where the parameter was not recorded.
#[derive(Clone, Copy, Debug, Default)]
pub struct SubScores {
    /// Respiratory rate.
    pub respiratory_rate: Option<i32>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<i32>,
    /// Air or oxygen.
    pub oxygen_supplement: Option<i32>,
    /// Systolic blood pressure.
    pub systolic_blood_pressure: Option<i32>,
    /// Pulse.
    pub pulse: Option<i32>,
    /// Consciousness.
    pub consciousness: Option<i32>,
    /// Temperature.
    pub temperature: Option<i32>,
}

impl SubScores {
    fn all(self) -> [Option<i32>; 7] {
        [
            self.respiratory_rate,
            self.oxygen_saturation,
            self.oxygen_supplement,
            self.systolic_blood_pressure,
            self.pulse,
            self.consciousness,
            self.temperature,
        ]
    }
}

/// The result of deriving NEWS2 from the seven parameters.
#[derive(Clone, Copy, Debug, Default)]
pub struct Derivation {
    /// `None` when any of the seven parameters is missing.
    pub total: Option<i32>,
    /// The per-parameter sub-scores.
    pub sub_scores: SubScores,
    /// Whether any single parameter scores 3.
    pub any_parameter_scores_three: bool,
    /// Whether all seven parameters were recorded.
    pub complete: bool,
}

/// Respiratory-rate sub-score.
#[must_use]
pub fn score_respiratory_rate(rr: Option<i32>) -> Option<i32> {
    let rr = rr?;
    Some(match rr {
        i32::MIN..=8 => 3,
        9..=11 => 1,
        12..=20 => 0,
        21..=24 => 2,
        _ => 3,
    })
}

/// Oxygen-saturation sub-score. Scale 2 applies only to a prescribed target of
/// 88–92% in confirmed hypercapnic respiratory failure, and above that range it
/// scores only when the patient is on oxygen.
#[must_use]
pub fn score_oxygen_saturation(spo2: Option<i32>, scale: &str, on_oxygen: bool) -> Option<i32> {
    let spo2 = spo2?;
    if scale == "scale-2" {
        return Some(match spo2 {
            i32::MIN..=83 => 3,
            84..=85 => 2,
            86..=87 => 1,
            88..=92 => 0,
            93..=94 if on_oxygen => 1,
            95..=96 if on_oxygen => 2,
            _ if on_oxygen => 3,
            _ => 0,
        });
    }
    Some(match spo2 {
        i32::MIN..=91 => 3,
        92..=93 => 2,
        94..=95 => 1,
        _ => 0,
    })
}

/// Air-or-oxygen sub-score: 2 on supplemental oxygen, 0 on room air.
#[must_use]
pub fn score_oxygen_supplement(oxygen_delivery: &str) -> Option<i32> {
    if oxygen_delivery.is_empty() {
        return None;
    }
    Some(i32::from(oxygen_delivery != "air") * 2)
}

/// Systolic blood-pressure sub-score.
#[must_use]
pub fn score_systolic_blood_pressure(sbp: Option<i32>) -> Option<i32> {
    let sbp = sbp?;
    Some(match sbp {
        i32::MIN..=90 => 3,
        91..=100 => 2,
        101..=110 => 1,
        111..=219 => 0,
        _ => 3,
    })
}

/// Pulse sub-score.
#[must_use]
pub fn score_pulse(pulse: Option<i32>) -> Option<i32> {
    let pulse = pulse?;
    Some(match pulse {
        i32::MIN..=40 => 3,
        41..=50 => 1,
        51..=90 => 0,
        91..=110 => 1,
        111..=130 => 2,
        _ => 3,
    })
}

/// Consciousness sub-score: 0 when Alert, 3 for any of C, V, P, or U.
#[must_use]
pub fn score_consciousness(acvpu: &str) -> Option<i32> {
    if acvpu.is_empty() {
        return None;
    }
    Some(i32::from(acvpu != "alert") * 3)
}

/// Temperature sub-score.
#[must_use]
pub fn score_temperature(temp: Option<f64>) -> Option<i32> {
    let temp = temp?;
    Some(if temp <= 35.0 {
        3
    } else if temp <= 36.0 {
        1
    } else if temp <= 38.0 {
        0
    } else if temp <= 39.0 {
        1
    } else {
        2
    })
}

/// Derive the NEWS2 aggregate from the seven parameters.
#[must_use]
pub fn derive_news2(obs: &Observations) -> Derivation {
    let on_oxygen = !obs.oxygen_delivery.is_empty() && obs.oxygen_delivery != "air";
    let sub_scores = SubScores {
        respiratory_rate: score_respiratory_rate(obs.respiratory_rate),
        oxygen_saturation: score_oxygen_saturation(
            obs.oxygen_saturation,
            &obs.spo2_scale,
            on_oxygen,
        ),
        oxygen_supplement: score_oxygen_supplement(&obs.oxygen_delivery),
        systolic_blood_pressure: score_systolic_blood_pressure(obs.systolic_blood_pressure),
        pulse: score_pulse(obs.pulse_rate),
        consciousness: score_consciousness(&obs.acvpu),
        temperature: score_temperature(obs.temperature_celsius),
    };
    let all = sub_scores.all();
    let complete = all.iter().all(Option::is_some);
    let total = if complete {
        Some(all.iter().map(|v| v.unwrap_or(0)).sum())
    } else {
        None
    };
    let any_parameter_scores_three = all.contains(&Some(3));
    Derivation {
        total,
        sub_scores,
        any_parameter_scores_three,
        complete,
    }
}

/// The NEWS2 total the acuity engine should use, plus what it was derived from.
#[derive(Clone, Copy, Debug, Default)]
pub struct Effective {
    /// Entered wins over derived.
    pub effective: Option<i32>,
    /// The total entered from the ward chart.
    pub entered: Option<i32>,
    /// The total derived from the seven parameters.
    pub derived: Option<i32>,
    /// Whether any single parameter scores 3.
    pub any_parameter_scores_three: bool,
}

/// Resolve the NEWS2 total: an entered total always wins over a derived one.
#[must_use]
pub fn effective_news2(obs: &Observations) -> Effective {
    let d = derive_news2(obs);
    Effective {
        effective: obs.news2_total.or(d.total),
        entered: obs.news2_total,
        derived: d.total,
        any_parameter_scores_three: d.any_parameter_scores_three,
    }
}

/// Whether every one of the seven NEWS2 parameters has been recorded.
#[must_use]
pub fn has_full_observation_set(obs: &Observations) -> bool {
    derive_news2(obs).complete
}
