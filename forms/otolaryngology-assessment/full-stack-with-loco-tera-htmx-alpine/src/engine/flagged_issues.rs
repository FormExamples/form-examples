use super::types::{AdditionalFlag, AssessmentData};

/// Capitalize a single ASCII word (used for side labels: "right" -> "Right").
fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        Some(c) => c.to_ascii_uppercase().to_string() + chars.as_str(),
        None => String::new(),
    }
}

fn priority_rank(p: &str) -> i32 {
    match p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    }
}

fn sum_numbers(arr: &[Option<i32>]) -> i32 {
    arr.iter().filter_map(|v| *v).sum()
}

/// Detect clinical flags for the Otolaryngology Assessment. Independent of
/// the SNOT-22 numeric total, this surfaces red-flag presentations (neck
/// mass, tympanic perforation, sudden hearing loss, head/neck cancer
/// history, severe symptom domains) that may warrant urgent or specialist
/// review.
///
/// Flag IDs and priorities mirror the front-end engine verbatim.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Red-flag presentations ───────────────────────────────
    if data.oropharyngeal_neck_examination.neck_mass == "yes" {
        let detail = &data.oropharyngeal_neck_examination.neck_mass_details;
        let msg = if detail.is_empty() {
            "Neck mass identified \u{2014} 2-week-wait head & neck referral indicated.".to_string()
        } else {
            format!(
                "Neck mass identified: {detail} \u{2014} 2-week-wait head & neck referral indicated."
            )
        };
        flags.push(AdditionalFlag {
            id: "FLAG-NECK-001".to_string(),
            category: "Neck Examination".to_string(),
            message: msg,
            priority: "urgent".to_string(),
        });
    }

    if data.past_ent_history.head_neck_cancer == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-HX-001".to_string(),
            category: "Past History".to_string(),
            message: "Personal history of head and neck cancer \u{2014} heightened surveillance required.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.past_ent_history.head_neck_radiotherapy == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-HX-002".to_string(),
            category: "Past History".to_string(),
            message: "Prior head and neck radiotherapy \u{2014} consider late effects (xerostomia, fibrosis, hypothyroidism).".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Otoscopy ─────────────────────────────────────────────
    for side in ["right", "left"] {
        let s = if side == "right" {
            &data.otoscopy.right
        } else {
            &data.otoscopy.left
        };
        if s.tympanic_membrane == "perforated" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-OTO-PERF-{}", side.to_uppercase()),
                category: "Otoscopy".to_string(),
                message: format!(
                    "{} tympanic membrane perforated \u{2014} assess hearing, water precautions, ENT review.",
                    capitalize(side)
                ),
                priority: "high".to_string(),
            });
        }
        if s.tympanic_membrane == "effusion" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-OTO-EFFU-{}", side.to_uppercase()),
                category: "Otoscopy".to_string(),
                message: format!(
                    "{} middle-ear effusion \u{2014} consider tympanometry and audiology referral.",
                    capitalize(side)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Sudden hearing loss / vertigo ────────────────────────
    if data.past_ent_history.hearing_loss == "yes"
        && data.history_of_present_illness.onset_type == "sudden"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-AUD-001".to_string(),
            category: "Audiology".to_string(),
            message: "Sudden-onset hearing loss reported \u{2014} urgent ENT/audiology referral recommended within 24-48 hours.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.past_ent_history.vertigo == "yes"
        && data.history_of_present_illness.onset_type == "sudden"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-VEST-001".to_string(),
            category: "Vestibular".to_string(),
            message: "Sudden-onset vertigo \u{2014} exclude central cause; consider HINTS exam and urgent review.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Nasal polyps / discharge ─────────────────────────────
    for side in ["right", "left"] {
        let r = if side == "right" {
            &data.anterior_rhinoscopy.right
        } else {
            &data.anterior_rhinoscopy.left
        };
        let polyps = r.polyps.as_str();
        if polyps == "large" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-RHINO-POLYP-{}", side.to_uppercase()),
                category: "Rhinoscopy".to_string(),
                message: format!(
                    "{} large nasal polyps \u{2014} likely contributing to obstruction; consider intranasal steroid trial and ENT referral.",
                    capitalize(side)
                ),
                priority: "high".to_string(),
            });
        } else if polyps == "medium" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-RHINO-POLYPM-{}", side.to_uppercase()),
                category: "Rhinoscopy".to_string(),
                message: format!("{} medium nasal polyps documented.", capitalize(side)),
                priority: "medium".to_string(),
            });
        }
        let disch = r.discharge.as_str();
        if disch == "purulent" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-RHINO-PUS-{}", side.to_uppercase()),
                category: "Rhinoscopy".to_string(),
                message: format!(
                    "{} purulent nasal discharge \u{2014} consider acute bacterial sinusitis.",
                    capitalize(side)
                ),
                priority: "medium".to_string(),
            });
        }
        if disch == "blood" {
            flags.push(AdditionalFlag {
                id: format!("FLAG-RHINO-BLOOD-{}", side.to_uppercase()),
                category: "Rhinoscopy".to_string(),
                message: format!(
                    "{} blood-stained nasal discharge \u{2014} exclude tumour or significant trauma.",
                    capitalize(side)
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Oropharyngeal exam ───────────────────────────────────
    if data.oropharyngeal_neck_examination.tonsils == "asymmetric" {
        flags.push(AdditionalFlag {
            id: "FLAG-OROPHX-001".to_string(),
            category: "Oropharynx".to_string(),
            message: "Asymmetric tonsils \u{2014} exclude tonsillar malignancy; consider ENT referral.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.oropharyngeal_neck_examination.oral_mucosa == "ulcerated" {
        flags.push(AdditionalFlag {
            id: "FLAG-OROPHX-002".to_string(),
            category: "Oropharynx".to_string(),
            message: "Oral mucosal ulceration \u{2014} if persistent >3 weeks, urgent 2-week-wait referral.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.oropharyngeal_neck_examination.cervical_lymphadenopathy == "yes" {
        let detail = &data
            .oropharyngeal_neck_examination
            .cervical_lymphadenopathy_details;
        let msg = if detail.is_empty() {
            "Cervical lymphadenopathy \u{2014} characterise (size, mobility, tenderness) and consider USS / FNA.".to_string()
        } else {
            format!(
                "Cervical lymphadenopathy: {detail} \u{2014} characterise (size, mobility, tenderness) and consider USS / FNA."
            )
        };
        flags.push(AdditionalFlag {
            id: "FLAG-LN-001".to_string(),
            category: "Cervical Lymphadenopathy".to_string(),
            message: msg,
            priority: "medium".to_string(),
        });
    }
    if data.oropharyngeal_neck_examination.thyroid_enlarged == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-THY-001".to_string(),
            category: "Thyroid".to_string(),
            message: "Thyroid enlargement on examination \u{2014} TFTs and thyroid USS recommended."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── External examination ────────────────────────────────
    if data.external_examination.facial_asymmetry == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EXT-001".to_string(),
            category: "External Examination".to_string(),
            message: "Facial asymmetry \u{2014} assess facial nerve function and parotid region."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.external_examination.skin_lesions == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EXT-002".to_string(),
            category: "External Examination".to_string(),
            message: "Skin lesions noted \u{2014} document and consider dermoscopy / dermatology referral.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Lifestyle ────────────────────────────────────────────
    if data.past_ent_history.smoking == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SOC-001".to_string(),
            category: "Social History".to_string(),
            message: "Active smoking \u{2014} head/neck cancer risk factor; advise cessation."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.past_ent_history.alcohol == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SOC-002".to_string(),
            category: "Social History".to_string(),
            message: "Significant alcohol use \u{2014} head/neck cancer risk factor; quantify and advise.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── SNOT-22 domain hot-spots ─────────────────────────────
    let snot = &data.snot22;
    let sleep_items = [
        snot.difficulty_falling_asleep,
        snot.waking_up_at_night,
        snot.lack_of_good_nights_sleep,
        snot.waking_up_tired,
    ];
    if sleep_items.iter().all(|v| v.is_some()) {
        let total = sum_numbers(&sleep_items);
        if total >= 12 {
            flags.push(AdditionalFlag {
                id: "FLAG-SNOT-SLEEP".to_string(),
                category: "SNOT-22".to_string(),
                message: format!(
                    "High sleep-domain burden ({total}/20) \u{2014} screen for OSA and consider sleep study."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    let psych_items = [
        snot.frustrated_restless_irritable,
        snot.sad,
        snot.embarrassed,
        snot.fatigue,
    ];
    if psych_items.iter().all(|v| v.is_some()) {
        let total = sum_numbers(&psych_items);
        if total >= 12 {
            flags.push(AdditionalFlag {
                id: "FLAG-SNOT-PSY".to_string(),
                category: "SNOT-22".to_string(),
                message: format!(
                    "High psychological-domain burden ({total}/20) \u{2014} consider mental-health support alongside ENT management."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| priority_rank(&f.priority));
    flags
}
