use super::types::{AdditionalFlag, AssessmentData};

/// Detect endometriosis safety flags — verbatim port of `flagged-issues.js`.
/// Flags are sorted high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Bowel obstruction (HIGH) ───────────────────────────────
    if data.gastrointestinal_symptoms.bowel_obstruction_symptoms == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BOWEL-001".to_string(),
            category: "Gastrointestinal".to_string(),
            message: "Bowel obstruction symptoms reported - URGENT SURGICAL REVIEW REQUIRED"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Urinary obstruction (HIGH) ─────────────────────────────
    if data.urinary_symptoms.urinary_obstruction_symptoms == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-URIN-001".to_string(),
            category: "Urinary".to_string(),
            message: "Urinary obstruction symptoms reported - URGENT UROLOGY/GYNAE REVIEW"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Severe pelvic pain (HIGH) ──────────────────────────────
    if data.pain_assessment.has_pelvic_pain == "yes"
        && data
            .pain_assessment
            .pelvic_pain_severity
            .map(|n| n >= 8)
            .unwrap_or(false)
    {
        let sev = data.pain_assessment.pelvic_pain_severity.unwrap_or(0);
        flags.push(AdditionalFlag {
            id: "FLAG-PAIN-001".to_string(),
            category: "Pain".to_string(),
            message: format!(
                "Severe pelvic pain (VAS {sev}/10) - pain management review recommended"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Constant pain (HIGH) ───────────────────────────────────
    if data.pain_assessment.has_pelvic_pain == "yes"
        && data.pain_assessment.pelvic_pain_timing == "constant"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-PAIN-002".to_string(),
            category: "Pain".to_string(),
            message: "Constant (non-cyclical) pelvic pain - consider chronic pain management"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Infertility (HIGH) ─────────────────────────────────────
    if data.fertility_assessment.trying_to_conceive == "yes"
        && data
            .fertility_assessment
            .duration_trying_months
            .map(|n| n > 12)
            .unwrap_or(false)
    {
        let months = data.fertility_assessment.duration_trying_months.unwrap_or(0);
        flags.push(AdditionalFlag {
            id: "FLAG-FERT-001".to_string(),
            category: "Fertility".to_string(),
            message: format!(
                "Infertility ({months} months) - fertility clinic referral recommended"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Low AMH (HIGH) ─────────────────────────────────────────
    if data
        .fertility_assessment
        .amh_level
        .map(|n| n < 5.4)
        .unwrap_or(false)
    {
        let amh = data.fertility_assessment.amh_level.unwrap_or(0.0);
        flags.push(AdditionalFlag {
            id: "FLAG-FERT-002".to_string(),
            category: "Fertility".to_string(),
            message: format!("Low AMH ({amh} pmol/L) - diminished ovarian reserve"),
            priority: "high".to_string(),
        });
    }

    // ─── Current opioid use (HIGH) ──────────────────────────────
    if data.previous_treatments.opioids_current == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TX-001".to_string(),
            category: "Treatment".to_string(),
            message:
                "Current opioid use for endometriosis pain - opioid review recommended"
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Unable to work (HIGH) ──────────────────────────────────
    if data.quality_of_life.work_impact == "unable-to-work" {
        flags.push(AdditionalFlag {
            id: "FLAG-QOL-001".to_string(),
            category: "Quality of Life".to_string(),
            message: "Patient unable to work due to endometriosis - MDT review recommended"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Cyclical rectal bleeding (MEDIUM) ──────────────────────
    if data.gastrointestinal_symptoms.rectal_bleeding == "yes"
        && data.gastrointestinal_symptoms.rectal_bleeding_cyclical == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-BOWEL-002".to_string(),
            category: "Gastrointestinal".to_string(),
            message:
                "Cyclical rectal bleeding - bowel endometriosis suspected, consider MRI"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Cyclical haematuria (MEDIUM) ───────────────────────────
    if data.urinary_symptoms.haematuria == "yes"
        && data.urinary_symptoms.haematuria_cyclical == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-URIN-002".to_string(),
            category: "Urinary".to_string(),
            message:
                "Cyclical haematuria - bladder endometriosis suspected, consider cystoscopy"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Deep dyspareunia (MEDIUM) ──────────────────────────────
    if data.pain_assessment.dyspareunia == "deep" || data.pain_assessment.dyspareunia == "both" {
        flags.push(AdditionalFlag {
            id: "FLAG-PAIN-003".to_string(),
            category: "Pain".to_string(),
            message: "Deep dyspareunia reported - consider pouch of Douglas / uterosacral ligament involvement".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Ectopic pregnancy history (MEDIUM) ─────────────────────
    if data
        .fertility_assessment
        .ectopic_pregnancies
        .map(|n| n > 0)
        .unwrap_or(false)
    {
        let n = data.fertility_assessment.ectopic_pregnancies.unwrap_or(0);
        flags.push(AdditionalFlag {
            id: "FLAG-FERT-003".to_string(),
            category: "Fertility".to_string(),
            message: format!("History of ectopic pregnancy ({n}) - tubal assessment recommended"),
            priority: "medium".to_string(),
        });
    }

    // ─── Previous bowel surgery (MEDIUM) ────────────────────────
    if data.surgical_history.bowel_surgery == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SURG-001".to_string(),
            category: "Surgical".to_string(),
            message: "Previous bowel surgery for endometriosis - colorectal MDT if repeat surgery planned".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Multiple laparoscopies (MEDIUM) ────────────────────────
    if data
        .surgical_history
        .number_of_laparoscopies
        .map(|n| n >= 3)
        .unwrap_or(false)
    {
        let n = data.surgical_history.number_of_laparoscopies.unwrap_or(0);
        flags.push(AdditionalFlag {
            id: "FLAG-SURG-002".to_string(),
            category: "Surgical".to_string(),
            message: format!(
                "Multiple previous laparoscopies ({n}) - consider tertiary referral"
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Severe mental health impact (MEDIUM) ───────────────────
    if data.quality_of_life.mental_health_impact == "severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-QOL-002".to_string(),
            category: "Quality of Life".to_string(),
            message:
                "Severe mental health impact - psychology/counselling referral recommended"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
