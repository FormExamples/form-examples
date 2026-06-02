//! DVLA B1 — Confidential medical information (neurological).
//!
//! The B1 form is a structured data-collection form, not a scoring instrument.
//! Each rule below identifies a single field that must be completed for the
//! declaration to be acceptable to the DVLA Drivers Medical Group. Conditional
//! questions (Q4 → Q5/Q6, Q10 → Q10a/b, Q12 → Q12a/b) are gated by the
//! `applies` predicate so the validator only counts a rule if the conditional
//! branch is active for the patient's answers.
//!
//! Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report group
//! fired rules by section.

use crate::engine::types::AssessmentData;

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if a Yes/No field has been answered (either yes or no).
pub fn is_yes_no_answered(value: &str) -> bool {
    value == "yes" || value == "no"
}

/// True if the patient must complete the epilepsy declaration. The declaration
/// is mandatory whenever the patient declares epilepsy or more than one
/// lifetime seizure (DVLA B1 question 6 group).
pub fn epilepsy_declaration_required(data: &AssessmentData) -> bool {
    data.seizures.had_seizures == "yes"
        && data.seizures.diagnosis == "more-than-one-or-epilepsy"
}

/// Human-readable label for a section key.
pub fn section_label(section: &str) -> &'static str {
    match section {
        "personalDetails" => "Personal Details",
        "healthcareProfessionals" => "Healthcare Professionals",
        "conditionHistory" => "Condition History (Q1)",
        "treatmentProvider" => "Treatment Provider (Q2)",
        "blackouts" => "Blackouts (Q3)",
        "seizures" => "Seizures (Q4-Q6)",
        "medication" => "Medication (Q7)",
        "vpShunt" => "VP Shunt (Q8)",
        "dailyLiving" => "Daily Living (Q9)",
        "doubleVision" => "Double Vision (Q10)",
        "eyesight" => "Eyesight (Q11)",
        "vehicleAdaptations" => "Vehicle Adaptations (Q12)",
        "authorisation" => "Authorisation",
        _ => "",
    }
}

pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub description: &'static str,
    pub applies: fn(&AssessmentData) -> bool,
    pub is_satisfied: fn(&AssessmentData) -> bool,
}

