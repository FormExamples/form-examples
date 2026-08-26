//! Safety flags. Independent of the composite grade.
//!
//! Priority ordering: high / medium / low. The set returned is used for
//! the “Safety flags” section of the report and as `medical_operation_note_grade_flag`
//! rows in the database.

use super::types::{AdditionalFlag, FlagPriority, OperationNote};

/// Collect.
#[must_use]
#[allow(clippy::too_many_lines)] // linear clinical rule list; splitting adds indirection, not clarity
pub fn collect(note: &OperationNote) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let counts_ok = note.swab_count_agreed && note.needle_count_agreed && note.instrument_count_agreed;

    if !counts_ok {
        flags.push(AdditionalFlag {
            flag_id: "incorrect-count".into(),
            category: "count-discrepancy".into(),
            priority: FlagPriority::High,
            description: "Swab / needle / instrument count not agreed at sign-out".into(),
            suggested_action: "Reconcile count immediately; do not allow patient to leave theatre until resolved or imaging excludes retained item".into(),
        });
    }

    if note.retained_foreign_body {
        flags.push(AdditionalFlag {
            flag_id: "retained-foreign-body".into(),
            category: "retained-foreign-body".into(),
            priority: FlagPriority::High,
            description: "Retained foreign body declared (never-event candidate)".into(),
            suggested_action: "Notify governance lead; obtain imaging; complete Datix; report to NHS England as Never Event".into(),
        });
    }

    if note.never_event_flagged {
        flags.push(AdditionalFlag {
            flag_id: "never-event".into(),
            category: "never-event".into(),
            priority: FlagPriority::High,
            description: format!(
                "Never-event candidate flagged{}",
                if note.never_event_kind.is_empty() {
                    String::new()
                } else {
                    format!(": {}", note.never_event_kind)
                }
            ),
            suggested_action: "Statutory NHS England Never Event notification within 2 working days".into(),
        });
    }

    if let Some(ebl) = note.estimated_blood_loss_ml {
        if ebl > 1500 {
            flags.push(AdditionalFlag {
                flag_id: "massive-haemorrhage".into(),
                category: "haemorrhage".into(),
                priority: FlagPriority::High,
                description: format!("Massive haemorrhage (EBL {ebl} mL)"),
                suggested_action: "Activate massive haemorrhage protocol; transfusion lab support; ITU referral".into(),
            });
        }
    }

    if note.massive_haemorrhage_protocol_activated
        || note.transfusion_prbc_units.unwrap_or(0) >= 4
    {
        flags.push(AdditionalFlag {
            flag_id: "massive-transfusion".into(),
            category: "transfusion".into(),
            priority: FlagPriority::High,
            description: "Massive transfusion (≥ 4 units PRBC or massive haemorrhage protocol activated)".into(),
            suggested_action: "Continue ratio-based transfusion; consider TEG/ROTEM; transfusion-reaction surveillance".into(),
        });
    }

    if note.converted_to_open {
        flags.push(AdditionalFlag {
            flag_id: "conversion-to-open".into(),
            category: "conversion".into(),
            priority: FlagPriority::Medium,
            description: "Planned minimally-invasive case converted to open".into(),
            suggested_action: "Document conversion reason; review with surgical lead; audit for M&M".into(),
        });
    }

    if note.intra_operative_arrest {
        flags.push(AdditionalFlag {
            flag_id: "intra-operative-arrest".into(),
            category: "anaesthetic".into(),
            priority: FlagPriority::High,
            description: "Cardiac or respiratory arrest in theatre".into(),
            suggested_action: "Post-arrest care bundle; ICU admission; family notification; debrief and SI report".into(),
        });
    }

    if !note.anaesthetic_event.is_empty() && note.anaesthetic_event != "none" {
        flags.push(AdditionalFlag {
            flag_id: "anaesthetic-incident".into(),
            category: "anaesthetic".into(),
            priority: FlagPriority::High,
            description: format!("Anaesthetic incident: {}", note.anaesthetic_event),
            suggested_action: "Anaesthetic incident reporting; consider RCoA SALG submission".into(),
        });
    }

    if !note.recovery_destination.is_empty()
        && !note.planned_recovery_destination.is_empty()
        && note.recovery_destination != note.planned_recovery_destination
    {
        flags.push(AdditionalFlag {
            flag_id: "unplanned-disposition".into(),
            category: "disposition".into(),
            priority: FlagPriority::High,
            description: format!(
                "Unplanned step-up: planned {} → actual {}",
                note.planned_recovery_destination, note.recovery_destination
            ),
            suggested_action: "Document escalation reason; review with consultant on-call; communicate to next-of-kin".into(),
        });
    }

    flags
}

#[cfg(test)]
mod tests {
    use super::*;

    fn base_note() -> OperationNote {
        OperationNote {
            swab_count_agreed: true,
            needle_count_agreed: true,
            instrument_count_agreed: true,
            ..OperationNote::default()
        }
    }

    #[test]
    fn clean_note_no_flags() {
        assert!(collect(&base_note()).is_empty());
    }

    #[test]
    fn count_disagreed_flag() {
        let mut n = base_note();
        n.needle_count_agreed = false;
        let flags = collect(&n);
        assert_eq!(flags.len(), 1);
        assert_eq!(flags[0].flag_id, "incorrect-count");
    }

    #[test]
    fn massive_haemorrhage_flag() {
        let mut n = base_note();
        n.estimated_blood_loss_ml = Some(2000);
        let flags = collect(&n);
        assert!(flags.iter().any(|f| f.flag_id == "massive-haemorrhage"));
    }

    #[test]
    fn massive_transfusion_flag() {
        let mut n = base_note();
        n.transfusion_prbc_units = Some(6);
        let flags = collect(&n);
        assert!(flags.iter().any(|f| f.flag_id == "massive-transfusion"));
    }
}
