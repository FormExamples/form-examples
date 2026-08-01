use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "return_to_works",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("statement_kind", ColType::StringWithDefault("fit-note".to_string())),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::StringNull),
            ("absence_first_day", ColType::DateNull),
            ("absence_total_calendar_days", ColType::IntegerNull),
            ("prior_med3_reference", ColType::StringWithDefault(String::new())),
            ("prior_self_certification_reference", ColType::StringWithDefault(String::new())),
            ("primary_diagnosis_text", ColType::StringWithDefault(String::new())),
            ("primary_diagnosis_snomed", ColType::StringWithDefault(String::new())),
            ("primary_diagnosis_icd10", ColType::StringWithDefault(String::new())),
            ("comorbid_conditions", ColType::TextWithDefault(String::new())),
            ("mechanism", ColType::StringWithDefault(String::new())),
            ("workplace_cause", ColType::StringWithDefault(String::new())),
            ("riddor_reference", ColType::StringWithDefault(String::new())),
            ("current_medications", ColType::TextWithDefault(String::new())),
            ("ongoing_therapy", ColType::TextWithDefault(String::new())),
            ("last_consultation_date", ColType::DateNull),
            ("anticipated_recovery_trajectory", ColType::StringWithDefault(String::new())),
            ("specialist_followup_required", ColType::StringWithDefault(String::new())),
            ("mobility", ColType::StringWithDefault(String::new())),
            ("manual_handling_capacity_kg", ColType::DoubleNull),
            ("cognition", ColType::StringWithDefault(String::new())),
            ("mood", ColType::StringWithDefault(String::new())),
            ("sleep", ColType::StringWithDefault(String::new())),
            ("pain_score_0_10", ColType::IntegerNull),
            ("driving_capacity", ColType::StringWithDefault(String::new())),
            ("standing_tolerance_minutes", ColType::IntegerNull),
            ("sitting_tolerance_minutes", ColType::IntegerNull),
            ("screen_tolerance_minutes", ColType::IntegerNull),
            ("adl_independence", ColType::StringWithDefault(String::new())),
            ("fitness_statement_computed", ColType::StringWithDefault(String::new())),
            ("fitness_statement_final", ColType::StringWithDefault(String::new())),
            ("clinician_override", ColType::StringWithDefault(String::new())),
            ("clinician_override_reason", ColType::TextWithDefault(String::new())),
            ("clinician_confidence", ColType::StringWithDefault(String::new())),
            ("valid_from", ColType::DateNull),
            ("valid_until", ColType::DateNull),
            ("validity_weeks", ColType::IntegerNull),
            ("reassessment_required", ColType::StringWithDefault(String::new())),
            ("phased_return_applicable", ColType::StringWithDefault(String::new())),
            ("phased_return_template", ColType::StringWithDefault(String::new())),
            ("phased_return_target_date", ColType::DateNull),
            ("phased_return_schedule_json", ColType::JsonBinary),
            ("phased_return_support_contact", ColType::TextWithDefault(String::new())),
            ("workstation_review_required", ColType::StringWithDefault(String::new())),
            ("additional_adjustments_text", ColType::TextWithDefault(String::new())),
            ("review_location", ColType::StringWithDefault(String::new())),
            ("review_date", ColType::DateNull),
            ("occupational_health_referral_made", ColType::StringWithDefault(String::new())),
            ("dvla_notification_required", ColType::StringWithDefault(String::new())),
            ("employer_oh_notified", ColType::StringWithDefault(String::new())),
            ("return_to_work_meeting_scheduled", ColType::StringWithDefault(String::new())),
            ("maternity_certificate_reference", ColType::StringWithDefault(String::new())),
            ("final_notes", ColType::TextWithDefault(String::new())),
            ("signature_svg", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ("employer", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_works").await
    }
}
