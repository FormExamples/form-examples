use who_counter_referral_form_tera_crate::engine::counter_referral_grader::grade;
use who_counter_referral_form_tera_crate::engine::counter_referral_rules::counter_referral_rules;
use who_counter_referral_form_tera_crate::engine::counter_referral_validator::validate_counter_referral;
use who_counter_referral_form_tera_crate::engine::types::*;

fn fully_completed_case() -> AssessmentData {
    AssessmentData {
        patient_identification: PatientIdentification {
            patient_name: "Doe, Jane".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            patient_contact: "+44 7700 900123".to_string(),
            emergency_contact: EmergencyContact {
                name: "John Doe".to_string(),
                contact_information: "+44 7700 900124".to_string(),
            },
        },
        facility_details: FacilityDetails {
            initiating_facility: FacilityContact {
                name: "Riverside Clinic".to_string(),
                focal_point: "Dr A. Smith".to_string(),
                phone_number: "+44 20 7946 0001".to_string(),
            },
            referral_date: "2026-05-20".to_string(),
            referral_reason: "Acute abdominal pain.".to_string(),
            acuity: "acute".to_string(),
            referral_facility: FacilityContact {
                name: "St James's Hospital".to_string(),
                focal_point: "Dr B. Jones".to_string(),
                phone_number: "+44 20 7946 0002".to_string(),
            },
            communication: FacilityCommunication {
                discussed_with_primary_care_provider: true,
                discussed_with_initiating_facility: true,
            },
            primary_care_facility: FacilityContact {
                name: "Riverside Clinic".to_string(),
                focal_point: "Dr A. Smith".to_string(),
                phone_number: "+44 20 7946 0001".to_string(),
            },
            follow_up_timeframe: "2-to-6-days".to_string(),
        },
        situation: Situation {
            chief_complaint: "Right upper quadrant pain.".to_string(),
            primary_diagnosis: "Acute cholecystitis.".to_string(),
            pregnant: "no".to_string(),
            treatments_initiated: "Laparoscopic cholecystectomy performed.".to_string(),
            icu_stay: false,
            surgery: true,
            hospitalized: true,
        },
        background: Background {
            history_of_present_illness: "3-day history of RUQ pain after fatty meal.".to_string(),
            past_medical_history: "Hypertension, well-controlled.".to_string(),
            significant_events: "Routine recovery.".to_string(),
        },
        assessment: Assessment {
            final_diagnoses: "Acute cholecystitis, post laparoscopic cholecystectomy.".to_string(),
            prognosis_and_goals_of_care: "Full recovery expected.".to_string(),
            patient_family_informed: "yes".to_string(),
            informed_explanation: "Patient and spouse briefed in person before discharge.".to_string(),
        },
        recommendations: Recommendations {
            follow_up_plan: "Wound check at 1 week; remove sutures at 10 days.".to_string(),
            pending_investigations: String::new(),
            follow_up_arrangements: "GP appointment within 5 days at Riverside Clinic.".to_string(),
            deterioration_instructions:
                "If fever, jaundice, or worsening pain, attend A&E immediately."
                    .to_string(),
            contact_name: "Sister Jones".to_string(),
            contact_information: "ward12@stjames.example".to_string(),
            status_flags: StatusFlags::default(),
        },
        provider_sign_off: ProviderSignOff {
            provider_name: "Dr B. Jones".to_string(),
            signature: "B. Jones".to_string(),
            signature_date: "2026-05-25".to_string(),
        },
    }
}

#[test]
fn empty_form_is_not_started_and_incomplete() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.form_status, "not-started");
    assert_eq!(result.overall_percent, 0);
    assert!(!result.validation.complete);
    assert!(result.validation.missing.iter().any(|m| m.id == "PID-01"));
    // ASS-04 (informed explanation) must NOT fire on an empty form.
    assert!(!result.validation.missing.iter().any(|m| m.id == "ASS-04"));
}

#[test]
fn fully_completed_case_is_complete() {
    let data = fully_completed_case();
    let result = grade(&data);
    assert_eq!(result.form_status, "complete");
    assert_eq!(result.overall_percent, 100);
    assert!(result.validation.complete);
    assert!(result.validation.missing.is_empty());
}

#[test]
fn urgent_followup_timeframe_yields_complete_with_concerns() {
    let mut data = fully_completed_case();
    data.facility_details.follow_up_timeframe = "urgent-within-24-hours".to_string();
    let result = grade(&data);
    assert_eq!(result.form_status, "complete-with-concerns");
    assert!(
        result
            .flagged_issues
            .iter()
            .any(|f| f.id == "FLAG-FU-001" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn ass04_fires_only_when_patient_family_informed_yes() {
    // Patient/family informed = "no" — ASS-04 should NOT fire.
    let mut data = AssessmentData::default();
    data.assessment.patient_family_informed = "no".to_string();
    let r = validate_counter_referral(&data);
    assert!(!r.missing.iter().any(|m| m.id == "ASS-04"));

    // Switch to "yes" without an explanation: ASS-04 must fire.
    data.assessment.patient_family_informed = "yes".to_string();
    let r = validate_counter_referral(&data);
    assert!(r.missing.iter().any(|m| m.id == "ASS-04"));

    // Provide the explanation: ASS-04 must be satisfied.
    data.assessment.informed_explanation =
        "Discussed with patient and spouse.".to_string();
    let r = validate_counter_referral(&data);
    assert!(!r.missing.iter().any(|m| m.id == "ASS-04"));
}

#[test]
fn fac11_not_satisfied_when_timeframe_blank() {
    let data = AssessmentData::default();
    let r = validate_counter_referral(&data);
    assert!(r.missing.iter().any(|m| m.id == "FAC-11"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = counter_referral_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}
