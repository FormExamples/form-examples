//! Detection of additional flagged issues.

// Flagged-issue detection for the Audio-Vestibular Assessment.
//
// Independent of the WHO grade and the DHI total, this module raises
// clinician-facing flags for red-flag presentations (sudden sensorineural
// hearing loss, asymmetric hearing loss suggesting retrocochlear pathology,
// central neurological signs), high handicap scores, fall risk, and
// findings that warrant ENT or neurology referral.
//
// Priority levels: urgent > high > medium > low.

use super::types::{AdditionalFlag, AssessmentData, GradingResult};

/// Detect additional flags from the assessment data and an already-computed
/// `GradingResult`. Returns flags sorted by priority (urgent → low).
pub fn detect_additional_flags(
    data: &AssessmentData,
    result: &GradingResult,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── RED-FLAG presentations ───────────────────────────────────────
    if data.presenting_symptoms.hearing_loss == "yes"
        && data.presenting_symptoms.hearing_loss_onset == "sudden"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-RED-001".to_string(),
            category: "Red Flag".to_string(),
            message: "Sudden hearing loss reported - possible sudden sensorineural hearing loss; same-day ENT review and consider corticosteroids.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.presenting_symptoms.neurological_symptoms == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RED-002".to_string(),
            category: "Red Flag".to_string(),
            message: "Associated neurological symptoms (weakness, diplopia, dysarthria, etc.) - urgent neurology evaluation.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.vestibular_screening.head_impulse_test == "normal"
        && !data.vestibular_screening.nystagmus.is_empty()
        && data.vestibular_screening.nystagmus != "none"
        && data.presenting_symptoms.vertigo == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-RED-003".to_string(),
            category: "Red Flag".to_string(),
            message: "Acute vertigo with normal HIT and nystagmus - consider central cause (HINTS: refer for neurology / posterior circulation imaging).".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Asymmetric hearing loss (retrocochlear screen) ──────────────
    if let Some(asym) = result.asymmetry {
        if asym >= 15.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-PTA-001".to_string(),
                category: "Pure-Tone Audiometry".to_string(),
                message: format!(
                    "Inter-aural asymmetry {} dB - retrocochlear pathology screen (MRI IAM) recommended.",
                    asym
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Severe / profound hearing loss ──────────────────────────────
    match result.hearing_loss_grade.as_str() {
        "profound" => flags.push(AdditionalFlag {
            id: "FLAG-PTA-002".to_string(),
            category: "Pure-Tone Audiometry".to_string(),
            message: "Profound hearing loss - consider cochlear implant assessment.".to_string(),
            priority: "high".to_string(),
        }),
        "severe" => flags.push(AdditionalFlag {
            id: "FLAG-PTA-003".to_string(),
            category: "Pure-Tone Audiometry".to_string(),
            message: "Severe hearing loss - hearing-aid candidacy review and audiology rehabilitation.".to_string(),
            priority: "medium".to_string(),
        }),
        "moderately-severe" | "moderate" => flags.push(AdditionalFlag {
            id: "FLAG-PTA-004".to_string(),
            category: "Pure-Tone Audiometry".to_string(),
            message: "Moderate hearing loss - hearing-aid candidacy review.".to_string(),
            priority: "medium".to_string(),
        }),
        _ => {}
    }

    // ─── Word recognition concerns ───────────────────────────────────
    if let Some(wr) = data.speech_audiometry.right_word_recognition_percent {
        if wr < 50.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-SPEECH-R-001".to_string(),
                category: "Speech Audiometry".to_string(),
                message: format!(
                    "Poor word-recognition score ({}%) right ear - retrocochlear screen indicated.",
                    wr
                ),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(wr) = data.speech_audiometry.left_word_recognition_percent {
        if wr < 50.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-SPEECH-L-001".to_string(),
                category: "Speech Audiometry".to_string(),
                message: format!(
                    "Poor word-recognition score ({}%) left ear - retrocochlear screen indicated.",
                    wr
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Tympanometry / middle-ear effusion ──────────────────────────
    match data.tympanometry_acoustic_reflexes.right_tympanogram.as_str() {
        "B" => flags.push(AdditionalFlag {
            id: "FLAG-TYMP-R-001".to_string(),
            category: "Tympanometry".to_string(),
            message: "Type B tympanogram right ear - middle-ear effusion or perforation; ENT review.".to_string(),
            priority: "medium".to_string(),
        }),
        "C" => flags.push(AdditionalFlag {
            id: "FLAG-TYMP-R-002".to_string(),
            category: "Tympanometry".to_string(),
            message: "Type C tympanogram right ear - Eustachian-tube dysfunction.".to_string(),
            priority: "low".to_string(),
        }),
        _ => {}
    }
    match data.tympanometry_acoustic_reflexes.left_tympanogram.as_str() {
        "B" => flags.push(AdditionalFlag {
            id: "FLAG-TYMP-L-001".to_string(),
            category: "Tympanometry".to_string(),
            message: "Type B tympanogram left ear - middle-ear effusion or perforation; ENT review.".to_string(),
            priority: "medium".to_string(),
        }),
        "C" => flags.push(AdditionalFlag {
            id: "FLAG-TYMP-L-002".to_string(),
            category: "Tympanometry".to_string(),
            message: "Type C tympanogram left ear - Eustachian-tube dysfunction.".to_string(),
            priority: "low".to_string(),
        }),
        _ => {}
    }

    // ─── Otoscopic red flags ─────────────────────────────────────────
    if data.otoscopic_examination.right_ear.tympanic_membrane == "perforation" {
        flags.push(AdditionalFlag {
            id: "FLAG-OTO-R-001".to_string(),
            category: "Otoscopic".to_string(),
            message: "Right TM perforation - ENT review.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.otoscopic_examination.right_ear.canal_status == "otorrhea" {
        flags.push(AdditionalFlag {
            id: "FLAG-OTO-R-002".to_string(),
            category: "Otoscopic".to_string(),
            message: "Right ear discharge - infection screen and ENT review.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.otoscopic_examination.left_ear.tympanic_membrane == "perforation" {
        flags.push(AdditionalFlag {
            id: "FLAG-OTO-L-001".to_string(),
            category: "Otoscopic".to_string(),
            message: "Left TM perforation - ENT review.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.otoscopic_examination.left_ear.canal_status == "otorrhea" {
        flags.push(AdditionalFlag {
            id: "FLAG-OTO-L-002".to_string(),
            category: "Otoscopic".to_string(),
            message: "Left ear discharge - infection screen and ENT review.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Vestibular findings ─────────────────────────────────────────
    let dh = data.vestibular_screening.dix_hallpike.as_str();
    if dh == "positive-right" || dh == "positive-left" || dh == "bilateral" {
        flags.push(AdditionalFlag {
            id: "FLAG-VEST-001".to_string(),
            category: "Vestibular".to_string(),
            message: "Positive Dix-Hallpike - posterior canal BPPV; particle-repositioning manoeuvre indicated.".to_string(),
            priority: "medium".to_string(),
        });
    }

    let hit = data.vestibular_screening.head_impulse_test.as_str();
    if hit == "abnormal-right" || hit == "abnormal-left" {
        flags.push(AdditionalFlag {
            id: "FLAG-VEST-002".to_string(),
            category: "Vestibular".to_string(),
            message: "Abnormal head-impulse test - peripheral vestibular hypofunction; vestibular rehabilitation indicated.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.vestibular_screening.romberg_test == "abnormal" {
        flags.push(AdditionalFlag {
            id: "FLAG-VEST-003".to_string(),
            category: "Vestibular".to_string(),
            message: "Abnormal Romberg - imbalance and falls risk; review safety.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── DHI severity ────────────────────────────────────────────────
    match result.dhi_handicap_level.as_str() {
        "severe" => flags.push(AdditionalFlag {
            id: "FLAG-DHI-001".to_string(),
            category: "DHI".to_string(),
            message: format!(
                "DHI {}/100 - severe perceived handicap; vestibular rehabilitation strongly indicated.",
                result.dhi_total
            ),
            priority: "high".to_string(),
        }),
        "moderate" => flags.push(AdditionalFlag {
            id: "FLAG-DHI-002".to_string(),
            category: "DHI".to_string(),
            message: format!(
                "DHI {}/100 - moderate perceived handicap; consider vestibular rehabilitation.",
                result.dhi_total
            ),
            priority: "medium".to_string(),
        }),
        _ => {}
    }

    // ─── Falls risk ──────────────────────────────────────────────────
    if data.presenting_symptoms.falls == "yes" {
        if let Some(count) = data.presenting_symptoms.falls_last_year_count {
            if count >= 2 {
                flags.push(AdditionalFlag {
                    id: "FLAG-FALL-001".to_string(),
                    category: "Falls".to_string(),
                    message: format!(
                        "{} falls in the last year - multifactorial falls assessment indicated.",
                        count
                    ),
                    priority: "high".to_string(),
                });
            } else {
                flags.push(AdditionalFlag {
                    id: "FLAG-FALL-002".to_string(),
                    category: "Falls".to_string(),
                    message: "History of falls - safety review.".to_string(),
                    priority: "medium".to_string(),
                });
            }
        } else {
            flags.push(AdditionalFlag {
                id: "FLAG-FALL-002".to_string(),
                category: "Falls".to_string(),
                message: "History of falls - safety review.".to_string(),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Fluctuating hearing loss + vertigo (Meniere screen) ─────────
    if data.presenting_symptoms.hearing_loss_onset == "fluctuating"
        && data.presenting_symptoms.vertigo == "yes"
        && data.presenting_symptoms.tinnitus == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MEN-001".to_string(),
            category: "Differential".to_string(),
            message: "Fluctuating hearing loss + episodic vertigo + tinnitus - consider Meniere disease.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Bothersome tinnitus ─────────────────────────────────────────
    if data.presenting_symptoms.tinnitus == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TINN-001".to_string(),
            category: "Tinnitus".to_string(),
            message: "Tinnitus reported - consider tinnitus management programme.".to_string(),
            priority: "low".to_string(),
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