pub fn b1_rules() -> &'static [ValidationRule] {
    &[
        // ─── Step 1 — Personal Details (Part A) ─────────────────
        ValidationRule {
            id: "PD-01",
            section: "personalDetails",
            description: "Title is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.title),
        },
        ValidationRule {
            id: "PD-02",
            section: "personalDetails",
            description: "Full name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.full_name),
        },
        ValidationRule {
            id: "PD-03",
            section: "personalDetails",
            description: "Date of birth is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.date_of_birth),
        },
        ValidationRule {
            id: "PD-04",
            section: "personalDetails",
            description: "Address is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.address_line1),
        },
        ValidationRule {
            id: "PD-05",
            section: "personalDetails",
            description: "Postcode is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.postcode),
        },
        ValidationRule {
            id: "PD-06",
            section: "personalDetails",
            description: "Contact number is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.personal_details.contact_number),
        },
        // ─── Step 2 — Healthcare Professionals (Part B) ─────────
        ValidationRule {
            id: "HC-01",
            section: "healthcareProfessionals",
            description: "GP name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.healthcare_professionals.gp.gp_name),
        },
        ValidationRule {
            id: "HC-02",
            section: "healthcareProfessionals",
            description: "GP surgery name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.healthcare_professionals.gp.surgery_name),
        },
        ValidationRule {
            id: "HC-03",
            section: "healthcareProfessionals",
            description: "GP postcode is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.healthcare_professionals.gp.postcode),
        },
        ValidationRule {
            id: "HC-04",
            section: "healthcareProfessionals",
            description: "GP date last seen for this condition is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.healthcare_professionals.gp.date_last_seen),
        },
        // ─── Step 3 — Q1 Condition History ──────────────────────
        ValidationRule {
            id: "Q1-01",
            section: "conditionHistory",
            description:
                "At least one Q1 condition or brain-surgery answer (or \"Not applicable\") is required.",
            applies: |_| true,
            is_satisfied: |d| {
                d.condition_history.brain_haemorrhage
                    || d.condition_history.severe_head_injury
                    || d.condition_history.other_condition
                    || d.condition_history.brain_surgery_not_applicable
                    || has_text(&d.condition_history.brain_surgery_date)
            },
        },
        ValidationRule {
            id: "Q1-02",
            section: "conditionHistory",
            description: "Date of brain haemorrhage is required when ticked.",
            applies: |d| d.condition_history.brain_haemorrhage,
            is_satisfied: |d| has_text(&d.condition_history.brain_haemorrhage_date),
        },
        ValidationRule {
            id: "Q1-03",
            section: "conditionHistory",
            description: "Date of severe head injury is required when ticked.",
            applies: |d| d.condition_history.severe_head_injury,
            is_satisfied: |d| has_text(&d.condition_history.severe_head_injury_date),
        },
        ValidationRule {
            id: "Q1-04",
            section: "conditionHistory",
            description: "Details of \"other condition\" are required when ticked.",
            applies: |d| d.condition_history.other_condition,
            is_satisfied: |d| has_text(&d.condition_history.other_condition_details),
        },
        // ─── Step 4 — Q2 Treatment Provider ─────────────────────
        ValidationRule {
            id: "Q2-01",
            section: "treatmentProvider",
            description:
                "Provider last seen for this condition (GP or Consultant) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                d.treatment_provider.last_seen == "gp"
                    || d.treatment_provider.last_seen == "consultant"
            },
        },
        ValidationRule {
            id: "Q2-02",
            section: "treatmentProvider",
            description: "GP date of last contact is required when last seen by GP.",
            applies: |d| d.treatment_provider.last_seen == "gp",
            is_satisfied: |d| has_text(&d.treatment_provider.gp_last_contact_date),
        },
        ValidationRule {
            id: "Q2-03",
            section: "treatmentProvider",
            description:
                "Consultant date of last contact is required when last seen by consultant.",
            applies: |d| d.treatment_provider.last_seen == "consultant",
            is_satisfied: |d| has_text(&d.treatment_provider.consultant_last_contact_date),
        },
        // ─── Step 5 — Q3 Blackouts ──────────────────────────────
        ValidationRule {
            id: "Q3-01",
            section: "blackouts",
            description: "Q3: blackouts/altered consciousness Yes or No is required.",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.blackouts.had_blackouts),
        },
        ValidationRule {
            id: "Q3-02",
            section: "blackouts",
            description: "Q3: date of blackout is required when answered Yes.",
            applies: |d| d.blackouts.had_blackouts == "yes",
            is_satisfied: |d| has_text(&d.blackouts.blackout_date),
        },
        // ─── Step 6 — Q4–Q6 Seizures ────────────────────────────
        ValidationRule {
            id: "Q4-01",
            section: "seizures",
            description: "Q4: ever had seizures or epileptic attacks (Yes or No) is required.",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.seizures.had_seizures),
        },
        ValidationRule {
            id: "Q4-02",
            section: "seizures",
            description:
                "Q4: seizure diagnosis (first ever, or more than one/epilepsy) is required.",
            applies: |d| d.seizures.had_seizures == "yes",
            is_satisfied: |d| {
                d.seizures.diagnosis == "first-ever"
                    || d.seizures.diagnosis == "more-than-one-or-epilepsy"
            },
        },
        ValidationRule {
            id: "Q5-01",
            section: "seizures",
            description: "Q5: date of first ever seizure is required.",
            applies: |d| {
                d.seizures.had_seizures == "yes" && d.seizures.diagnosis == "first-ever"
            },
            is_satisfied: |d| has_text(&d.seizures.first_ever.date),
        },
        ValidationRule {
            id: "Q6a-01",
            section: "seizures",
            description: "Q6a: two or more seizures within 5 years (Yes or No) is required.",
            applies: |d| {
                d.seizures.had_seizures == "yes"
                    && d.seizures.diagnosis == "more-than-one-or-epilepsy"
            },
            is_satisfied: |d| is_yes_no_answered(&d.seizures.multiple.two_or_more_within_five_years),
        },
        ValidationRule {
            id: "Q6g-01",
            section: "seizures",
            description: "Q6g: have seizures affected level of consciousness (Yes or No)?",
            applies: |d| {
                d.seizures.had_seizures == "yes"
                    && d.seizures.diagnosis == "more-than-one-or-epilepsy"
            },
            is_satisfied: |d| is_yes_no_answered(&d.seizures.multiple.affected_consciousness),
        },
        ValidationRule {
            id: "Q6h-01",
            section: "seizures",
            description: "Q6h: would seizures have affected vehicle control (Yes or No)?",
            applies: |d| {
                d.seizures.had_seizures == "yes"
                    && d.seizures.diagnosis == "more-than-one-or-epilepsy"
                    && d.seizures.multiple.affected_consciousness == "yes"
            },
            is_satisfied: |d| {
                is_yes_no_answered(&d.seizures.multiple.would_have_affected_driving)
            },
        },
        ValidationRule {
            id: "Q6i-01",
            section: "seizures",
            description:
                "Q6i: was last seizure a result of medication advice from your doctor (Yes or No)?",
            applies: |d| {
                d.seizures.had_seizures == "yes"
                    && d.seizures.diagnosis == "more-than-one-or-epilepsy"
            },
            is_satisfied: |d| {
                is_yes_no_answered(&d.seizures.multiple.result_of_medication_advice)
            },
        },
        ValidationRule {
            id: "Q6-EPI-01",
            section: "seizures",
            description: "Epilepsy declaration must be accepted.",
            applies: |d| epilepsy_declaration_required(d),
            is_satisfied: |d| d.seizures.epilepsy_declaration.declaration_accepted,
        },
        ValidationRule {
            id: "Q6-EPI-02",
            section: "seizures",
            description: "Epilepsy declaration: signed name is required.",
            applies: |d| epilepsy_declaration_required(d),
            is_satisfied: |d| has_text(&d.seizures.epilepsy_declaration.signed_name),
        },
        ValidationRule {
            id: "Q6-EPI-03",
            section: "seizures",
            description: "Epilepsy declaration: signature date is required.",
            applies: |d| epilepsy_declaration_required(d),
            is_satisfied: |d| has_text(&d.seizures.epilepsy_declaration.signature_date),
        },
        // ─── Step 7 — Q7 Medication ─────────────────────────────
        ValidationRule {
            id: "Q7-01",
            section: "medication",
            description:
                "Q7: at least one medication entry, or \"No medication taken\" must be ticked.",
            applies: |_| true,
            is_satisfied: |d| {
                d.medication.no_medication_taken
                    || d.medication.entries.iter().any(|e| has_text(&e.name))
            },
        },
        ValidationRule {
            id: "Q7a-01",
            section: "medication",
            description:
                "Q7a: medication makes you drowsy or confused when driving (Yes or No)?",
            applies: |d| {
                !d.medication.no_medication_taken
                    && d.medication.entries.iter().any(|e| has_text(&e.name))
            },
            is_satisfied: |d| is_yes_no_answered(&d.medication.makes_drowsy_or_confused),
        },
        // ─── Step 8 — Q8 VP Shunt ───────────────────────────────
        ValidationRule {
            id: "Q8-01",
            section: "vpShunt",
            description: "Q8: VP shunt or external ventricular drain (Yes or No) is required.",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.vp_shunt.had_vp_shunt_or_drain),
        },
        ValidationRule {
            id: "Q8-02",
            section: "vpShunt",
            description: "Q8: date of procedure is required when answered Yes.",
            applies: |d| d.vp_shunt.had_vp_shunt_or_drain == "yes",
            is_satisfied: |d| has_text(&d.vp_shunt.procedure_date),
        },
        // ─── Step 9 — Q9 Daily Living ───────────────────────────
        ValidationRule {
            id: "Q9-01",
            section: "dailyLiving",
            description:
                "Q9: do you need help from another person with day-to-day living (Yes or No)?",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.daily_living.needs_help),
        },
        ValidationRule {
            id: "Q9-02",
            section: "dailyLiving",
            description:
                "Q9: details of how a helper assists you are required when answered Yes.",
            applies: |d| d.daily_living.needs_help == "yes",
            is_satisfied: |d| has_text(&d.daily_living.help_details),
        },
        // ─── Step 10 — Q10 Double Vision ────────────────────────
        ValidationRule {
            id: "Q10-01",
            section: "doubleVision",
            description: "Q10: double vision/diplopia (Yes or No) is required.",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.double_vision.has_double_vision),
        },
        ValidationRule {
            id: "Q10a-01",
            section: "doubleVision",
            description: "Q10a: is double vision suppressed or controlled (Yes or No)?",
            applies: |d| d.double_vision.has_double_vision == "yes",
            is_satisfied: |d| is_yes_no_answered(&d.double_vision.suppressed_or_controlled),
        },
        ValidationRule {
            id: "Q10b-01",
            section: "doubleVision",
            description: "Q10b: correction method is required when double vision is controlled.",
            applies: |d| {
                d.double_vision.has_double_vision == "yes"
                    && d.double_vision.suppressed_or_controlled == "yes"
            },
            is_satisfied: |d| {
                let m = d.double_vision.correction_method.as_str();
                m == "patch" || m == "prism" || m == "glasses-or-lenses" || m == "other"
            },
        },
        ValidationRule {
            id: "Q10b-02",
            section: "doubleVision",
            description: "Q10b: please describe the correction method when \"Other\" is selected.",
            applies: |d| {
                d.double_vision.has_double_vision == "yes"
                    && d.double_vision.suppressed_or_controlled == "yes"
                    && d.double_vision.correction_method == "other"
            },
            is_satisfied: |d| has_text(&d.double_vision.correction_method_other),
        },
        // ─── Step 11 — Q11 Eyesight ─────────────────────────────
        ValidationRule {
            id: "Q11-01",
            section: "eyesight",
            description: "Q11: eyesight problems caused by your condition (Yes or No)?",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.eyesight.has_eyesight_problems),
        },
        ValidationRule {
            id: "Q11-02",
            section: "eyesight",
            description: "Q11: please describe the eyesight problems when answered Yes.",
            applies: |d| d.eyesight.has_eyesight_problems == "yes",
            is_satisfied: |d| has_text(&d.eyesight.details),
        },
        // ─── Step 12 — Q12 Vehicle Adaptations ──────────────────
        ValidationRule {
            id: "Q12-01",
            section: "vehicleAdaptations",
            description:
                "Q12: do you need to drive a vehicle fitted with special controls or automatic transmission (Yes or No)?",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.vehicle_adaptations.needs_adaptations),
        },
        ValidationRule {
            id: "Q12a-01",
            section: "vehicleAdaptations",
            description:
                "Q12a: have you previously declared the need for special controls (Yes or No)?",
            applies: |d| d.vehicle_adaptations.needs_adaptations == "yes",
            is_satisfied: |d| is_yes_no_answered(&d.vehicle_adaptations.previously_declared),
        },
        ValidationRule {
            id: "Q12b-01",
            section: "vehicleAdaptations",
            description:
                "Q12b: have additional controls been fitted since last licence (Yes or No)?",
            applies: |d| {
                d.vehicle_adaptations.needs_adaptations == "yes"
                    && d.vehicle_adaptations.previously_declared == "yes"
            },
            is_satisfied: |d| {
                is_yes_no_answered(&d.vehicle_adaptations.additional_controls_fitted)
            },
        },
        // ─── Step 13 — Authorisation ────────────────────────────
        ValidationRule {
            id: "AUTH-01",
            section: "authorisation",
            description: "Authorisation declaration must be accepted.",
            applies: |_| true,
            is_satisfied: |d| d.authorisation.declaration_accepted,
        },
        ValidationRule {
            id: "AUTH-02",
            section: "authorisation",
            description: "Authorisation: name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.authorisation.name),
        },
        ValidationRule {
            id: "AUTH-03",
            section: "authorisation",
            description: "Authorisation: signature date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.authorisation.signature_date),
        },
        ValidationRule {
            id: "AUTH-04",
            section: "authorisation",
            description:
                "Authorisation: electronic correspondence consent (Yes or No) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                is_yes_no_answered(&d.authorisation.electronic_correspondence_consent)
            },
        },
        ValidationRule {
            id: "AUTH-05",
            section: "authorisation",
            description:
                "Authorisation: DVLA contact preference (Email or SMS) is required.",
            applies: |d| d.authorisation.electronic_correspondence_consent == "yes",
            is_satisfied: |d| {
                d.authorisation.dvla_contact_preference == "email"
                    || d.authorisation.dvla_contact_preference == "sms"
            },
        },
        ValidationRule {
            id: "AUTH-06",
            section: "authorisation",
            description:
                "Authorisation: healthcare professional contact preference (Email or SMS) is required.",
            applies: |d| d.authorisation.electronic_correspondence_consent == "yes",
            is_satisfied: |d| {
                d.authorisation.healthcare_contact_preference == "email"
                    || d.authorisation.healthcare_contact_preference == "sms"
            },
        },
    ]
}
