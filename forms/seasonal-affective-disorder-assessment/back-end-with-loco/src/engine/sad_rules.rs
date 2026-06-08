//! Sad rules module.

// SAD scoring rules: SPAQ Global Seasonality Score (GSS) items + PHQ-9 items.
//
// SPAQ GSS — 6 items, each scored 0-4. Total 0-24. Bands:
//   0-7   = No SAD
//   8-10  = Subsyndromal SAD
//   11-24 = SAD likely
//
// PHQ-9 — 9 items, each scored 0-3. Total 0-27. Bands:
//   0-4   = Minimal
//   5-9   = Mild
//   10-14 = Moderate
//   15-19 = Moderately severe
//   20-27 = Severe

use super::types::{AssessmentData, Phq9Band, SpaqBand};

/// A SPAQ Global Seasonality Score item descriptor.
pub struct SpaqItem {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Label.
    pub label: &'static str,
    /// Extracts the numeric answer for this SPAQ item from the assessment data.
    pub extract: fn(&AssessmentData) -> Option<i32>,
}

/// A PHQ-9 depression-severity item descriptor.
pub struct Phq9Item {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Label.
    pub label: &'static str,
    /// Extracts the numeric answer for this PHQ-9 item from the assessment data.
    pub extract: fn(&AssessmentData) -> Option<i32>,
}

/// The six SPAQ Global Seasonality Score items. Each is scored 0-4 and the
/// sum (0-24) determines the seasonality band.
pub fn spaq_items() -> Vec<SpaqItem> {
    vec![
        SpaqItem {
            id: "SPAQ-001",
            category: "Mood",
            label: "Sleep length — how much do the seasons change your sleep length?",
            extract: |d| d.sleep_energy.spaq.sleep_length,
        },
        SpaqItem {
            id: "SPAQ-002",
            category: "Energy",
            label: "Social activity — how much do the seasons change your level of social activity?",
            extract: |d| d.social_occupational.spaq.social_activity,
        },
        SpaqItem {
            id: "SPAQ-003",
            category: "Mood",
            label: "Mood (general well-being) — how much does it change with the seasons?",
            extract: |d| d.social_occupational.spaq.mood,
        },
        SpaqItem {
            id: "SPAQ-004",
            category: "Weight",
            label: "Weight — how much does your weight change with the seasons?",
            extract: |d| d.appetite_weight.spaq.weight,
        },
        SpaqItem {
            id: "SPAQ-005",
            category: "Appetite",
            label: "Appetite — how much does your appetite change with the seasons?",
            extract: |d| d.appetite_weight.spaq.appetite,
        },
        SpaqItem {
            id: "SPAQ-006",
            category: "Energy",
            label: "Energy level — how much does your energy change with the seasons?",
            extract: |d| d.sleep_energy.spaq.energy_level,
        },
    ]
}

/// The nine PHQ-9 depression-severity items. Each is scored 0-3.
pub fn phq9_items() -> Vec<Phq9Item> {
    vec![
        Phq9Item {
            id: "PHQ9-Q1",
            category: "Anhedonia",
            label: "Little interest or pleasure in doing things",
            extract: |d| d.current_mood.phq9.q1,
        },
        Phq9Item {
            id: "PHQ9-Q2",
            category: "Depressed Mood",
            label: "Feeling down, depressed, or hopeless",
            extract: |d| d.current_mood.phq9.q2,
        },
        Phq9Item {
            id: "PHQ9-Q3",
            category: "Sleep",
            label: "Trouble falling or staying asleep, or sleeping too much",
            extract: |d| d.current_mood.phq9.q3,
        },
        Phq9Item {
            id: "PHQ9-Q4",
            category: "Energy",
            label: "Feeling tired or having little energy",
            extract: |d| d.current_mood.phq9.q4,
        },
        Phq9Item {
            id: "PHQ9-Q5",
            category: "Appetite",
            label: "Poor appetite or overeating",
            extract: |d| d.current_mood.phq9.q5,
        },
        Phq9Item {
            id: "PHQ9-Q6",
            category: "Self-Esteem",
            label: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
            extract: |d| d.current_mood.phq9.q6,
        },
        Phq9Item {
            id: "PHQ9-Q7",
            category: "Concentration",
            label: "Trouble concentrating on things, such as reading the newspaper or watching television",
            extract: |d| d.current_mood.phq9.q7,
        },
        Phq9Item {
            id: "PHQ9-Q8",
            category: "Psychomotor",
            label: "Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
            extract: |d| d.current_mood.phq9.q8,
        },
        Phq9Item {
            id: "PHQ9-Q9",
            category: "Self-Harm",
            label: "Thoughts that you would be better off dead, or of hurting yourself in some way",
            extract: |d| d.current_mood.phq9.q9,
        },
    ]
}

/// SPAQ band classifier (0-7 = no-sad, 8-10 = subsyndromal, 11+ = sad-likely).
pub fn classify_spaq(score: i32) -> SpaqBand {
    if score <= 7 {
        "no-sad".to_string()
    } else if score <= 10 {
        "subsyndromal".to_string()
    } else {
        "sad-likely".to_string()
    }
}

/// PHQ-9 band classifier.
pub fn classify_phq9(score: i32) -> Phq9Band {
    if score <= 4 {
        "minimal".to_string()
    } else if score <= 9 {
        "mild".to_string()
    } else if score <= 14 {
        "moderate".to_string()
    } else if score <= 19 {
        "moderately-severe".to_string()
    } else {
        "severe".to_string()
    }
}

/// Friendly label for a SPAQ band.
pub fn spaq_band_label(band: &str) -> String {
    match band {
        "no-sad" => "No SAD".to_string(),
        "subsyndromal" => "Subsyndromal SAD".to_string(),
        "sad-likely" => "SAD likely".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for a PHQ-9 band.
pub fn phq9_band_label(band: &str) -> String {
    match band {
        "minimal" => "Minimal depression".to_string(),
        "mild" => "Mild depression".to_string(),
        "moderate" => "Moderate depression".to_string(),
        "moderately-severe" => "Moderately severe depression".to_string(),
        "severe" => "Severe depression".to_string(),
        _ => String::new(),
    }
}

/// Friendly label for a combined severity.
pub fn combined_severity_label(severity: &str) -> String {
    match severity {
        "no-sad" => "No SAD".to_string(),
        "mild" => "Mild".to_string(),
        "moderate" => "Moderate".to_string(),
        "severe" => "Severe".to_string(),
        "critical" => "Critical — urgent review".to_string(),
        _ => String::new(),
    }
}
