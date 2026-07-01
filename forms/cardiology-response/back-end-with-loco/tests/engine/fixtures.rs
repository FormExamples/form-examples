//! Shared response fixtures ported from
//! `front-end-with-svelte/src/lib/engine/grader.test.ts`.

use cardiology_response_loco_crate::engine::types::CardiologyResponse;

/// A fully-completed, reassuring (no-abnormality) response fixture.
pub fn create_no_abnormality_response() -> CardiologyResponse {
    CardiologyResponse {
        responding_clinician: "Dr A Cardiologist".to_string(),
        originating_request_reference: "REQ-2001".to_string(),
        response_status: "final".to_string(),
        consultation_type: "clinic-review".to_string(),
        assessed_date: "2026-06-01".to_string(),
        responded_date: "2026-06-01".to_string(),
        patient_name: String::new(),
        patient_nhs_number: String::new(),
        patient_birth_date: String::new(),
        clinical_summary:
            "Reviewed in clinic with atypical chest pain. History and examination reassuring."
                .to_string(),
        examination_findings:
            "Normal cardiovascular examination. No murmurs. Normal heart sounds.".to_string(),
        investigations_performed:
            "Resting ECG normal. Exercise tolerance test negative for ischaemia.".to_string(),
        ischaemia_or_cad: false,
        significant_arrhythmia: false,
        reduced_ejection_fraction: false,
        significant_valve_disease: false,
        structural_abnormality: false,
        uncontrolled_hypertension: false,
        non_cardiac_cause: true,
        primary_diagnosis_category: "non-cardiac".to_string(),
        diagnosis_narrative: "Non-cardiac chest pain; most likely musculoskeletal.".to_string(),
        lv_ejection_fraction_percent: Some(60.0),
        management_plan: "Reassurance. No cardiac intervention required.".to_string(),
        medication_changes: "No changes.".to_string(),
        recommended_follow_up: "Discharge back to GP. No cardiology follow-up required."
            .to_string(),
        critical_result: false,
        critical_result_communicated: false,
        reported_to: String::new(),
        clinician_notes: String::new(),
        signed: true,
    }
}

/// A cardiac-condition HFrEF response fixture: reduced ejection fraction.
pub fn create_hfref_response() -> CardiologyResponse {
    CardiologyResponse {
        clinical_summary: "Breathlessness and ankle oedema. Echocardiogram performed.".to_string(),
        examination_findings: "Raised JVP, bibasal crepitations, mild peripheral oedema."
            .to_string(),
        investigations_performed:
            "Echocardiogram: dilated left ventricle, LVEF 32 %. ECG sinus rhythm.".to_string(),
        ischaemia_or_cad: false,
        reduced_ejection_fraction: true,
        non_cardiac_cause: false,
        primary_diagnosis_category: "heart-failure".to_string(),
        diagnosis_narrative: "Heart failure with reduced ejection fraction (HFrEF).".to_string(),
        lv_ejection_fraction_percent: Some(32.0),
        management_plan: "Start guideline-directed medical therapy and optimise.".to_string(),
        medication_changes: "Started ACE inhibitor and beta-blocker.".to_string(),
        recommended_follow_up: "Heart-failure nurse-led clinic in 4 weeks.".to_string(),
        critical_result: false,
        ..create_no_abnormality_response()
    }
}

/// A critical response fixture: severe symptomatic aortic stenosis.
pub fn create_critical_response() -> CardiologyResponse {
    CardiologyResponse {
        consultation_type: "inpatient-review".to_string(),
        clinical_summary: "Exertional syncope and breathlessness; urgent echocardiogram performed."
            .to_string(),
        examination_findings:
            "Slow-rising pulse, ejection systolic murmur radiating to the carotids.".to_string(),
        investigations_performed:
            "Echocardiogram: severe aortic stenosis, peak velocity 4.6 m/s, valve area 0.7 cm²."
                .to_string(),
        significant_valve_disease: true,
        non_cardiac_cause: false,
        primary_diagnosis_category: "valve-disease".to_string(),
        diagnosis_narrative: "Severe symptomatic aortic stenosis.".to_string(),
        lv_ejection_fraction_percent: Some(55.0),
        management_plan:
            "Urgent referral to the structural heart team for aortic valve intervention."
                .to_string(),
        medication_changes: "Avoid vasodilators.".to_string(),
        recommended_follow_up: "Urgent Heart Team review.".to_string(),
        critical_result: true,
        critical_result_communicated: false,
        reported_to: String::new(),
        ..create_no_abnormality_response()
    }
}
