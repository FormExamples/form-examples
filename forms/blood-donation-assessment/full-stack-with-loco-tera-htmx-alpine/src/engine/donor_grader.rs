use super::dsg_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, EligibilityStatus, FiredRule, GradingResult};

/// Pure function: grades a Blood Donation Assessment against the JPAC
/// Donor Selection Guidelines.
///
/// Status hierarchy (most severe wins):
///   `permanently-deferred` > `temporarily-deferred` > `eligible`
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let mut eligibility_status: EligibilityStatus = "eligible".to_string();
    let mut deferral_window = String::new();

    for r in &fired_rules {
        if r.status == "permanently-deferred" {
            eligibility_status = "permanently-deferred".to_string();
            deferral_window = String::new();
            break;
        }
        if r.status == "temporarily-deferred" {
            eligibility_status = "temporarily-deferred".to_string();
            // Keep the first temporary deferral window we encounter.
            if deferral_window.is_empty() && !r.deferral_window.is_empty() {
                deferral_window = r.deferral_window.clone();
            }
        }
    }

    let answered_count = count_answered_items(data);

    GradingResult {
        eligibility_status,
        deferral_window,
        fired_rules,
        additional_flags,
        answered_count,
        timestamp,
    }
}

/// Evaluate every DSG rule against the data, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if let Some(fired) = (rule.evaluate)(data) {
            out.push(fired);
        }
    }
    out
}

/// Counts how many answerable fields have been answered across the 10 steps.
/// Used for progress reporting on the dashboard / report.
fn count_answered_items(d: &AssessmentData) -> u32 {
    let mut n: u32 = 0;

    // Donor demographics
    if !d.donor_demographics.first_name.trim().is_empty() {
        n += 1;
    }
    if !d.donor_demographics.last_name.trim().is_empty() {
        n += 1;
    }
    if !d.donor_demographics.date_of_birth.is_empty() {
        n += 1;
    }
    if !d.donor_demographics.sex.is_empty() {
        n += 1;
    }
    if d.donor_demographics.weight.is_some() {
        n += 1;
    }
    if d.donor_demographics.height.is_some() {
        n += 1;
    }
    if !d.donor_demographics.donor_type.is_empty() {
        n += 1;
    }
    if !d.donor_demographics.last_donation_date.is_empty() {
        n += 1;
    }

    // General health (4)
    for v in [
        &d.general_health.feeling_well_today,
        &d.general_health.adequate_sleep,
        &d.general_health.adequate_meal_and_fluids,
        &d.general_health.feeling_faint_or_unwell,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }

    // Medical history (11 yes/no + any medications row)
    for v in [
        &d.medical_history.heart_or_circulatory_disease,
        &d.medical_history.cancer,
        &d.medical_history.bleeding_or_clotting_disorder,
        &d.medical_history.diabetes_on_insulin,
        &d.medical_history.epilepsy_or_seizures,
        &d.medical_history.hiv_positive,
        &d.medical_history.hepatitis_b_or_c,
        &d.medical_history.htlv,
        &d.medical_history.cjd_family_history,
        &d.medical_history.received_pituitary_hormone,
        &d.medical_history.received_dura_mater_graft,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }
    if !d.medical_history.current_medications.is_empty() {
        n += 1;
    }

    // Recent illness (7 yes/no + vaccination_details optional)
    for v in [
        &d.recent_illness.fever_past_two_weeks,
        &d.recent_illness.infection_past_two_weeks,
        &d.recent_illness.antibiotics_past_seven_days,
        &d.recent_illness.dental_work_past_week,
        &d.recent_illness.surgery_past_six_months,
        &d.recent_illness.covid_positive_past_twenty_eight_days,
        &d.recent_illness.vaccination_past_four_weeks,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }

    // Travel history (4 yes/no + any travel row)
    for v in [
        &d.travel_history.malaria_area_past_twelve_months,
        &d.travel_history.west_nile_virus_area_past_twenty_eight_days,
        &d.travel_history.uk_residence_1980_to_1996_over_12_months,
        &d.travel_history.blood_transfusion_in_uk,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }

    // Lifestyle risk (9)
    for v in [
        &d.lifestyle_risk.iv_drug_use_ever,
        &d.lifestyle_risk.sex_with_iv_drug_user,
        &d.lifestyle_risk.sex_in_exchange_past_twelve_months,
        &d.lifestyle_risk.sex_with_new_partner_past_three_months,
        &d.lifestyle_risk.multiple_sexual_partners_past_three_months,
        &d.lifestyle_risk.tattoo_or_piercing_past_four_months,
        &d.lifestyle_risk.acupuncture_past_four_months,
        &d.lifestyle_risk.body_or_ear_piercing_past_four_months,
        &d.lifestyle_risk.incarcerated_past_twelve_months,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }

    // Pregnancy & transfusion (5 yes/no)
    for v in [
        &d.pregnancy_transfusion.currently_pregnant,
        &d.pregnancy_transfusion.pregnancy_past_six_months,
        &d.pregnancy_transfusion.breastfeeding,
        &d.pregnancy_transfusion.received_transfusion_ever,
        &d.pregnancy_transfusion.received_transplant_ever,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }

    // Vital signs (5 numerics)
    if d.vital_signs.hemoglobin.is_some() {
        n += 1;
    }
    if d.vital_signs.systolic_bp.is_some() {
        n += 1;
    }
    if d.vital_signs.diastolic_bp.is_some() {
        n += 1;
    }
    if d.vital_signs.pulse_bpm.is_some() {
        n += 1;
    }
    if d.vital_signs.temperature_celsius.is_some() {
        n += 1;
    }

    // Informed consent (4)
    for v in [
        &d.informed_consent.understood_information,
        &d.informed_consent.consent_to_donate,
        &d.informed_consent.consent_to_testing,
        &d.informed_consent.consent_to_contact,
    ] {
        if !v.is_empty() {
            n += 1;
        }
    }

    // Donation plan
    if !d.donation_plan.planned_donation_type.is_empty() {
        n += 1;
    }
    if !d.donation_plan.preferred_donation_date.is_empty() {
        n += 1;
    }
    if !d.donation_plan.session.is_empty() {
        n += 1;
    }

    n
}
