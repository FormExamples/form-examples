use super::types::AssessmentData;

/// A declarative vaccination rule. Grade values: 1 = low, 2 = moderate,
/// 3 = significant, 4 = critical. Ported 1:1 from `vaccination-rules.js`.
pub struct VaccinationRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: u32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All Vaccinations Checklist rules. IDs match the JS engine verbatim so
/// front-end and back-end report the same rule codes.
pub fn all_rules() -> Vec<VaccinationRule> {
    vec![
        // ─── CHILDHOOD IMMUNISATIONS ──────────────────────────────
        VaccinationRule {
            id: "CH-001",
            category: "Childhood",
            description: "MMR dose 1 not received or unknown",
            grade: 3,
            evaluate: |d| {
                d.childhood_immunisations.mmr_dose1 == "no"
                    || d.childhood_immunisations.mmr_dose1 == "unknown"
            },
        },
        VaccinationRule {
            id: "CH-002",
            category: "Childhood",
            description: "MMR dose 2 not received or unknown",
            grade: 2,
            evaluate: |d| {
                d.childhood_immunisations.mmr_dose2 == "no"
                    || d.childhood_immunisations.mmr_dose2 == "unknown"
            },
        },
        VaccinationRule {
            id: "CH-003",
            category: "Childhood",
            description: "DTP primary course incomplete or unknown",
            grade: 3,
            evaluate: |d| {
                d.childhood_immunisations.dtp_primary_course == "no"
                    || d.childhood_immunisations.dtp_primary_course == "unknown"
            },
        },
        VaccinationRule {
            id: "CH-004",
            category: "Childhood",
            description: "DTP booster not received or unknown",
            grade: 2,
            evaluate: |d| {
                d.childhood_immunisations.dtp_booster == "no"
                    || d.childhood_immunisations.dtp_booster == "unknown"
            },
        },
        VaccinationRule {
            id: "CH-005",
            category: "Childhood",
            description: "Polio primary course incomplete or unknown",
            grade: 3,
            evaluate: |d| {
                d.childhood_immunisations.polio_primary_course == "no"
                    || d.childhood_immunisations.polio_primary_course == "unknown"
            },
        },
        VaccinationRule {
            id: "CH-006",
            category: "Childhood",
            description: "Polio booster not received or unknown",
            grade: 2,
            evaluate: |d| {
                d.childhood_immunisations.polio_booster == "no"
                    || d.childhood_immunisations.polio_booster == "unknown"
            },
        },
        // ─── OCCUPATIONAL VACCINES ────────────────────────────────
        VaccinationRule {
            id: "OCC-001",
            category: "Occupational",
            description: "Hepatitis B course incomplete in healthcare worker",
            grade: 4,
            evaluate: |d| {
                d.demographics.occupation_category == "healthcare"
                    && (d.occupational_vaccines.hepatitis_b_course == "no"
                        || d.occupational_vaccines.hepatitis_b_course == "unknown")
            },
        },
        VaccinationRule {
            id: "OCC-002",
            category: "Occupational",
            description: "Hepatitis B antibody level inadequate",
            grade: 3,
            evaluate: |d| d.occupational_vaccines.hepatitis_b_anti_body_level == "inadequate",
        },
        VaccinationRule {
            id: "OCC-003",
            category: "Occupational",
            description: "Varicella non-immune healthcare worker",
            grade: 3,
            evaluate: |d| {
                d.demographics.occupation_category == "healthcare"
                    && d.occupational_vaccines.varicella_vaccine != "yes"
                    && d.occupational_vaccines.varicella_history != "yes"
            },
        },
        VaccinationRule {
            id: "OCC-004",
            category: "Occupational",
            description: "BCG not received in high-risk occupational role",
            grade: 2,
            evaluate: |d| {
                (d.demographics.occupation_category == "healthcare"
                    || d.demographics.occupation_category == "social-care")
                    && (d.occupational_vaccines.bcg_vaccine == "no"
                        || d.occupational_vaccines.bcg_vaccine == "unknown")
            },
        },
        // ─── COVID-19 ─────────────────────────────────────────────
        VaccinationRule {
            id: "COV-001",
            category: "COVID-19",
            description: "COVID-19 primary course incomplete",
            grade: 3,
            evaluate: |d| {
                d.covid19_vaccination.covid_primary_course == "no"
                    || d.covid19_vaccination.covid_primary_course == "unknown"
            },
        },
        VaccinationRule {
            id: "COV-002",
            category: "COVID-19",
            description: "COVID-19 primary course incomplete in healthcare worker",
            grade: 4,
            evaluate: |d| {
                d.demographics.occupation_category == "healthcare"
                    && (d.covid19_vaccination.covid_primary_course == "no"
                        || d.covid19_vaccination.covid_primary_course == "unknown")
            },
        },
        VaccinationRule {
            id: "COV-003",
            category: "COVID-19",
            description: "No COVID-19 booster received",
            grade: 2,
            evaluate: |d| {
                d.covid19_vaccination.covid_primary_course == "yes"
                    && d.covid19_vaccination.covid_booster1 == "no"
            },
        },
        // ─── INFLUENZA ────────────────────────────────────────────
        VaccinationRule {
            id: "FLU-001",
            category: "Influenza",
            description: "Current season flu vaccine not received",
            grade: 2,
            evaluate: |d| d.influenza_vaccination.flu_vaccine_current_season == "no",
        },
        VaccinationRule {
            id: "FLU-002",
            category: "Influenza",
            description: "High-risk patient without current flu vaccine",
            grade: 3,
            evaluate: |d| {
                d.influenza_vaccination.flu_high_risk_group == "yes"
                    && d.influenza_vaccination.flu_vaccine_current_season == "no"
            },
        },
        VaccinationRule {
            id: "FLU-003",
            category: "Influenza",
            description: "Healthcare worker without current flu vaccine",
            grade: 3,
            evaluate: |d| {
                d.demographics.occupation_category == "healthcare"
                    && d.influenza_vaccination.flu_vaccine_current_season == "no"
            },
        },
        // ─── TRAVEL ───────────────────────────────────────────────
        VaccinationRule {
            id: "TRV-001",
            category: "Travel",
            description: "Travel planned without yellow fever vaccination (if applicable)",
            grade: 3,
            evaluate: |d| {
                d.travel_vaccines.travel_planned == "yes"
                    && d.travel_vaccines.yellow_fever_vaccine == "no"
            },
        },
        // ─── CONTRAINDICATIONS ────────────────────────────────────
        VaccinationRule {
            id: "CTX-001",
            category: "Contraindications",
            description: "Immunocompromised - live vaccines may be contraindicated",
            grade: 3,
            evaluate: |d| d.vaccination_history.immunocompromised == "yes",
        },
        VaccinationRule {
            id: "CTX-002",
            category: "Contraindications",
            description: "Previous anaphylaxis to a vaccine",
            grade: 4,
            evaluate: |d| d.vaccination_history.adverse_reaction_severity == "anaphylaxis",
        },
        VaccinationRule {
            id: "CTX-003",
            category: "Contraindications",
            description: "Pregnant or planning pregnancy - live vaccines contraindicated",
            grade: 3,
            evaluate: |d| d.vaccination_history.pregnant_or_planning == "yes",
        },
        // ─── SEROLOGY ─────────────────────────────────────────────
        VaccinationRule {
            id: "SER-001",
            category: "Serology",
            description: "Measles IgG negative - not immune",
            grade: 3,
            evaluate: |d| d.serology_immunity_testing.measles_ig_g == "negative",
        },
        VaccinationRule {
            id: "SER-002",
            category: "Serology",
            description: "Rubella IgG negative - not immune",
            grade: 2,
            evaluate: |d| d.serology_immunity_testing.rubella_ig_g == "negative",
        },
        VaccinationRule {
            id: "SER-003",
            category: "Serology",
            description: "Varicella IgG negative - not immune",
            grade: 3,
            evaluate: |d| d.serology_immunity_testing.varicella_ig_g == "negative",
        },
        VaccinationRule {
            id: "SER-004",
            category: "Serology",
            description: "Hepatitis B surface antibody negative",
            grade: 3,
            evaluate: |d| d.serology_immunity_testing.hep_b_surface_antibody == "negative",
        },
        VaccinationRule {
            id: "SER-005",
            category: "Serology",
            description: "TB IGRA positive - latent TB investigation needed",
            grade: 3,
            evaluate: |d| d.serology_immunity_testing.tb_igra_result == "positive",
        },
        // ─── COMPLIANCE ───────────────────────────────────────────
        VaccinationRule {
            id: "CMP-001",
            category: "Compliance",
            description: "Active exposure incident without documented immunity",
            grade: 4,
            evaluate: |d| d.schedule_compliance.active_exposure_incident == "yes",
        },
        VaccinationRule {
            id: "CMP-002",
            category: "Compliance",
            description: "Occupational health clearance pending",
            grade: 2,
            evaluate: |d| d.schedule_compliance.occupational_health_clearance == "pending",
        },
        VaccinationRule {
            id: "CMP-003",
            category: "Compliance",
            description: "Occupational health clearance not granted",
            grade: 3,
            evaluate: |d| d.schedule_compliance.occupational_health_clearance == "no",
        },
    ]
}
