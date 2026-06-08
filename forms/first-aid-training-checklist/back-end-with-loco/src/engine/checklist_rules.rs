//! Checklist rules module.

use super::types::{AssessmentData, TriState};
use super::utils::normalise_tri;

/// A declarative First Aid at Work rule. Each rule evaluates to a tri-state
/// value: `yes` (demonstrated), `no` (deficiency), `na` (not assessed), or
/// `""` (no answer yet).
pub struct FawRule {
    /// ID.
    pub id: &'static str,
    /// Step.
    pub step: u32,
    /// Category.
    pub category: &'static str,
    /// Label.
    pub label: &'static str,
    /// Critical.
    pub critical: bool,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> TriState,
}

/// All declarative FAW competency rules.
///
/// Critical life-saving skills (per HSE / St John): any `no` on a rule with
/// `critical = true` forces an overall **Fail**. Non-critical `no` answers
/// are deficiencies: 1-2 → Needs Development; 3+ → Fail.
pub fn all_rules() -> Vec<FawRule> {
    vec![
        // ───── Step 2: Scene Assessment & Safety ─────
        FawRule {
            id: "FAW-SS-SAFE",
            step: 2,
            category: "Scene Safety",
            label: "Confirms the scene is safe before approaching the casualty.",
            critical: false,
            evaluate: |d| normalise_tri(&d.scene_assessment_safety.scene_safe),
        },
        FawRule {
            id: "FAW-SS-PPE",
            step: 2,
            category: "Scene Safety",
            label: "Applies appropriate personal protective equipment (gloves, face shield).",
            critical: false,
            evaluate: |d| normalise_tri(&d.scene_assessment_safety.ppe_applied),
        },
        FawRule {
            id: "FAW-SS-HAZARDS",
            step: 2,
            category: "Scene Safety",
            label: "Identifies and mitigates environmental hazards (traffic, electricity, chemicals).",
            critical: false,
            evaluate: |d| normalise_tri(&d.scene_assessment_safety.hazards_identified),
        },
        FawRule {
            id: "FAW-SS-BYSTANDERS",
            step: 2,
            category: "Scene Safety",
            label: "Manages bystanders so they do not impede care or compromise safety.",
            critical: false,
            evaluate: |d| normalise_tri(&d.scene_assessment_safety.bystanders_controlled),
        },
        // ───── Step 3: Primary Survey (DRABC) ─────
        FawRule {
            id: "FAW-PS-DANGER",
            step: 3,
            category: "Primary Survey",
            label: "D — checks for Danger to self, casualty, and bystanders.",
            critical: false,
            evaluate: |d| normalise_tri(&d.primary_survey_drabc.danger_check),
        },
        FawRule {
            id: "FAW-PS-RESPONSE",
            step: 3,
            category: "Primary Survey",
            label: "R — assesses Response using AVPU / shake-and-shout.",
            critical: true,
            evaluate: |d| normalise_tri(&d.primary_survey_drabc.response_check),
        },
        FawRule {
            id: "FAW-PS-AIRWAY",
            step: 3,
            category: "Primary Survey",
            label: "A — opens and clears Airway with head tilt-chin lift (or jaw thrust).",
            critical: false,
            evaluate: |d| normalise_tri(&d.primary_survey_drabc.airway_management),
        },
        FawRule {
            id: "FAW-PS-BREATHING",
            step: 3,
            category: "Primary Survey",
            label: "B — checks Breathing (look, listen, feel) for up to 10 seconds.",
            critical: false,
            evaluate: |d| normalise_tri(&d.primary_survey_drabc.breathing_check),
        },
        FawRule {
            id: "FAW-PS-CIRCULATION",
            step: 3,
            category: "Primary Survey",
            label: "C — assesses Circulation and obvious life-threatening bleeding.",
            critical: false,
            evaluate: |d| normalise_tri(&d.primary_survey_drabc.circulation_assessment),
        },
        FawRule {
            id: "FAW-PS-RECOVERY",
            step: 3,
            category: "Primary Survey",
            label: "Places unconscious-but-breathing casualty in the recovery position.",
            critical: false,
            evaluate: |d| normalise_tri(&d.primary_survey_drabc.recovery_position_when_appropriate),
        },
        // ───── Step 4: CPR & AED ─────
        FawRule {
            id: "FAW-CPR-COMPRESSIONS",
            step: 4,
            category: "CPR & AED",
            label: "Delivers effective chest compressions at 100-120/min, 5-6 cm depth.",
            critical: true,
            evaluate: |d| normalise_tri(&d.cpr_aed.effective_compressions),
        },
        FawRule {
            id: "FAW-CPR-VENTILATIONS",
            step: 4,
            category: "CPR & AED",
            label: "Delivers effective rescue breaths producing visible chest rise.",
            critical: true,
            evaluate: |d| normalise_tri(&d.cpr_aed.effective_ventilations),
        },
        FawRule {
            id: "FAW-CPR-RATIO",
            step: 4,
            category: "CPR & AED",
            label: "Maintains a 30:2 compression-to-ventilation ratio.",
            critical: false,
            evaluate: |d| normalise_tri(&d.cpr_aed.ratio30to2),
        },
        FawRule {
            id: "FAW-AED-POWER",
            step: 4,
            category: "CPR & AED",
            label: "Powers on the AED as soon as it is available and follows voice prompts.",
            critical: false,
            evaluate: |d| normalise_tri(&d.cpr_aed.aed_power_on_promptly),
        },
        FawRule {
            id: "FAW-AED-PADS",
            step: 4,
            category: "CPR & AED",
            label: "Places AED pads in correct anterolateral position on bare chest.",
            critical: false,
            evaluate: |d| normalise_tri(&d.cpr_aed.aed_pad_placement),
        },
        FawRule {
            id: "FAW-AED-SAFE-SHOCK",
            step: 4,
            category: "CPR & AED",
            label: "Delivers shock safely with verbal \"stand clear\" — no unsafe contact.",
            critical: true,
            evaluate: |d| normalise_tri(&d.cpr_aed.aed_safe_shock_delivery),
        },
        // ───── Step 5: Choking Management ─────
        FawRule {
            id: "FAW-CHOKE-COUGH",
            step: 5,
            category: "Choking",
            label: "Encourages an effective cough first when the airway is partially obstructed.",
            critical: false,
            evaluate: |d| normalise_tri(&d.choking_management.encouraged_coughing),
        },
        FawRule {
            id: "FAW-CHOKE-BACKBLOWS",
            step: 5,
            category: "Choking",
            label: "Delivers up to 5 firm back blows between the shoulder blades.",
            critical: false,
            evaluate: |d| normalise_tri(&d.choking_management.five_back_blows),
        },
        FawRule {
            id: "FAW-CHOKE-THRUSTS",
            step: 5,
            category: "Choking",
            label: "Delivers up to 5 abdominal thrusts (Heimlich) with correct hand position.",
            critical: false,
            evaluate: |d| normalise_tri(&d.choking_management.five_abdominal_thrusts),
        },
        FawRule {
            id: "FAW-CHOKE-ALTERNATE",
            step: 5,
            category: "Choking",
            label: "Alternates back blows and abdominal thrusts until obstruction is dislodged.",
            critical: false,
            evaluate: |d| normalise_tri(&d.choking_management.alternates_until_dislodged),
        },
        FawRule {
            id: "FAW-CHOKE-UNCONSCIOUS",
            step: 5,
            category: "Choking",
            label: "Begins CPR immediately if the choking casualty becomes unconscious.",
            critical: true,
            evaluate: |d| normalise_tri(&d.choking_management.unconscious_choking_cpr),
        },
        // ───── Step 6: Bleeding & Wound Care ─────
        FawRule {
            id: "FAW-BLEED-PRESSURE",
            step: 6,
            category: "Bleeding",
            label: "Applies firm direct pressure to control major external bleeding.",
            critical: true,
            evaluate: |d| normalise_tri(&d.bleeding_wound_care.direct_pressure_applied),
        },
        FawRule {
            id: "FAW-BLEED-ELEVATE",
            step: 6,
            category: "Bleeding",
            label: "Elevates and immobilises the injured part where appropriate.",
            critical: false,
            evaluate: |d| normalise_tri(&d.bleeding_wound_care.elevated_and_immobilised),
        },
        FawRule {
            id: "FAW-BLEED-DRESSING",
            step: 6,
            category: "Bleeding",
            label: "Applies a sterile dressing and bandage with appropriate pressure.",
            critical: false,
            evaluate: |d| normalise_tri(&d.bleeding_wound_care.applied_dressing_correctly),
        },
        FawRule {
            id: "FAW-BLEED-TOURNIQUET",
            step: 6,
            category: "Bleeding",
            label: "Applies a tourniquet correctly for catastrophic limb haemorrhage when indicated.",
            critical: true,
            evaluate: |d| normalise_tri(&d.bleeding_wound_care.tourniquet_when_indicated),
        },
        FawRule {
            id: "FAW-BLEED-HAEMOSTATIC",
            step: 6,
            category: "Bleeding",
            label: "Applies haemostatic dressing/wound packing for junctional haemorrhage.",
            critical: false,
            evaluate: |d| normalise_tri(&d.bleeding_wound_care.haemostatic_dressing_applied),
        },
        FawRule {
            id: "FAW-BLEED-SHOCK",
            step: 6,
            category: "Bleeding",
            label: "Treats casualty for shock (lay flat, raise legs, keep warm).",
            critical: false,
            evaluate: |d| normalise_tri(&d.bleeding_wound_care.treated_for_shock),
        },
        // ───── Step 7: Burns & Scalds ─────
        FawRule {
            id: "FAW-BURN-COOL",
            step: 7,
            category: "Burns & Scalds",
            label: "Cools the burn with running cool water for at least 20 minutes.",
            critical: false,
            evaluate: |d| normalise_tri(&d.burns_scalds.cooled_for_twenty_minutes),
        },
        FawRule {
            id: "FAW-BURN-REMOVE",
            step: 7,
            category: "Burns & Scalds",
            label: "Removes jewellery and loose clothing before swelling — but not stuck items.",
            critical: false,
            evaluate: |d| normalise_tri(&d.burns_scalds.removed_jewellery_and_loose_clothing),
        },
        FawRule {
            id: "FAW-BURN-COVER",
            step: 7,
            category: "Burns & Scalds",
            label: "Covers the burn loosely with cling film or a sterile non-adherent dressing.",
            critical: false,
            evaluate: |d| normalise_tri(&d.burns_scalds.covered_with_cling_film_or_sterile_dressing),
        },
        FawRule {
            id: "FAW-BURN-NOCREAM",
            step: 7,
            category: "Burns & Scalds",
            label: "Avoids applying creams, butter, ice, or bursting blisters.",
            critical: false,
            evaluate: |d| normalise_tri(&d.burns_scalds.avoided_creams_or_ice),
        },
        FawRule {
            id: "FAW-BURN-REFER",
            step: 7,
            category: "Burns & Scalds",
            label: "Refers serious burns to hospital (size, depth, age, location criteria).",
            critical: false,
            evaluate: |d| normalise_tri(&d.burns_scalds.referred_appropriately),
        },
        // ───── Step 8: Fractures, Sprains & Spinal Injury ─────
        FawRule {
            id: "FAW-FX-IMMOB",
            step: 8,
            category: "Fractures & Spinal",
            label: "Immobilises a suspected fracture in the position found.",
            critical: false,
            evaluate: |d| normalise_tri(&d.fractures_sprains_spinal.immobilised_injured_limb),
        },
        FawRule {
            id: "FAW-FX-RICE",
            step: 8,
            category: "Fractures & Spinal",
            label: "Applies RICE (Rest, Ice, Compression, Elevation) for sprains and strains.",
            critical: false,
            evaluate: |d| normalise_tri(&d.fractures_sprains_spinal.applied_rice_for_sprains),
        },
        FawRule {
            id: "FAW-FX-SPINAL-SUPPORT",
            step: 8,
            category: "Fractures & Spinal",
            label: "Provides manual in-line head/neck support when spinal injury is suspected.",
            critical: false,
            evaluate: |d| normalise_tri(&d.fractures_sprains_spinal.suspected_spinal_manual_support),
        },
        FawRule {
            id: "FAW-FX-LOGROLL",
            step: 8,
            category: "Fractures & Spinal",
            label: "Performs a coordinated log roll with team members where indicated.",
            critical: false,
            evaluate: |d| normalise_tri(&d.fractures_sprains_spinal.performed_log_roll_with_team),
        },
        FawRule {
            id: "FAW-FX-NOMOVE",
            step: 8,
            category: "Fractures & Spinal",
            label: "Avoids unnecessary movement of suspected spinal or unstable fractures.",
            critical: false,
            evaluate: |d| normalise_tri(&d.fractures_sprains_spinal.avoided_unnecessary_movement),
        },
        // ───── Step 9: Medical Emergencies ─────
        FawRule {
            id: "FAW-MED-ANAPHYLAXIS",
            step: 9,
            category: "Medical Emergencies",
            label: "Recognises anaphylaxis (airway / breathing / circulation symptoms).",
            critical: true,
            evaluate: |d| normalise_tri(&d.medical_emergencies.recognised_anaphylaxis),
        },
        FawRule {
            id: "FAW-MED-EPIPEN",
            step: 9,
            category: "Medical Emergencies",
            label: "Administers an EpiPen / adrenaline auto-injector safely into the outer thigh.",
            critical: false,
            evaluate: |d| normalise_tri(&d.medical_emergencies.administered_epi_pen_safely),
        },
        FawRule {
            id: "FAW-MED-ASTHMA",
            step: 9,
            category: "Medical Emergencies",
            label: "Assists casualty with a reliever inhaler during an asthma attack.",
            critical: false,
            evaluate: |d| normalise_tri(&d.medical_emergencies.assisted_asthma_inhaler),
        },
        FawRule {
            id: "FAW-MED-HYPO",
            step: 9,
            category: "Medical Emergencies",
            label: "Manages hypoglycaemia with sugary drink/glucose if conscious.",
            critical: false,
            evaluate: |d| normalise_tri(&d.medical_emergencies.managed_hypoglycaemia),
        },
        FawRule {
            id: "FAW-MED-SEIZURE",
            step: 9,
            category: "Medical Emergencies",
            label: "Manages a seizure: protect head, time the seizure, recovery position after.",
            critical: false,
            evaluate: |d| normalise_tri(&d.medical_emergencies.managed_seizure_safely),
        },
        FawRule {
            id: "FAW-MED-STROKE",
            step: 9,
            category: "Medical Emergencies",
            label: "Recognises stroke using FAST (Face, Arms, Speech, Time).",
            critical: false,
            evaluate: |d| normalise_tri(&d.medical_emergencies.recognised_stroke_fast),
        },
        FawRule {
            id: "FAW-MED-CHEST-PAIN",
            step: 9,
            category: "Medical Emergencies",
            label: "Recognises chest pain / suspected MI and provides appropriate care.",
            critical: false,
            evaluate: |d| normalise_tri(&d.medical_emergencies.recognised_chest_pain),
        },
    ]
}
