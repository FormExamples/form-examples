use blood_donation_assessment_loco_crate::engine::donor_grader::{grade, run_rules};
use blood_donation_assessment_loco_crate::engine::dsg_rules::all_rules;
use blood_donation_assessment_loco_crate::engine::types::*;

/// Build an "all clear" donor assessment that should grade as `eligible`.
/// The donor is a regular 35-year-old male, normal vitals, no risk
/// factors, and full informed consent.
fn eligible_donor() -> AssessmentData {
    AssessmentData {
        donor_demographics: DonorDemographics {
            first_name: "Alex".to_string(),
            last_name: "Donor".to_string(),
            date_of_birth: "1990-05-12".to_string(),
            sex: "male".to_string(),
            weight: Some(80.0),
            height: Some(178.0),
            donor_type: "regular".to_string(),
            last_donation_date: String::new(),
        },
        general_health: GeneralHealth {
            feeling_well_today: "yes".to_string(),
            adequate_sleep: "yes".to_string(),
            adequate_meal_and_fluids: "yes".to_string(),
            feeling_faint_or_unwell: "no".to_string(),
        },
        medical_history: MedicalHistory {
            heart_or_circulatory_disease: "no".to_string(),
            cancer: "no".to_string(),
            bleeding_or_clotting_disorder: "no".to_string(),
            diabetes_on_insulin: "no".to_string(),
            epilepsy_or_seizures: "no".to_string(),
            hiv_positive: "no".to_string(),
            hepatitis_b_or_c: "no".to_string(),
            htlv: "no".to_string(),
            cjd_family_history: "no".to_string(),
            received_pituitary_hormone: "no".to_string(),
            received_dura_mater_graft: "no".to_string(),
            current_medications: Vec::new(),
        },
        recent_illness: RecentIllness {
            fever_past_two_weeks: "no".to_string(),
            infection_past_two_weeks: "no".to_string(),
            antibiotics_past_seven_days: "no".to_string(),
            dental_work_past_week: "no".to_string(),
            surgery_past_six_months: "no".to_string(),
            covid_positive_past_twenty_eight_days: "no".to_string(),
            vaccination_past_four_weeks: "no".to_string(),
            vaccination_details: String::new(),
        },
        travel_history: TravelHistory {
            recent_travel: Vec::new(),
            malaria_area_past_twelve_months: "no".to_string(),
            west_nile_virus_area_past_twenty_eight_days: "no".to_string(),
            uk_residence_1980_to_1996_over_12_months: "no".to_string(),
            blood_transfusion_in_uk: "no".to_string(),
        },
        lifestyle_risk: LifestyleRisk {
            iv_drug_use_ever: "no".to_string(),
            sex_with_iv_drug_user: "no".to_string(),
            sex_in_exchange_past_twelve_months: "no".to_string(),
            sex_with_new_partner_past_three_months: "no".to_string(),
            multiple_sexual_partners_past_three_months: "no".to_string(),
            tattoo_or_piercing_past_four_months: "no".to_string(),
            acupuncture_past_four_months: "no".to_string(),
            body_or_ear_piercing_past_four_months: "no".to_string(),
            incarcerated_past_twelve_months: "no".to_string(),
        },
        pregnancy_transfusion: PregnancyTransfusion {
            currently_pregnant: "no".to_string(),
            pregnancy_past_six_months: "no".to_string(),
            breastfeeding: "no".to_string(),
            received_transfusion_ever: "no".to_string(),
            last_transfusion_date: String::new(),
            received_transplant_ever: "no".to_string(),
        },
        vital_signs: VitalSigns {
            hemoglobin: Some(14.5),
            systolic_bp: Some(120),
            diastolic_bp: Some(75),
            pulse_bpm: Some(70),
            temperature_celsius: Some(36.6),
        },
        informed_consent: InformedConsent {
            understood_information: "yes".to_string(),
            consent_to_donate: "yes".to_string(),
            consent_to_testing: "yes".to_string(),
            consent_to_contact: "yes".to_string(),
        },
        donation_plan: DonationPlan {
            planned_donation_type: "whole-blood".to_string(),
            preferred_donation_date: "2026-06-15".to_string(),
            session: "Morning".to_string(),
            notes: String::new(),
        },
    }
}

#[test]
fn empty_assessment_is_eligible_with_no_fired_rules() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.eligibility_status, "eligible");
    assert_eq!(result.deferral_window, "");
    assert!(result.fired_rules.is_empty());
}

#[test]
fn happy_path_donor_is_eligible() {
    let data = eligible_donor();
    let result = grade(&data);
    assert_eq!(
        result.eligibility_status, "eligible",
        "fired rules: {:?}",
        result.fired_rules
    );
    assert!(result.fired_rules.is_empty());
}

#[test]
fn hiv_positive_is_permanent_deferral() {
    let mut data = eligible_donor();
    data.medical_history.hiv_positive = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.eligibility_status, "permanently-deferred");
    assert!(result.fired_rules.iter().any(|r| r.id == "DSG-MED-001"));
}

#[test]
fn underweight_donor_is_temporarily_deferred() {
    let mut data = eligible_donor();
    data.donor_demographics.weight = Some(45.0);
    let result = grade(&data);
    assert_eq!(result.eligibility_status, "temporarily-deferred");
    assert!(result.fired_rules.iter().any(|r| r.id == "DSG-WEIGHT-001"));
}

#[test]
fn permanent_outranks_temporary() {
    let mut data = eligible_donor();
    // Temporary trigger
    data.donor_demographics.weight = Some(45.0);
    // Permanent trigger
    data.medical_history.htlv = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.eligibility_status, "permanently-deferred");
    assert_eq!(result.deferral_window, "");
}

#[test]
fn fever_yields_temporary_deferral_with_window() {
    let mut data = eligible_donor();
    data.recent_illness.fever_past_two_weeks = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.eligibility_status, "temporarily-deferred");
    assert!(!result.deferral_window.is_empty());
}

#[test]
fn refusal_of_infection_testing_is_permanent_deferral() {
    let mut data = eligible_donor();
    data.informed_consent.consent_to_testing = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.eligibility_status, "permanently-deferred");
    assert!(result.fired_rules.iter().any(|r| r.id == "DSG-CONS-003"));
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

#[test]
fn run_rules_returns_fired_rule_per_trigger() {
    let mut data = eligible_donor();
    data.medical_history.cancer = "yes".to_string();
    data.medical_history.bleeding_or_clotting_disorder = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "DSG-MED-010"));
    assert!(fired.iter().any(|r| r.id == "DSG-MED-007"));
}
