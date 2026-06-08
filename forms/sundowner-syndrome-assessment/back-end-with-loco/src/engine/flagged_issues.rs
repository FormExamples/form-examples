//! Detection of additional flagged issues.

// Flagged-issue detection for the sundowner syndrome assessment.
//
// Independent of the CMAI/NPI totals, this module raises clinician-facing
// flags grouped by priority:
//   high   — aggressive / violent behaviour, fall risk, self-harm risk,
//            recent delirium, severe carer burnout
//   medium — sleep disturbance, sedative / antipsychotic burden, recent
//            medication change, moderate carer strain, infection or pain
//            triggers
//   low    — environmental contributors (lighting, noise, clutter,
//            unfamiliar setting, mirrors), routine inconsistency
//
// Flag IDs match the front-end JavaScript verbatim.

use super::sundowner_rules::cmai_item_by_number;
use super::types::{AdditionalFlag, AssessmentData};

// CMAI item numbers representing specifically aggressive behaviour
// (versus general agitation).
const AGGRESSIVE_ITEM_NUMBERS: &[u32] = &[4, 7, 8, 10, 11, 13, 14, 15, 21, 25];

// CMAI item numbers representing direct self-harm risk.
const SELF_HARM_ITEM_NUMBERS: &[u32] = &[7, 17, 20, 21];

// CMAI item numbers representing fall / injury risk.
const FALL_RISK_ITEM_NUMBERS: &[u32] = &[1, 16, 17, 29];

/// Read a CMAI item score (0 if not present / out of range).
fn cmai_at(data: &AssessmentData, n: u32) -> i32 {
    let id = format!("cmai{:02}", n);
    data.behavioural_symptoms
        .cmai
        .get(&id)
        .copied()
        .unwrap_or(0)
}

/// Read an NPI domain's frequency * severity (0 if either is out of range).
fn npi_score(data: &AssessmentData, key: &str) -> i32 {
    let entry = data.behavioural_symptoms.npi.get(key);
    let f = entry.map(|e| e.frequency).unwrap_or(0);
    let s = entry.map(|e| e.severity).unwrap_or(0);
    if (1..=4).contains(&f) && (1..=3).contains(&s) {
        f * s
    } else {
        0
    }
}

