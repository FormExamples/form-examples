use vaccinations_checklist_tera_crate::engine::types::*;
use vaccinations_checklist_tera_crate::engine::vaccination_grader::{grade, run_rules};
use vaccinations_checklist_tera_crate::engine::vaccination_rules::all_rules;

/// A baseline fully-compliant healthcare worker case.
fn fully_compliant_healthcare_worker() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1985-03-12".to_string(),
            sex: "female".to_string(),
            weight: Some(70.0),
            height: Some(170.0),
            bmi: Some(24.2),
            occupation: "Nurse".to_string(),
            occupation_category: "healthcare".to_string(),
            employer: "NHS Trust".to_string(),
        },
        childhood_immunisations: ChildhoodImmunisations {
            mmr_dose1: "yes".to_string(),
            mmr_dose2: "yes".to_string(),
            dtp_primary_course: "yes".to_string(),
            dtp_booster: "yes".to_string(),
            polio_primary_course: "yes".to_string(),
            polio_booster: "yes".to_string(),
            ..ChildhoodImmunisations::default()
        },
        occupational_vaccines: OccupationalVaccines {
            hepatitis_b_course: "yes".to_string(),
            hepatitis_b_anti_body_level: "adequate".to_string(),
            varicella_vaccine: "yes".to_string(),
            varicella_history: "yes".to_string(),
            bcg_vaccine: "yes".to_string(),
            ..OccupationalVaccines::default()
        },
        covid19_vaccination: Covid19Vaccination {
            covid_primary_course: "yes".to_string(),
            covid_booster1: "yes".to_string(),
            ..Covid19Vaccination::default()
        },
        influenza_vaccination: InfluenzaVaccination {
            flu_vaccine_current_season: "yes".to_string(),
            ..InfluenzaVaccination::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_is_not_fully_immunised() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_ne!(result.compliance_status, "fully-immunised");
}

#[test]
fn fully_compliant_healthcare_worker_is_fully_immunised() {
    let data = fully_compliant_healthcare_worker();
    let result = grade(&data);
    assert_eq!(result.compliance_status, "fully-immunised");
    assert_eq!(result.overall_risk, "low");
    assert!(result.childhood_complete);
    assert!(result.occupational_complete);
    assert!(result.covid_complete);
    assert!(result.flu_current);
}

#[test]
fn anaphylaxis_history_fires_ctx_002_critical() {
    let mut data = fully_compliant_healthcare_worker();
    data.vaccination_history.adverse_reaction_severity = "anaphylaxis".to_string();
    let fired = run_rules(&data);
    let ctx002 = fired.iter().find(|r| r.id == "CTX-002").expect("CTX-002 should fire");
    assert_eq!(ctx002.grade, 4);
}

#[test]
fn healthcare_worker_missing_hep_b_is_non_compliant_high_risk() {
    let mut data = fully_compliant_healthcare_worker();
    data.occupational_vaccines.hepatitis_b_course = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.compliance_status, "non-compliant");
    assert_eq!(result.overall_risk, "high");
    assert!(result.fired_rules.iter().any(|r| r.id == "OCC-001"));
}

#[test]
fn active_exposure_incident_yields_critical_risk() {
    let mut data = fully_compliant_healthcare_worker();
    data.schedule_compliance.active_exposure_incident = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.overall_risk, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "CMP-001"));
}

#[test]
fn live_vaccine_contraindicated_is_contraindicated() {
    let mut data = fully_compliant_healthcare_worker();
    data.contraindications_allergies.live_vaccine_contraindicated = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.compliance_status, "contraindicated");
}

#[test]
fn travel_planned_without_yellow_fever_fires_trv_001() {
    let mut data = fully_compliant_healthcare_worker();
    data.travel_vaccines.travel_planned = "yes".to_string();
    data.travel_vaccines.yellow_fever_vaccine = "no".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "TRV-001"));
}

#[test]
fn measles_igg_negative_fires_ser_001() {
    let mut data = fully_compliant_healthcare_worker();
    data.serology_immunity_testing.measles_ig_g = "negative".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "SER-001"));
}

#[test]
fn missing_childhood_mmr_appears_in_missing_vaccinations() {
    let mut data = fully_compliant_healthcare_worker();
    data.childhood_immunisations.mmr_dose1 = "no".to_string();
    let result = grade(&data);
    assert!(result
        .missing_vaccinations
        .iter()
        .any(|v| v == "MMR dose 1"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}
