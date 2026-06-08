//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::age_in_years;

/// Detect NICE CG156 clinician-facing flags. Independent of the concern
/// score, these raise urgent referral indications, abnormal hormone results,
/// severe semen abnormalities, modifiable lifestyle factors, and prior
/// pelvic disease. Priorities sort urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Urgent referral indications ──────────────────────────
    let female_age = age_in_years(&data.demographics.patient_date_of_birth);
    if let Some(age) = female_age {
        if age >= 40 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-001".to_string(),
                category: "Age".to_string(),
                message: format!(
                    "Female partner age {age} — significant age-related fertility decline; urgent specialist referral."
                ),
                priority: "urgent".to_string(),
            });
        } else if age >= 36 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-002".to_string(),
                category: "Age".to_string(),
                message: format!(
                    "Female partner age {age} — earlier referral threshold (NICE CG156: refer after 6 months)."
                ),
                priority: "high".to_string(),
            });
        }
    }

    if data.menstrual_cycle.cycle_regularity == "absent" {
        flags.push(AdditionalFlag {
            id: "FLAG-CYC-001".to_string(),
            category: "Menstrual Cycle".to_string(),
            message: "Amenorrhoea — investigate hypothalamic, pituitary, ovarian or uterine cause."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if let Some(misc) = data.reproductive_history.prior_miscarriages {
        if misc >= 3 {
            flags.push(AdditionalFlag {
                id: "FLAG-RH-001".to_string(),
                category: "Reproductive History".to_string(),
                message: format!(
                    "Recurrent pregnancy loss ({misc} miscarriages) — recurrent miscarriage clinic referral."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Ovarian reserve ──────────────────────────────────────
    if let Some(amh) = data.hormone_profile.amh {
        if amh < 5.4 {
            flags.push(AdditionalFlag {
                id: "FLAG-OR-001".to_string(),
                category: "Ovarian Reserve".to_string(),
                message: format!(
                    "AMH {amh} pmol/L — low ovarian reserve; consider expedited ART."
                ),
                priority: "high".to_string(),
            });
        }
    }

    if let Some(fsh) = data.hormone_profile.fsh {
        if fsh > 8.9 {
            flags.push(AdditionalFlag {
                id: "FLAG-OR-002".to_string(),
                category: "Ovarian Reserve".to_string(),
                message: format!("Day-2/3 FSH {fsh} IU/L — reduced ovarian reserve."),
                priority: "high".to_string(),
            });
        }
    }

    if let Some(afc) = data.investigations.antral_follicle_count {
        if afc < 7 {
            flags.push(AdditionalFlag {
                id: "FLAG-OR-003".to_string(),
                category: "Ovarian Reserve".to_string(),
                message: format!("Antral follicle count {afc} — low ovarian reserve."),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Endocrine ────────────────────────────────────────────
    if let Some(prl) = data.hormone_profile.prolactin {
        if prl > 500.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HOR-001".to_string(),
                category: "Endocrine".to_string(),
                message: format!(
                    "Prolactin {prl} mIU/L — hyperprolactinaemia; consider pituitary imaging."
                ),
                priority: "high".to_string(),
            });
        }
    }

    if let Some(tsh) = data.hormone_profile.tsh {
        if tsh < 0.4 || tsh > 2.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-HOR-002".to_string(),
                category: "Endocrine".to_string(),
                message: format!(
                    "TSH {tsh} mIU/L outside fertility-optimal 0.4-2.5; treat thyroid dysfunction."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    if let Some(prog) = data.hormone_profile.progesterone_day21 {
        if prog < 30.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HOR-003".to_string(),
                category: "Endocrine".to_string(),
                message: format!(
                    "Day-21 progesterone {prog} nmol/L — likely anovulation."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Semen analysis (WHO 2021 LRLs) ───────────────────────
    if data.partner_semen.semen_analysis_done == "yes" {
        let v = data.partner_semen.semen_volume_ml;
        let c = data.partner_semen.semen_concentration_million_per_ml;
        let tm = data.partner_semen.semen_total_motility_percent;
        let pm = data.partner_semen.semen_progressive_motility_percent;
        let morph = data.partner_semen.semen_normal_morphology_percent;

        if let Some(conc) = c {
            if conc < 5.0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-SEM-001".to_string(),
                    category: "Semen Analysis".to_string(),
                    message: format!(
                        "Severe oligozoospermia ({conc} million/mL) — likely ICSI indicated."
                    ),
                    priority: "urgent".to_string(),
                });
            } else if conc < 16.0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-SEM-002".to_string(),
                    category: "Semen Analysis".to_string(),
                    message: format!(
                        "Oligozoospermia: concentration {conc} million/mL below WHO 2021 LRL (16)."
                    ),
                    priority: "high".to_string(),
                });
            }
        }

        if let Some(t) = tm {
            if t < 42.0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-SEM-003".to_string(),
                    category: "Semen Analysis".to_string(),
                    message: format!(
                        "Asthenozoospermia: total motility {t}% below WHO 2021 LRL (42)."
                    ),
                    priority: "high".to_string(),
                });
            }
        }

        if let Some(p) = pm {
            if p < 30.0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-SEM-004".to_string(),
                    category: "Semen Analysis".to_string(),
                    message: format!(
                        "Progressive motility {p}% below WHO 2021 LRL (30)."
                    ),
                    priority: "medium".to_string(),
                });
            }
        }

        if let Some(m) = morph {
            if m < 4.0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-SEM-005".to_string(),
                    category: "Semen Analysis".to_string(),
                    message: format!(
                        "Teratozoospermia: normal morphology {m}% below WHO 2021 LRL (4)."
                    ),
                    priority: "high".to_string(),
                });
            }
        }

        if let Some(vol) = v {
            if vol < 1.4 {
                flags.push(AdditionalFlag {
                    id: "FLAG-SEM-006".to_string(),
                    category: "Semen Analysis".to_string(),
                    message: format!("Semen volume {vol} mL below WHO 2021 LRL (1.4)."),
                    priority: "medium".to_string(),
                });
            }
        }
    } else {
        flags.push(AdditionalFlag {
            id: "FLAG-SEM-000".to_string(),
            category: "Semen Analysis".to_string(),
            message:
                "Semen analysis not yet completed — arrange WHO 2021 standardised analysis."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Pelvic / surgical history ────────────────────────────
    if data.medical_surgical_history.pelvic_inflammatory_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PEL-001".to_string(),
            category: "Pelvic History".to_string(),
            message: "Prior pelvic inflammatory disease — assess tubal patency.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.medical_surgical_history.endometriosis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PEL-002".to_string(),
            category: "Pelvic History".to_string(),
            message: "Endometriosis — may impair fertility; consider laparoscopy.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.medical_surgical_history.polycystic_ovary_syndrome == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PEL-003".to_string(),
            category: "Pelvic History".to_string(),
            message:
                "PCOS — manage weight, consider ovulation induction (clomifene/letrozole)."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if let Some(ect) = data.reproductive_history.prior_ectopic {
        if ect >= 1 {
            flags.push(AdditionalFlag {
                id: "FLAG-RH-002".to_string(),
                category: "Reproductive History".to_string(),
                message: format!(
                    "Prior ectopic pregnancy ({ect}) — assess tubal patency."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Tubal investigations ─────────────────────────────────
    if data.investigations.hysterosalpingogram_done == "yes"
        && data.investigations.hysterosalpingogram_result == "abnormal"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-TUB-001".to_string(),
            category: "Tubal".to_string(),
            message: "Abnormal hysterosalpingogram — tubal factor; consider IVF.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── BMI ──────────────────────────────────────────────────
    if let Some(bmi) = data.lifestyle_factors.bmi {
        if bmi >= 35.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-001".to_string(),
                category: "Lifestyle".to_string(),
                message: format!(
                    "BMI {bmi} — NICE recommends weight loss before NHS-funded ART."
                ),
                priority: "high".to_string(),
            });
        } else if bmi >= 30.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-002".to_string(),
                category: "Lifestyle".to_string(),
                message: format!(
                    "BMI {bmi} — obesity reduces fertility; weight management advised."
                ),
                priority: "medium".to_string(),
            });
        } else if bmi < 19.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BMI-003".to_string(),
                category: "Lifestyle".to_string(),
                message: format!("BMI {bmi} — underweight may impair ovulation."),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Modifiable lifestyle ─────────────────────────────────
    if data.lifestyle_factors.tobacco_status == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-001".to_string(),
            category: "Lifestyle".to_string(),
            message: "Patient currently smokes — strongly advise cessation prior to conception or ART."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.partner_semen.partner_smoking == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-002".to_string(),
            category: "Partner Lifestyle".to_string(),
            message: "Male partner currently smokes — advise cessation; impairs sperm quality."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.lifestyle_factors.alcohol_level == "heavy" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-003".to_string(),
            category: "Lifestyle".to_string(),
            message: "Heavy alcohol intake — advise reduction to within UK low-risk limits."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.lifestyle_factors.recreational_drugs == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-004".to_string(),
            category: "Lifestyle".to_string(),
            message: "Recreational drug use — advise cessation.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Folic acid ───────────────────────────────────────────
    if data.medications_supplements.folic_acid != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-001".to_string(),
            category: "Supplements".to_string(),
            message:
                "Pre-conception folic acid not confirmed — advise 400 mcg daily (5 mg if higher risk)."
                    .to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Cancer history ───────────────────────────────────────
    if data.medical_surgical_history.cancer_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CAN-001".to_string(),
            category: "Medical History".to_string(),
            message:
                "Cancer treatment history — review fertility-preservation options and gonadotoxic exposure."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
