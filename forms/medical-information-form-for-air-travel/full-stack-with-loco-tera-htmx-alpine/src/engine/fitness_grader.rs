//! Airline-aligned MEDIF fitness-to-fly engine.
//!
//! Ported verbatim (rule IDs, flag IDs, thresholds, and message text) from
//! `front-end-form-with-html/js/app.js` `evaluateFitness`.
//!
//! Algorithm: **max-grade** — the worst-band finding sets the overall band.
//! The default band is `fit` when no rule fires.

use super::types::{AssessmentData, FiredRule, GradingResult, SafetyFlag};
use super::utils::{band_rank, days_ago, desk_recommendation, iso_today_plus, worse_band};

/// Run the full fitness engine over the assessment data.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (band, fired_rules, safety_flags) = evaluate_fitness(data);

    GradingResult {
        fitness_band: band.clone(),
        fired_rules,
        safety_flags,
        desk_recommendation: desk_recommendation(&band),
        valid_until: iso_today_plus(10),
        timestamp,
    }
}

/// Evaluate the airline-aligned MEDIF rules; returns (band, firedRules, safetyFlags).
pub fn evaluate_fitness(d: &AssessmentData) -> (String, Vec<FiredRule>, Vec<SafetyFlag>) {
    let mut band = String::from("fit");
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut safety_flags: Vec<SafetyFlag> = Vec::new();

    let fire = |band: &mut String,
                fired_rules: &mut Vec<FiredRule>,
                id: &str,
                rule_band: &str,
                description: String| {
        fired_rules.push(FiredRule {
            id: id.to_string(),
            band: rule_band.to_string(),
            description,
        });
        *band = worse_band(band, rule_band);
    };

    let flag = |safety_flags: &mut Vec<SafetyFlag>,
                id: &str,
                priority: &str,
                category: &str,
                message: String| {
        safety_flags.push(SafetyFlag {
            id: id.to_string(),
            priority: priority.to_string(),
            category: category.to_string(),
            message,
        });
    };

    // ─── Cardiac ──────────────────────────────────────────────────────
    let mi_days = days_ago(&d.cardiovascular.recent_mi_date);
    if let Some(days) = mi_days {
        if days <= 7 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-CARDIAC-MI-7D",
                "unfit-to-fly",
                format!("Acute MI within 7 days ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-CARDIAC-MI",
                "high",
                "cardiac",
                "Acute myocardial infarction within 7 days.".to_string(),
            );
        } else if days <= 14 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-CARDIAC-MI-14D",
                "requires-review",
                format!("Recent MI within 14 days ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-CARDIAC-MI-RECENT",
                "medium",
                "cardiac",
                "Myocardial infarction 8-14 days ago.".to_string(),
            );
        }
    }
    if d.cardiovascular.unstable_angina == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-CARDIAC-UNSTABLE-ANGINA",
            "requires-review",
            "Unstable angina present.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-CARDIAC-UNSTABLE-ANGINA",
            "medium",
            "cardiac",
            "Unstable angina \u{2014} cabin hypoxia may provoke ischaemia.".to_string(),
        );
    }
    if d.cardiovascular.nyha_class == "IV" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-CARDIAC-NYHA-IV",
            "unfit-to-fly",
            "NYHA class IV \u{2014} symptoms at rest.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-CARDIAC-NYHA-IV",
            "high",
            "cardiac",
            "NYHA functional class IV.".to_string(),
        );
    } else if d.cardiovascular.nyha_class == "III" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-CARDIAC-NYHA-III",
            "requires-review",
            "NYHA class III \u{2014} marked limitation.".to_string(),
        );
    }

    // ─── Pulmonary ────────────────────────────────────────────────────
    let pneumo_days = days_ago(&d.respiratory.recent_pneumothorax_date);
    if let Some(days) = pneumo_days {
        if days <= 14 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-PULM-PNEUMOTHORAX-14D",
                "unfit-to-fly",
                format!("Pneumothorax within 14 days ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-PULM-PNEUMOTHORAX",
                "high",
                "pulmonary",
                "Cabin pressure expands trapped air; pneumothorax within 14 days.".to_string(),
            );
        }
    }
    if let Some(spo2) = d.respiratory.resting_spo2_percent {
        if spo2 < 85.0 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-PULM-SPO2-LT-85",
                "unfit-to-fly",
                format!("Resting SpO2 {spo2}% on room air < 85%."),
            );
            flag(
                &mut safety_flags,
                "F-PULM-HYPOXAEMIA",
                "high",
                "pulmonary",
                "Severe resting hypoxaemia on room air.".to_string(),
            );
        } else if spo2 < 92.0 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-PULM-SPO2-LT-92",
                "requires-review",
                format!(
                    "Resting SpO2 {spo2}% suggests in-flight supplementation needed."
                ),
            );
            flag(
                &mut safety_flags,
                "F-PULM-LOW-SPO2",
                "medium",
                "pulmonary",
                "Borderline room-air saturation; consider in-flight O2.".to_string(),
            );
        }
    }
    if d.respiratory.hypoxic_challenge_result == "fail" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-PULM-HCT-FAIL",
            "requires-review",
            "Hypoxic challenge test: fail.".to_string(),
        );
    }
    if d.respiratory.copd_severity == "severe" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-PULM-COPD-SEVERE",
            "requires-review",
            "Severe COPD.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-PULM-COPD-SEVERE",
            "medium",
            "pulmonary",
            "Severe COPD \u{2014} review oxygen prescription for cruise altitude.".to_string(),
        );
    }
    if d.respiratory.asthma_severity == "severe-uncontrolled" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-PULM-ASTHMA-SEVERE",
            "requires-review",
            "Severe uncontrolled asthma.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-PULM-ASTHMA-SEVERE",
            "medium",
            "pulmonary",
            "Severe uncontrolled asthma.".to_string(),
        );
    } else if d.respiratory.asthma_severity == "mild-controlled" {
        flag(
            &mut safety_flags,
            "F-PULM-ASTHMA-MILD",
            "low",
            "pulmonary",
            "Mild controlled asthma \u{2014} carry reliever in cabin.".to_string(),
        );
    }
    let pe_days = days_ago(&d.respiratory.recent_pulmonary_embolism_date);
    if let Some(days) = pe_days {
        if days <= 42 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-PULM-PE-6WK",
                "requires-review",
                format!("Pulmonary embolism within 6 weeks ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-PULM-PE",
                "medium",
                "pulmonary",
                "Recent pulmonary embolism within 6 weeks.".to_string(),
            );
        }
    }

    // ─── Gas expansion / surgery / fracture ────────────────────────────
    let surgery_days = days_ago(&d.recent_events.last_surgery_date);
    let cabin_gas = d.recent_events.cabin_gas_risk.as_str();
    if cabin_gas == "intra-ocular-gas"
        || cabin_gas == "intra-cranial-gas"
        || cabin_gas == "intra-abdominal-gas"
    {
        fire(
            &mut band,
            &mut fired_rules,
            "R-GAS-CAVITY",
            "unfit-to-fly",
            format!("Trapped gas ({cabin_gas}) \u{2014} cabin pressure expansion risk."),
        );
        flag(
            &mut safety_flags,
            "F-GAS-CAVITY",
            "high",
            "gas-expansion",
            "Trapped gas in body cavity; cabin pressure causes expansion.".to_string(),
        );
    } else if cabin_gas == "pneumothorax" {
        flag(
            &mut safety_flags,
            "F-GAS-PNEUMO",
            "high",
            "gas-expansion",
            "Pneumothorax noted as cabin gas-expansion risk.".to_string(),
        );
        band = worse_band(&band, "unfit-to-fly");
        fired_rules.push(FiredRule {
            id: "R-GAS-PNEUMO".to_string(),
            band: "unfit-to-fly".to_string(),
            description: "Pneumothorax noted as cabin gas-expansion risk.".to_string(),
        });
    } else if cabin_gas == "plaster-cast" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-GAS-CAST",
            "requires-review",
            "Plaster cast \u{2014} risk of expansion under cabin pressure; bivalve may be required."
                .to_string(),
        );
        flag(
            &mut safety_flags,
            "F-GAS-CAST",
            "medium",
            "gas-expansion",
            "Plaster cast \u{2014} bivalve or split before flight.".to_string(),
        );
    }
    if let Some(days) = surgery_days {
        if days <= 10 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-SURG-RECENT-10D",
                "requires-review",
                format!("Recent surgery within 10 days ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-SURG-RECENT",
                "medium",
                "surgery",
                "Recent surgery within 10 days.".to_string(),
            );
        } else if days <= 14 {
            flag(
                &mut safety_flags,
                "F-SURG-2WK",
                "medium",
                "surgery",
                "Surgery 11-14 days ago.".to_string(),
            );
        }
    }
    if d.recent_events.recent_fracture_cast == "yes" {
        flag(
            &mut safety_flags,
            "F-MSK-FRACTURE",
            "low",
            "mobility",
            "Recent fracture with cast.".to_string(),
        );
    }
    let dvt_days = days_ago(&d.recent_events.recent_dvt_date);
    if let Some(days) = dvt_days {
        if days <= 28 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-DVT-RECENT",
                "requires-review",
                format!("Recent DVT within 4 weeks ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-DVT",
                "medium",
                "haematology",
                "Recent deep vein thrombosis.".to_string(),
            );
        }
    }
    if d.recent_events.scuba_diving_within24h == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-SCUBA-24H",
            "unfit-to-fly",
            "Scuba diving within 24 hours of departure.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-SCUBA",
            "high",
            "gas-expansion",
            "Scuba diving within 24h \u{2014} decompression-sickness risk.".to_string(),
        );
    }
    let stroke_days = days_ago(&d.recent_events.recent_stroke_date);
    if let Some(days) = stroke_days {
        if days <= 10 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-STROKE-10D",
                "requires-review",
                format!("Recent stroke within 10 days ({days}d ago)."),
            );
            flag(
                &mut safety_flags,
                "F-STROKE",
                "medium",
                "cardiac",
                "Recent stroke within 10 days.".to_string(),
            );
        }
    }

    // ─── Pregnancy ────────────────────────────────────────────────────
    if d.pregnancy.is_pregnant == "yes" {
        if let Some(gw) = d.pregnancy.gestation_weeks {
            let is_singleton =
                d.pregnancy.pregnancy_type == "singleton" || d.pregnancy.pregnancy_type.is_empty();
            if is_singleton && gw > 36 {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-PREG-SINGLETON-GT-36",
                    "unfit-to-fly",
                    format!("Singleton pregnancy {gw} weeks (> 36)."),
                );
                flag(
                    &mut safety_flags,
                    "F-PREG-LATE",
                    "high",
                    "pregnancy",
                    "Late singleton pregnancy beyond 36 weeks.".to_string(),
                );
            } else if !is_singleton && gw > 32 {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-PREG-MULTIPLE-GT-32",
                    "unfit-to-fly",
                    format!("Multiple pregnancy {gw} weeks (> 32)."),
                );
                flag(
                    &mut safety_flags,
                    "F-PREG-MULTIPLE-LATE",
                    "high",
                    "pregnancy",
                    "Late multiple pregnancy beyond 32 weeks.".to_string(),
                );
            } else if is_singleton && gw >= 28 {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-PREG-SINGLETON-28-36",
                    "requires-review",
                    format!(
                        "Singleton pregnancy {gw} weeks (28-36) \u{2014} physician certificate required."
                    ),
                );
                flag(
                    &mut safety_flags,
                    "F-PREG-CERT",
                    "medium",
                    "pregnancy",
                    "Late pregnancy \u{2014} airline pregnancy certificate required.".to_string(),
                );
            } else if !is_singleton && gw >= 24 {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-PREG-MULTIPLE-24-32",
                    "requires-review",
                    format!(
                        "Multiple pregnancy {gw} weeks (24-32) \u{2014} physician certificate required."
                    ),
                );
                flag(
                    &mut safety_flags,
                    "F-PREG-MULTIPLE-CERT",
                    "medium",
                    "pregnancy",
                    "Multiple pregnancy late stage \u{2014} certificate required.".to_string(),
                );
            }
        }
    }

    // ─── Communicable disease ────────────────────────────────────────
    if d.communicable.communicable_disease_status == "infectious" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-COMM-INFECTIOUS",
            "unfit-to-fly",
            "Active communicable disease in infectious period.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-COMM-INFECTIOUS",
            "high",
            "communicable",
            "Contagious communicable disease.".to_string(),
        );
    } else if d.communicable.communicable_disease_status == "convalescent" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-COMM-CONVALESCENT",
            "requires-review",
            "Convalescent communicable disease.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-COMM-CONVALESCENT",
            "medium",
            "communicable",
            "Convalescent communicable disease.".to_string(),
        );
    }

    // ─── Anaemia ──────────────────────────────────────────────────────
    if let Some(hb) = d.medications.haemoglobin_g_per_l {
        if hb < 75 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-ANAEMIA-SEVERE",
                "unfit-to-fly",
                format!("Severe anaemia: Hb {hb} g/L (< 75)."),
            );
            flag(
                &mut safety_flags,
                "F-ANAEMIA",
                "high",
                "anaemia",
                "Severe anaemia Hb < 75 g/L.".to_string(),
            );
        } else if hb < 85 {
            fire(
                &mut band,
                &mut fired_rules,
                "R-ANAEMIA-MOD",
                "requires-review",
                format!("Moderate anaemia: Hb {hb} g/L."),
            );
            flag(
                &mut safety_flags,
                "F-ANAEMIA-MOD",
                "medium",
                "anaemia",
                "Moderate anaemia.".to_string(),
            );
        }
    }

    // ─── Equipment ────────────────────────────────────────────────────
    if d.inflight_needs.requires_supplemental_oxygen == "yes" {
        let flow = d.inflight_needs.oxygen_flow_rate_lpm;
        if let Some(f) = flow {
            if f > 4.0 {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-O2-GT-4LPM",
                    "requires-review",
                    format!("Supplemental oxygen {f} L/min > 4 L/min sustained."),
                );
                flag(
                    &mut safety_flags,
                    "F-O2-HIGH-FLOW",
                    "high",
                    "equipment",
                    "High-flow oxygen request; dangerous-goods declaration required.".to_string(),
                );
            } else {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-O2-LOW-FLOW",
                    "fit-with-conditions",
                    format!("Supplemental oxygen {f} L/min."),
                );
            }
        } else {
            fire(
                &mut band,
                &mut fired_rules,
                "R-O2-LOW-FLOW",
                "fit-with-conditions",
                "Supplemental oxygen requested.".to_string(),
            );
        }
    }
    if d.inflight_needs.requires_poc == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-POC",
            "fit-with-conditions",
            "Portable oxygen concentrator in cabin.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-POC",
            "low",
            "equipment",
            "POC \u{2014} confirm IATA-approved device and adequate batteries.".to_string(),
        );
        // Battery hours must exceed sector duration + 50%.
        if let (Some(bh), Some(sec_min)) = (
            d.inflight_needs.poc_battery_hours,
            d.trip.sector_duration_minutes,
        ) {
            let required_hours = (sec_min as f64 / 60.0) * 1.5;
            if bh < required_hours {
                fire(
                    &mut band,
                    &mut fired_rules,
                    "R-POC-BATTERY-INSUFFICIENT",
                    "requires-review",
                    format!(
                        "POC battery {bh}h < required {required_hours:.1}h (sector + 50%)."
                    ),
                );
                flag(
                    &mut safety_flags,
                    "F-POC-BATTERY",
                    "high",
                    "equipment",
                    "POC battery insufficient for sector duration + 50% margin.".to_string(),
                );
            }
        }
    }
    if d.inflight_needs.requires_stretcher == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-STRETCHER",
            "requires-review",
            "Stretcher requested \u{2014} sector-specific airline approval required.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-STRETCHER",
            "medium",
            "equipment",
            "Stretcher requires advance airline approval.".to_string(),
        );
    }
    if d.inflight_needs.requires_incubator == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-INCUBATOR",
            "requires-review",
            "Infant incubator requested.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-INCUBATOR",
            "medium",
            "equipment",
            "Infant incubator requires advance airline approval.".to_string(),
        );
    }
    if d.inflight_needs.requires_iv_pump == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-IV-PUMP",
            "requires-review",
            "IV pump in cabin.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-IV-PUMP",
            "medium",
            "equipment",
            "IV pump \u{2014} dangerous-goods battery declaration.".to_string(),
        );
    }
    if d.medications.dangerous_goods_battery_declaration == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-DG-BATTERY",
            "requires-review",
            "Dangerous-goods battery declaration required.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-DG-BATTERY",
            "medium",
            "equipment",
            "IATA Dangerous Goods Regulations battery declaration.".to_string(),
        );
    }
    if d.inflight_needs.requires_medical_escort == "yes" {
        flag(
            &mut safety_flags,
            "F-ESCORT",
            "low",
            "mobility",
            "Medical escort accompanies passenger.".to_string(),
        );
    }
    if d.inflight_needs.wheelchair_type == "WCHC" {
        flag(
            &mut safety_flags,
            "F-WCHC",
            "low",
            "mobility",
            "WCHC \u{2014} passenger needs cabin-level wheelchair assistance.".to_string(),
        );
    }

    // ─── Submitter / coverage ────────────────────────────────────────
    if d.reason.reason_psychiatric == "yes" {
        fire(
            &mut band,
            &mut fired_rules,
            "R-PSYCH",
            "requires-review",
            "Recent psychiatric event requiring clearance.".to_string(),
        );
        flag(
            &mut safety_flags,
            "F-PSYCH",
            "medium",
            "psychiatric",
            "Psychiatric clearance required.".to_string(),
        );
    }

    // Sort flags by priority high > medium > low.
    safety_flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    // Sort fired rules by band severity (worst first).
    fired_rules.sort_by(|a, b| band_rank(&b.band).cmp(&band_rank(&a.band)));

    (band, fired_rules, safety_flags)
}
