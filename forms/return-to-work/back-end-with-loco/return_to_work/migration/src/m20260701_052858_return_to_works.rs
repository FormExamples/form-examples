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
            ("status", ColType::String),
            ("statement_kind", ColType::String),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::StringNull),
            ("absence_first_day", ColType::DateNull),
            ("absence_total_calendar_days", ColType::IntegerNull),
            ("prior_med3_reference", ColType::String),
            ("prior_self_certification_reference", ColType::String),
            ("primary_diagnosis_text", ColType::String),
            ("primary_diagnosis_snomed", ColType::String),
            ("primary_diagnosis_icd10", ColType::String),
            ("comorbid_conditions", ColType::Text),
            ("mechanism", ColType::String),
            ("workplace_cause", ColType::String),
            ("riddor_reference", ColType::String),
            ("current_medications", ColType::Text),
            ("ongoing_therapy", ColType::Text),
            ("last_consultation_date", ColType::DateNull),
            ("anticipated_recovery_trajectory", ColType::String),
            ("specialist_followup_required", ColType::String),
            ("mobility", ColType::String),
            ("manual_handling_capacity_kg", ColType::DoubleNull),
            ("cognition", ColType::String),
            ("mood", ColType::String),
            ("sleep", ColType::String),
            ("pain_score_0_10", ColType::IntegerNull),
            ("driving_capacity", ColType::String),
            ("standing_tolerance_minutes", ColType::IntegerNull),
            ("sitting_tolerance_minutes", ColType::IntegerNull),
            ("screen_tolerance_minutes", ColType::IntegerNull),
            ("adl_independence", ColType::String),
            ("fitness_statement_computed", ColType::String),
            ("fitness_statement_final", ColType::String),
            ("clinician_override", ColType::String),
            ("clinician_override_reason", ColType::Text),
            ("clinician_confidence", ColType::String),
            ("valid_from", ColType::DateNull),
            ("valid_until", ColType::DateNull),
            ("validity_weeks", ColType::IntegerNull),
            ("reassessment_required", ColType::String),
            ("phased_return_applicable", ColType::String),
            ("phased_return_template", ColType::String),
            ("phased_return_target_date", ColType::DateNull),
            ("phased_return_schedule_json", ColType::JsonBinary),
            ("phased_return_support_contact", ColType::Text),
            ("workstation_review_required", ColType::String),
            ("additional_adjustments_text", ColType::Text),
            ("review_location", ColType::String),
            ("review_date", ColType::DateNull),
            ("occupational_health_referral_made", ColType::String),
            ("dvla_notification_required", ColType::String),
            ("employer_oh_notified", ColType::String),
            ("return_to_work_meeting_scheduled", ColType::String),
            ("maternity_certificate_reference", ColType::String),
            ("final_notes", ColType::Text),
            ("signature_svg", ColType::Text),
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