/// Detect flagged issues. Returned list is sorted high -> medium -> low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH PRIORITY ────────────────────────────────────────────

    // Aggressive behaviour: any aggressive item rated >= 4 (several times
    // a week or more).
    let aggressive_active: Vec<(u32, i32)> = AGGRESSIVE_ITEM_NUMBERS
        .iter()
        .map(|&n| (n, cmai_at(data, n)))
        .filter(|&(_, v)| v >= 4)
        .collect();
    if !aggressive_active.is_empty() {
        let labels = aggressive_active
            .iter()
            .map(|&(n, v)| match cmai_item_by_number(n) {
                Some(item) => format!("#{} {} (rated {})", n, item.label, v),
                None => format!("#{n}"),
            })
            .collect::<Vec<_>>()
            .join("; ");
        flags.push(AdditionalFlag {
            id: "FLAG-AGGRESSION-001".to_string(),
            category: "Aggressive Behaviour".to_string(),
            message: format!(
                "Aggressive behaviour observed at least several times a week: {labels}. Safety planning and de-escalation training indicated."
            ),
            priority: "high".to_string(),
        });
    }
    if npi_score(data, "agitationAggression") >= 6 {
        flags.push(AdditionalFlag {
            id: "FLAG-AGGRESSION-002".to_string(),
            category: "Aggressive Behaviour".to_string(),
            message: format!(
                "NPI agitation/aggression domain score {} of 12 — clinically significant.",
                npi_score(data, "agitationAggression")
            ),
            priority: "high".to_string(),
        });
    }

    // Self-harm risk
    let self_harm_active: Vec<(u32, i32)> = SELF_HARM_ITEM_NUMBERS
        .iter()
        .map(|&n| (n, cmai_at(data, n)))
        .filter(|&(_, v)| v >= 3)
        .collect();
    if !self_harm_active.is_empty() {
        let labels = self_harm_active
            .iter()
            .map(|&(n, v)| match cmai_item_by_number(n) {
                Some(item) => format!("#{} {} (rated {})", n, item.label, v),
                None => format!("#{n}"),
            })
            .collect::<Vec<_>>()
            .join("; ");
        flags.push(AdditionalFlag {
            id: "FLAG-SELFHARM-001".to_string(),
            category: "Self-Harm Risk".to_string(),
            message: format!(
                "Self-harm-related behaviour observed: {labels}. Constant supervision may be required."
            ),
            priority: "high".to_string(),
        });
    }

    // Fall risk
    let fall_active = FALL_RISK_ITEM_NUMBERS
        .iter()
        .any(|&n| cmai_at(data, n) >= 4);
    if fall_active || cmai_at(data, 17) >= 2 {
        flags.push(AdditionalFlag {
            id: "FLAG-FALL-001".to_string(),
            category: "Fall Risk".to_string(),
            message: "Wandering, restlessness, or intentional falling observed. Falls-prevention review recommended.".to_string(),
            priority: "high".to_string(),
        });
    }

    // Prior delirium history is a high-priority red flag.
    if data.cognitive_status.prior_delirium_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DELIRIUM-001".to_string(),
            category: "Cognitive Status".to_string(),
            message: "Prior delirium history — re-assess for active delirium (infection, dehydration, medication).".to_string(),
            priority: "high".to_string(),
        });
    }

    // Severe carer burnout / strain.
    if data.carer_impact.carer_strain_level == "severe"
        || data.carer_impact.carer_burnout_signs == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-CARER-001".to_string(),
            category: "Carer Impact".to_string(),
            message: "Severe carer strain or burnout — urgent respite, support, or alternative placement should be considered.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM PRIORITY ──────────────────────────────────────────

    // Sleep disturbance
    let short_sleep = data
        .sleep_wake_cycle
        .average_hours_of_sleep
        .map(|h| h < 5.0)
        .unwrap_or(false);
    if data.sleep_wake_cycle.nighttime_wandering == "yes"
        || data.sleep_wake_cycle.reversed_sleep_cycle == "yes"
        || short_sleep
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SLEEP-001".to_string(),
            category: "Sleep-Wake Cycle".to_string(),
            message: "Significant sleep-wake disturbance (nighttime wandering, reversed cycle, or short sleep). Sleep hygiene and circadian-rhythm interventions indicated.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if npi_score(data, "sleep") >= 6 {
        flags.push(AdditionalFlag {
            id: "FLAG-SLEEP-002".to_string(),
            category: "Sleep-Wake Cycle".to_string(),
            message: format!(
                "NPI sleep domain score {} of 12 — clinically significant.",
                npi_score(data, "sleep")
            ),
            priority: "medium".to_string(),
        });
    }

    // Medication interactions / burden
    if data.medication_review.anticholinergic_burden == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-001".to_string(),
            category: "Medication Review".to_string(),
            message: "Anticholinergic burden present — known to worsen confusion and sundowning. Consider deprescribing.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.medication_review.sedative_use == "yes"
        && data.medication_review.antipsychotic_use == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-002".to_string(),
            category: "Medication Review".to_string(),
            message: "Concurrent sedative + antipsychotic use — interaction risk; review indications and dosing.".to_string(),
            priority: "medium".to_string(),
        });
    } else if data.medication_review.antipsychotic_use == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-003".to_string(),
            category: "Medication Review".to_string(),
            message: "Antipsychotic in use — review indication, dose, and stroke risk in dementia (BPSD off-label).".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.medication_review.recent_medication_change == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-004".to_string(),
            category: "Medication Review".to_string(),
            message: "Recent medication change reported — may be contributing to behavioural symptoms.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.medication_review.medication_adherence == "poor" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-005".to_string(),
            category: "Medication Review".to_string(),
            message: "Poor medication adherence — review pillbox / supervised dosing.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Acute medical triggers
    if data.trigger_identification.infection == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRIG-001".to_string(),
            category: "Trigger Identification".to_string(),
            message: "Infection identified as trigger — screen for UTI / chest / cellulitis as common precipitants.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.trigger_identification.pain == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRIG-002".to_string(),
            category: "Trigger Identification".to_string(),
            message: "Untreated pain identified as trigger — review analgesia and pain-assessment tools (e.g. Abbey).".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.trigger_identification.dehydration == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-TRIG-003".to_string(),
            category: "Trigger Identification".to_string(),
            message: "Dehydration identified as trigger — fluid balance and hydration plan.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Moderate carer strain
    let already_carer_001 = flags.iter().any(|f| f.id == "FLAG-CARER-001");
    if data.carer_impact.carer_strain_level == "moderate" && !already_carer_001 {
        flags.push(AdditionalFlag {
            id: "FLAG-CARER-002".to_string(),
            category: "Carer Impact".to_string(),
            message: "Moderate carer strain reported — proactive support and respite-care planning recommended.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.carer_impact.carer_sleep_disturbed == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CARER-003".to_string(),
            category: "Carer Impact".to_string(),
            message: "Carer sleep disturbed by patient — assess carer sleep deprivation and respite need.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW PRIORITY ─────────────────────────────────────────────

    if data.environmental_assessment.adequate_daylight == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-001".to_string(),
            category: "Environmental".to_string(),
            message: "Inadequate daylight exposure — consider bright-light therapy / outdoor time to support circadian rhythm.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.environmental_assessment.excessive_noise == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-002".to_string(),
            category: "Environmental".to_string(),
            message: "Excessive noise in environment — sensory overload may worsen agitation.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.environmental_assessment.cluttered == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-003".to_string(),
            category: "Environmental".to_string(),
            message: "Cluttered environment — declutter to reduce confusion and tripping hazards.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.environmental_assessment.mirrors_or_shadows == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-004".to_string(),
            category: "Environmental".to_string(),
            message: "Mirrors or shadows present — may trigger misperceptions / hallucinations; consider covering or relocating.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.environmental_assessment.consistent_routine == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-005".to_string(),
            category: "Environmental".to_string(),
            message: "Inconsistent routine — establish predictable daily schedule to reduce sundowning.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.environmental_assessment.unfamiliar_environment == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ENV-006".to_string(),
            category: "Environmental".to_string(),
            message: "Unfamiliar environment reported — orientation aids (clocks, calendars, signage) recommended.".to_string(),
            priority: "low".to_string(),
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
