use super::types::{AdditionalFlag, AssessmentData};

/// Detect Vaccinations Checklist safety flags. Ported 1:1 from
/// `flagged-issues.js`. Flag IDs match the JS engine verbatim.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Active exposure incident (HIGH) ────────────────────────
    if data.schedule_compliance.active_exposure_incident == "yes" {
        let details = if data.schedule_compliance.active_exposure_details.is_empty() {
            "details not specified".to_string()
        } else {
            data.schedule_compliance.active_exposure_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-EXPOSURE-001".to_string(),
            category: "Exposure".to_string(),
            message: format!("Active exposure incident: {details} - URGENT ACTION REQUIRED"),
            priority: "high".to_string(),
        });
    }

    // ─── Previous anaphylaxis to vaccine (HIGH) ─────────────────
    if data.vaccination_history.adverse_reaction_severity == "anaphylaxis" {
        let vaccine = if data.vaccination_history.adverse_reaction_vaccine.is_empty() {
            "vaccine not specified".to_string()
        } else {
            data.vaccination_history.adverse_reaction_vaccine.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ANAPH-001".to_string(),
            category: "Allergy".to_string(),
            message: format!("ANAPHYLAXIS history to vaccine: {vaccine}"),
            priority: "high".to_string(),
        });
    }

    // ─── Immunocompromised (HIGH) ───────────────────────────────
    if data.vaccination_history.immunocompromised == "yes" {
        let details = if data.vaccination_history.immunocompromised_details.is_empty() {
            "details not specified".to_string()
        } else {
            data.vaccination_history.immunocompromised_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-IMMUNO-001".to_string(),
            category: "Immunocompromised".to_string(),
            message: format!(
                "Immunocompromised: {details} - live vaccines may be contraindicated"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Pregnant or planning (HIGH) ────────────────────────────
    if data.vaccination_history.pregnant_or_planning == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREG-001".to_string(),
            category: "Pregnancy".to_string(),
            message: "Pregnant or planning pregnancy - live vaccines contraindicated, check individual vaccine guidance".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Egg allergy with anaphylaxis (HIGH) ────────────────────
    if data.contraindications_allergies.egg_allergy == "yes"
        && data.contraindications_allergies.egg_allergy_severity == "anaphylaxis"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-EGG-001".to_string(),
            category: "Allergy".to_string(),
            message: "Egg allergy with anaphylaxis - specialist advice required for egg-containing vaccines (flu, yellow fever)".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── PEG/polysorbate allergy (HIGH) ─────────────────────────
    if data.contraindications_allergies.peg_polysorbate_allergy == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PEG-001".to_string(),
            category: "Allergy".to_string(),
            message: "PEG/polysorbate allergy - mRNA COVID vaccines may be contraindicated"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── History of GBS (HIGH) ──────────────────────────────────
    if data.contraindications_allergies.history_of_gbs == "yes" {
        let details = if data.contraindications_allergies.gbs_details.is_empty() {
            "details not specified".to_string()
        } else {
            data.contraindications_allergies.gbs_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-GBS-001".to_string(),
            category: "Contraindication".to_string(),
            message: format!(
                "History of Guillain-Barre Syndrome: {details} - specialist review before vaccination"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── TB IGRA positive (HIGH) ────────────────────────────────
    if data.serology_immunity_testing.tb_igra_result == "positive" {
        flags.push(AdditionalFlag {
            id: "FLAG-TB-001".to_string(),
            category: "Serology".to_string(),
            message: "TB IGRA positive - latent TB investigation required, BCG contraindicated"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Hepatitis B non-immune healthcare worker (MEDIUM) ──────
    if data.demographics.occupation_category == "healthcare"
        && (data.occupational_vaccines.hepatitis_b_anti_body_level == "inadequate"
            || data.serology_immunity_testing.hep_b_surface_antibody == "negative")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-HEPB-001".to_string(),
            category: "Occupational".to_string(),
            message: "Healthcare worker with inadequate Hepatitis B immunity - occupational health review required".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Measles non-immune (MEDIUM) ────────────────────────────
    if data.serology_immunity_testing.measles_ig_g == "negative" {
        flags.push(AdditionalFlag {
            id: "FLAG-MEASLES-001".to_string(),
            category: "Serology".to_string(),
            message: "Measles IgG negative - not immune, MMR vaccination recommended".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Varicella non-immune (MEDIUM) ──────────────────────────
    if data.serology_immunity_testing.varicella_ig_g == "negative" {
        flags.push(AdditionalFlag {
            id: "FLAG-VZV-001".to_string(),
            category: "Serology".to_string(),
            message: "Varicella IgG negative - not immune, varicella vaccination recommended"
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── On immunosuppressants (MEDIUM) ─────────────────────────
    if data.contraindications_allergies.on_immunosuppressants == "yes" {
        let details = if data
            .contraindications_allergies
            .immunosuppressant_details
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.contraindications_allergies
                .immunosuppressant_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-IMMUNOSUPP-001".to_string(),
            category: "Medications".to_string(),
            message: format!(
                "On immunosuppressants: {details} - timing of vaccines may need adjustment"
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Recent blood products (MEDIUM) ─────────────────────────
    if data.contraindications_allergies.on_blood_products_recent == "yes" {
        let details = if data
            .contraindications_allergies
            .blood_products_details
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.contraindications_allergies
                .blood_products_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-BLOOD-001".to_string(),
            category: "Medications".to_string(),
            message: format!(
                "Recent blood products: {details} - live vaccines may need deferral"
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── COVID adverse reaction (MEDIUM) ────────────────────────
    if data.covid19_vaccination.covid_adverse_reaction == "yes" {
        let details = if data
            .covid19_vaccination
            .covid_adverse_reaction_details
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.covid19_vaccination
                .covid_adverse_reaction_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-COVIDADV-001".to_string(),
            category: "COVID-19".to_string(),
            message: format!("COVID-19 vaccine adverse reaction: {details}"),
            priority: "medium".to_string(),
        });
    }

    // ─── OH clearance not granted (MEDIUM) ──────────────────────
    if data.schedule_compliance.occupational_health_clearance == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-OH-001".to_string(),
            category: "Compliance".to_string(),
            message:
                "Occupational health clearance NOT granted - restricted duties may apply"
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
